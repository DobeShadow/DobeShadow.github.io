---
title: "DsBorder: Lightweight per-world border reminder plugin"
date: 2026-08-15 12:00:00
tags: [Minecraft, Java, Development, Plugin]
---

DsBorder is a lightweight Minecraft plugin that reminds players when they step outside a per-world boundary — without blocking them, and without touching any world data. I built it to replace the hard wall of ChunkyBorder/vanilla world borders with a soft "you are now outside the safe zone" ActionBar notice, paired with periodic cleanup of out-of-bounds claims.

DsBorder 是一个轻量级 Minecraft 边界提醒插件：按世界配置半径，玩家越界时循环发送 ActionBar 警告，不阻挡、不拉回，也不修改任何世界数据。我做它是为了取代 ChunkyBorder / 原版边界的"硬墙"，改成"你已进入清理区"的软提示，配合对边界外领地的定期清理。

<!-- more -->

## The problem

My server MINEMC runs a large survival world where players build bases and run far out to explore. I wanted players to **keep exploring** past a certain radius, but I also wanted any claims or buildings beyond that line to be **periodically wiped**. The vanilla world border blocks movement, and ChunkyBorder's border is an invisible barrier that teleports players back — both wrong for the goal.

我的服务器 MINEMC 是一个大型生存服，玩家会在主世界建房，也会跑很远去探索。我希望玩家在超过一定半径后**仍能继续跑图**，但边界线之外的圈地与建筑要被**定期清理**。原版世界边界会挡人，ChunkyBorder 的边界更是把玩家传回边界内——两者都不符合需求。

## What DsBorder does

- **Per-world config**: each world gets its own center, shape (square/circle), radius and message.
- **Non-blocking**: it only reads player coordinates and sends an ActionBar — it never touches `worldborder`, never deletes chunks, never edits entities or data.
- **Safe-zone feedback**: cycling warning while outside; a single "you're back in the safe zone" notice when returning.
- **Hot-reload**: `/dsborder reload` applies config changes without a server restart.

- **多世界独立配置**：每个世界可单独设置中心点、形状（方形/圆形）、半径与文案。
- **零侵入**：只读取玩家坐标并发送 ActionBar，不碰 worldborder、不删区块、不改实体与数据。
- **回程反馈**：越界时循环警告，回到范围内提示"已回安全区"。
- **热重载**：`/dsborder reload` 无需重启即可应用新配置。

## Usage

```
  &8Ds&fBorder &8- &7边界提醒
  &7命令: &f/dsborder &8[...]
  &7参数:
    &8- &freload   &7重载配置文件
    &8- &finfo   &7查看当前世界边界设置
    &8- &ftest   &7手动触发一次提醒
```

## Config

```yaml
Settings:
  interval-ticks: 40          # check interval (20 = 1s)
  safe-message-enabled: true  # notify when back inside

Worlds:
  world_the_end:
    enabled: true
    center-x: 0
    center-z: 0
    shape: square
    radius: 5000
    message: '&c&l警告: 你已越过边界($radius格)! 此范围外的圈地与建筑将被定期清理!'
    safe-message: '&a&l你已回到安全区($radius格内)'
```

Messages support color codes and placeholders: `$radius`, `$x`, `$z`, `$world`. All player-facing text lives in a separate `messages.yml`, referenced by key in the code.

消息支持颜色代码与占位符 `$radius $x $z $world`。所有玩家可见文本都外置到 `messages.yml`，代码中通过 key 引用。

## Design choices

- **ActionBar over chat** — unobtrusive, doesn't spam the chat box while exploring.
- **Message externalization** — like my other plugins, text is keyed in a language file, so it can be translated or restyled without touching code.
- **Help style** — the `/dsborder` help follows the unified format I use across DsBoss/DsTeam: `&8`+`&f` plugin-name split, `&8- &7` description, two-space indents.

- **ActionBar 而非聊天栏**——探索时不刷屏，干扰最小。
- **消息外置**——和我其它插件一致，文案全部 key 化在语言文件里，改文案/翻译无需动代码。
- **帮助风格统一**——`/dsborder` 帮助沿用我在 DsBoss/DsTeam 上的统一排版：`&8`+`&f` 分段插件名、`&8- &7` 描述、两空格缩进。

## Source

- [GitHub: DobeShadow/DsBorder](https://github.com/DobeShadow/DsBorder)
