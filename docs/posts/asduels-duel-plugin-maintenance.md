---
title: "AsDuels: Maintaining a Minecraft Duel Plugin"
date: 2026-08-12 21:00:00
tags: [Minecraft, Java, Development, Plugin]
---

AsDuels is a 1v1 duel plugin for Paper/Spigot 1.21+. I picked it up as a remake & maintenance project for my server MINEMC. Over a dozen releases (2.10 → 2.24), I fixed deep bugs, added an anti-farm points system, and integrated with anticheat and packet interception. Here's the journey from a developer's perspective.

AsDuels 是一个面向 Paper/Spigot 1.21+ 的 1v1 决斗插件。我以"重构 + 长期维护"的身份接手了它，在自己的服务器 MINEMC 上持续迭代。从 2.10 一路更新到 2.24，我修复了不少隐蔽 Bug，加上了防刷积分系统，还接入了反作弊和底层封包拦截。这篇文章就从开发者视角，聊聊这一路踩过的坑。

<!-- more -->

## The version history: 1.0.0 → 1.0.6 → 2.0+

The plugin started as the official release on Modrinth (**1.0.0**, by ItzAzeem). From there I forked a private maintenance line:

这个插件最初是 Modrinth 上的官方版本（**1.0.0**，作者 ItzAzeem）。我在它的基础上维护了一条私有分支线：

- **1.0.1 → 1.0.6** — patching the official build: bug fixes, points/rank system, full language file, security hardening, anti-farm mechanics.
- **1.0.1 → 1.0.6** — 这一阶段主要在官方版本上打补丁：修 Bug、加积分/段位系统、补全语言文件、做安全加固、引入防刷机制。
- **2.0+** — a clean break: I rebased the codebase into my own major line. Everything after 2.0 is independent of upstream, including the queue GUI, forfeit & draw mechanics, daily win cap, loss-streak cooldown, and anticheat/packet integration.
- **2.0+** — 这是一次彻底的分叉：我把代码重构成了自己的主线版本。2.0 之后的功能全部和上游无关，包括观战 GUI、认输/平局机制、每日赢分上限、连败冷却，以及反作弊与封包拦截。

A one-line summary of the timeline: `官方 1.0.0 → 本地修补 1.0.1~1.0.6 → 独立维护 2.0~2.24`.

一句话总结时间线：`官方 1.0.0 → 本地修补 1.0.1~1.0.6 → 独立维护 2.0~2.24`。

## Why maintain someone else's plugin?

My survival server MINEMC runs a duel arena where players challenge each other, climb ranks, and earn daily rewards. The original AsDuels worked, but real servers always hit edge cases the author never tested:

我的生存服 MINEMC 里有一个决斗竞技场，玩家可以互相约战、冲击段位、领取每日奖励。原版 AsDuels 用起来没什么大问题，但真正上线后，总会遇到作者当初没测到的边界情况：

- A player gets **kicked by the anticheat mid-duel** → the match is stuck forever, arena locked as `IN_USE`.
- The **points settlement throws** (a reward command fails) → cleanup never runs, players frozen in the lobby.
- **Spectators** in Spectator mode can teleport to *any* player, steal equipment via fishing rods, or interact with chests.

- 玩家**中途被反作弊踢出** → 比赛直接卡死，竞技场永远锁在 `IN_USE`。
- **积分结算抛异常**（比如某个奖励命令执行失败）→ 清理逻辑根本不跑，玩家被晾在大厅动不了。
- **旁观者**能传送到*任意*玩家身边、用钓鱼竿偷装备、开竞技场里的箱子。

These are exactly the bugs that only appear after a feature ships to hundreds of players.

这些 Bug 都只在功能正式上线、面对几百个玩家之后才会冒出来。

## The hardest bug: arena stuck forever

The original `endMatch()` did:

原版 `endMatch()` 是这样写的：

```java
match.setState(MatchState.ENDING);
plugin.getPointsManager().onMatchEnd(winner, loser); // might throw!
finishMatchCleanup(match, lobby); // never reached if throw
```

If `onMatchEnd` threw (e.g., a reward command `points give` failed because the target was offline), `finishMatchCleanup` never executed. The match stayed in the map, the arena stayed `IN_USE`, and *nobody* could play there again. Worse: `/ad end` had a guard `if (state == ENDING) return;` that silently skipped cleanup on the already-stuck match — while still telling the admin "forced draw success".

只要 `onMatchEnd` 抛一次异常（比如对方离线，导致 `points give` 命令执行失败），`finishMatchCleanup` 就永远不会被调用。比赛残留在 map 里，竞技场一直是 `IN_USE`，*这个场地从此再也进不去*。更坑的是 `/ad end` 里还有一句 `if (state == ENDING) return;`——对已经卡死的对局它直接静默返回，却照样给管理员提示"已强制结束"。

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

另外我还加了一个幂等的 `forceCleanup()` 作为兜底，专门处理所有残留在 `ENDING` 状态的对局。这次的经验是：**绝不能让奖励发放之类的副作用失败，反过来污染了核心的状态流转。**

## Anti-farm: daily win cap + loss streak cooldown

Points power the rank ladder (流浪者 → 屠龙者). Two farm vectors needed countermeasures:

积分决定了段位（流浪者 → 屠龙者），也因此出现了两条刷分路子需要堵：

1. **Daily win cap** — a player could farm 30+ wins a day and dominate the leaderboard. So I track *gained points per day* (Beijing time, reset at 04:00) and stop granting points once `daily-win-points-limit` (default 300) is hit. The cap message shows how much they *did* get.

1. **每日赢分上限** —— 如果不管，一天刷个三四十胜场就能霸榜。所以我会按天（北京时间，凌晨 4 点刷新）统计"当天已经拿到的积分"，一旦撞上 `daily-win-points-limit`（默认 300）就不再加分，提示里也会写清楚这一把实际给了多少分。

2. **Loss streak cooldown** — losing 10 in a row now puts the player in a 60-minute cooldown: they can't queue, challenge, or accept. One win clears the streak. This stops deliberate point-dumping / win-trading alts, and forces a healthy break.

2. **连败冷却** —— 连续输满 10 场会进入 60 分钟冷却：期间不能排队、不能发起或接受挑战，赢一场立刻解除。这既挡掉了故意掉分、小号互刷，也让连败的玩家能歇口气。

A timezone bug taught me something: I first computed "today" with `LocalDate.now()` (server TZ). On a server with a non-Beijing timezone, "yesterday's" wins leaked into "today", and players hit the cap after one match. Switching to `ZoneId.of("Asia/Shanghai")` fixed it. **Time-based logic must pin an explicit timezone.**

这中间还踩过一个时区的坑：一开始我用 `LocalDate.now()`（按服务器时区）来判断"今天"。服务器时区不是北京时间的时候，"昨天"赢的分会被算进"今天"，玩家明明刚打一把就提示撞上限。换成 `ZoneId.of("Asia/Shanghai")` 之后才彻底解决。**凡是跟日期时间相关的逻辑，一定要显式锁定一个时区。**

## Anticheat: don't fight the client, intercept the packet

The duel arena PvP tripped **Vulcan** into kicking players — which re-triggered the stuck-match bug. The clean solution was a `VulcanFlagEvent` listener that cancels every flag raised by an in-match player. Anticheat stays fully active outside the arena.

竞技场里的 PVP 会触发 **Vulcan** 把玩家误踢下线——这又会反过来触发之前那个卡场 Bug。干净的解法是挂一个 `VulcanFlagEvent` 监听器，把比赛中玩家触发的所有检测直接取消。竞技场之外，反作弊照常全功率运行，互不干扰。

Spectator abuse was nastier. Spectator-mode "teleport to player" is **pure client-side** — Bukkit events never fire, so `PlayerInteractEntityEvent` cancellations did nothing. The only real fix is intercepting packets. Since MINEMC runs **PacketEvents**, I registered a `PacketListenerAbstract` that:

旁观者的滥用更麻烦。旁观模式里的"传送到玩家"是**纯客户端行为**——Bukkit 事件压根不会触发，取消 `PlayerInteractEntityEvent` 一点用都没有。唯一的解法是直接拦截数据包。正好 MINEMC 装了 **PacketEvents**，我就注册了一个 `PacketListenerAbstract`：

- drops `INTERACT_ENTITY` packets when a spectator right-clicks a non-duel player,
- drops `SPECTATE` packets from spectators.

- 旁观者右键非本场玩家时，丢弃 `INTERACT_ENTITY` 包；
- 旁观者的 `SPECTATE` 包一律丢弃。

Now spectators can only follow the two players inside their own match. **When the client owns the behavior, the server must own the network.**

这样一来，旁观者只能跟本场竞技场里的两名选手，别的玩家一律无法传送过去。**当行为逻辑在客户端手里时，服务器能管的就只剩网络层了。**

## Respecting player inventory

A kit plugin that returns your inventory wrongly is a data-loss bug. I fixed `startMatch` to create the `Match` and call `saveInventory()` *before* clearing the player's inventory — the original cleared first and never saved, so restore gave back an empty inventory. Small ordering fix, huge trust win.

一个会把背包还错的 Kit 插件，本质上就是一次数据丢失事故。我修了 `startMatch`，让它在清空玩家背包**之前**就创建 `Match` 并调用 `saveInventory()`——原版是先清空再保存，导致打完还原时还回一个空背包。表面看只是先后顺序的问题，实际却直接决定玩家信不信得过你。

## What I'd do differently

- **Write tests early.** Packet interception and match-state transitions are prime test territory.
- **Instrument first.** A simple `/ad end` admin escape hatch saved us repeatedly; add a debug command before you need it.
- **Config is the API.** Every anti-farm knob (`daily-win-points-limit`, `loss-streak-cooldown`, `loss-cooldown-minutes`) is config-driven, so I can tune without recompiling.

- **早点写测试。** 封包拦截、比赛状态流转这类最容易出问题的地方，最值得先被测试覆盖。
- **先埋好逃生口。** 一个简单的 `/ad end` 管理命令救了我们太多次；在你真正需要之前，就该先把调试用的命令写好。
- **配置就是 API。** 所有防刷相关的参数（`daily-win-points-limit`、`loss-streak-cooldown`、`loss-cooldown-minutes`）全都走配置，想调整数值根本不用重新编译。
