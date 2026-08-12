---
title: "AsDuels: Maintaining a Minecraft Duel Plugin"
date: 2026-08-10 21:00:00
tags: [Minecraft, Java, Development, Plugin]
---

AsDuels is a 1v1 duel plugin for Paper/Spigot 1.21+. I picked it up as a remake & maintenance project for my server MINEMC. Over a dozen releases (2.10 → 2.24), I fixed deep bugs, added an anti-farm points system, and integrated with anticheat and packet interception. Here's the journey from a developer's perspective.

AsDuels 是一个面向 Paper/Spigot 1.21+ 的 1v1 决斗插件。我以「重构 + 长期维护」的身份接手，并在我的服务器 MINEMC 上持续迭代。从 2.10 到 2.24，我修了深层 Bug、加了防刷积分系统、接入反作弊与底层封包拦截。下面从开发者视角聊聊整个过程。

<!-- more -->

## Why maintain someone else's plugin? | 为什么维护别人的插件？

My survival server MINEMC runs a duel arena where players challenge each other, climb ranks, and earn daily rewards. The original AsDuels worked, but real servers always hit edge cases the author never tested:

我的生存服 MINEMC 有一个决斗竞技场，玩家互相挑战、爬段位、领每日奖励。原版 AsDuels 能用，但真实服务器总会碰到作者没测过的边界情况：

- A player gets **kicked by the anticheat mid-duel** → the match is stuck forever, arena locked as `IN_USE`.
- The **points settlement throws** (a reward command fails) → cleanup never runs, players frozen in the lobby.
- **Spectators** in Spectator mode can teleport to *any* player, steal equipment via fishing rods, or interact with chests.

- 玩家**中途被反作弊踢出** → 比赛永久卡死，竞技场锁死在 `IN_USE`。
- **积分结算抛异常**（比如奖励命令执行失败）→ 清理代码永远不会跑，玩家卡在大厅动不了。
- **旁观者**能传送到*任意*玩家、用钓鱼竿偷装备、开竞技场箱子。

These are exactly the bugs that only appear after a feature ships to hundreds of players.

这些正是功能上线、面对几百个玩家之后才会暴露的 Bug。

## The hardest bug: arena stuck forever | 最棘手的 Bug：竞技场永久卡死

The original `endMatch()` did:

原版 `endMatch()` 是这样写的：

```java
match.setState(MatchState.ENDING);
plugin.getPointsManager().onMatchEnd(winner, loser); // might throw!
finishMatchCleanup(match, lobby); // never reached if throw
```

If `onMatchEnd` threw (e.g., a reward command `points give` failed because the target was offline), `finishMatchCleanup` never executed. The match stayed in the map, the arena stayed `IN_USE`, and *nobody* could play there again. Worse: `/ad end` had a guard `if (state == ENDING) return;` that silently skipped cleanup on the already-stuck match — while still telling the admin "forced draw success".

一旦 `onMatchEnd` 抛异常（例如目标离线导致 `points give` 命令失败），`finishMatchCleanup` 就不会执行。比赛残留在 map 里，竞技场一直是 `IN_USE`，*谁都没法再进这个场地*。更糟的是 `/ad end` 有个 `if (state == ENDING) return;` 的守卫，对已经卡死的对局静默跳过清理——却还给管理员提示"已强制结束"。

The fix in **v2.12**:

**v2.12** 的修复：

```java
try {
    plugin.getPointsManager().onMatchEnd(winner, loser);
} catch (Exception ex) {
    plugin.getLogger().warning("points settlement error: " + ex.getMessage());
} finally {
    forceCleanup(match); // guaranteed cleanup
}
```

Plus an idempotent `forceCleanup()` as a safety net for any `ENDING` leftovers. Lesson: **never let a reward/side-effect failure corrupt core state transitions.**

另外加了幂等的 `forceCleanup()` 兜底，专门清理一切 `ENDING` 残留。教训：**绝不能让奖励/副作用失败污染核心状态流转。**

## Anti-farm: daily win cap + loss streak cooldown | 防刷：每日赢分上限 + 连败冷却

Points power the rank ladder (流浪者 → 屠龙者). Two farm vectors needed countermeasures:

积分驱动段位（流浪者 → 屠龙者）。有两个刷分渠道需要堵：

1. **Daily win cap** — a player could farm 30+ wins a day and dominate the leaderboard. So I track *gained points per day* (Beijing time, reset at 04:00) and stop granting points once `daily-win-points-limit` (default 300) is hit. The cap message shows how much they *did* get.

1. **每日赢分上限** —— 玩家一天能刷 30+ 胜场霸榜。所以我按天（北京时间，凌晨 4 点刷新）记录"当日已获得积分"，一旦达到 `daily-win-points-limit`（默认 300）就不再加分，提示里会告诉你实际拿到了多少。

2. **Loss streak cooldown** — losing 10 in a row now puts the player in a 60-minute cooldown: they can't queue, challenge, or accept. One win clears the streak. This stops deliberate point-dumping / win-trading alts, and forces a healthy break.

2. **连败冷却** —— 连续输 10 场进入 60 分钟冷却：不能排队、不能发起/接受挑战。赢一场立刻清零。这能阻止故意掉分 / 小号互刷，也强制玩家休息一下。

A timezone bug taught me something: I first computed "today" with `LocalDate.now()` (server TZ). On a server with a non-Beijing timezone, "yesterday's" wins leaked into "today", and players hit the cap after one match. Switching to `ZoneId.of("Asia/Shanghai")` fixed it. **Time-based logic must pin an explicit timezone.**

一个时区 Bug 也给我上了课：我一开始用 `LocalDate.now()`（服务器时区）算"今天"。在非北京时区的服务器上，"昨天"的赢分会漏进"今天"，玩家打一把就撞上限。改成 `ZoneId.of("Asia/Shanghai")` 后解决。**基于时间逻辑必须钉死一个明确时区。**

## Anticheat: don't fight the client, intercept the packet | 反作弊：别跟客户端较劲，去拦截数据包

The duel arena PvP tripped **Vulcan** into kicking players — which re-triggered the stuck-match bug. The clean solution was a `VulcanFlagEvent` listener that cancels every flag raised by an in-match player. Anticheat stays fully active outside the arena.

竞技场 PVP 会触发 **Vulcan** 把玩家踢下线——这又会重新触发卡场 Bug。干净的解法是加一个 `VulcanFlagEvent` 监听器，把比赛中玩家触发的所有检测直接取消。竞技场外反作弊照常工作。

Spectator abuse was nastier. Spectator-mode "teleport to player" is **pure client-side** — Bukkit events never fire, so `PlayerInteractEntityEvent` cancellations did nothing. The only real fix is intercepting packets. Since MINEMC runs **PacketEvents**, I registered a `PacketListenerAbstract` that:

旁观者滥用更麻烦。旁观模式"传送到玩家"是**纯客户端行为**——Bukkit 事件根本不触发，取消 `PlayerInteractEntityEvent` 毫无作用。唯一的真解是拦截数据包。因为 MINEMC 装了 **PacketEvents**，我注册了一个 `PacketListenerAbstract`：

- drops `INTERACT_ENTITY` packets when a spectator right-clicks a non-duel player,
- drops `SPECTATE` packets from spectators.

- 旁观者右键非本场玩家时，丢弃 `INTERACT_ENTITY` 包；
- 旁观者的 `SPECTATE` 包一律丢弃。

Now spectators can only follow the two players inside their own match. **When the client owns the behavior, the server must own the network.**

现在旁观者只能跟随本场竞技场里的两名选手。**当行为由客户端主导时，服务器必须掌控网络层。**

## Respecting player inventory | 尊重玩家背包

A kit plugin that returns your inventory wrongly is a data-loss bug. I fixed `startMatch` to create the `Match` and call `saveInventory()` *before* clearing the player's inventory — the original cleared first and never saved, so restore gave back an empty inventory. Small ordering fix, huge trust win.

一个会还错背包的 Kit 插件就是数据丢失事故。我修了 `startMatch`，让它在清空玩家背包**之前**就创建 `Match` 并调用 `saveInventory()`——原版是先清空再保存，导致还原时还回一个空背包。一个顺序问题，却是信任的胜负手。

## What I'd do differently | 如果能重来

- **Write tests early.** Packet interception and match-state transitions are prime test territory.
- **Instrument first.** A simple `/ad end` admin escape hatch saved us repeatedly; add a debug command before you need it.
- **Config is the API.** Every anti-farm knob (`daily-win-points-limit`, `loss-streak-cooldown`, `loss-cooldown-minutes`) is config-driven, so I can tune without recompiling.

- **早点写测试。** 封包拦截和比赛状态流转是最该被测试覆盖的地方。
- **先埋点。** 一个简单的 `/ad end` 管理逃生门救了我们很多次；在你需要之前就把调试命令加好。
- **配置即 API。** 所有防刷旋钮（`daily-win-points-limit`、`loss-streak-cooldown`、`loss-cooldown-minutes`）都是配置驱动，不用重编译就能调参。

The full changelog lives in the plugin's `更新说明.md`. If you run a 1.21+ server and want a hardened duel plugin, AsDuels is a great starting point — just expect to meet its edge cases.

完整变更日志在插件的 `更新说明.md` 里。如果你也在跑 1.21+ 服务器、想要一个打磨过的决斗插件，AsDuels 是不错的起点——只是要做好迎接它边界情况的准备。
