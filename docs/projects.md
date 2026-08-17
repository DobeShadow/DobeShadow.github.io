---
title: Projects
description: Open source projects by DobeShadow
---

# Projects

Most of my projects are **Minecraft plugins** — built with Paper/Bukkit, designed to run on my server and shared openly on GitHub.

## AsDuels

1v1 duel plugin with ranks, points, daily rewards and anti-farm protection. Personal server maintenance & updates only.

1v1 决斗插件，含段位、积分、每日奖励与防刷保护。仅供个人服务器维护与更新。

- **Original author**: ItzAzeem / AsDevs — [asdevs.netlify.app](https://asdevs.netlify.app/)
- **原插件作者**：ItzAzeem / AsDevs — [asdevs.netlify.app](https://asdevs.netlify.app/)
- **Tech**: Java, Paper API
- **Features**: 1v1 matches, matchmaking queue, rank ladder, daily rewards, daily win cap, loss-streak cooldown, spectator mode, anticheat & packet-level spectator protection
- [GitHub](https://github.com/DobeShadow/AsDuels)

## DsBoss

Configurable boss plugin with timed spawns and server-wide broadcasts.

- **Tech**: Java, Paper API
- **Features**: scheduled spawns, boss bars, potion effects, admin commands
- [GitHub](https://github.com/DobeShadow/DsBoss)

## DsTeam

Lightweight team system with PvP protection, summon and GUI.

- **Tech**: Java, Paper API
- **Features**: teams up to 6 players, member summon, team chat
- [GitHub](https://github.com/DobeShadow/DsTeam)

## DsBorder

Per-world border reminder — ActionBar warnings when players step outside a configured radius, without blocking.

- **Tech**: Java, Paper API
- **Features**: per-world center/shape/radius config, square & circle, non-blocking ActionBar reminders, safe-zone return notice, hot-reload
- [GitHub](https://github.com/DobeShadow/DsBorder)

## dsh-sound-alerts

DSH plugin that plays notification sounds for task completion / permission requests / errors — host-side events are pushed to the web client and played without blocking the conversation (task complete = pleasant ascending tone, permission ready = double-tone attention, error = descending warning). Sounds on by default, controllable from the panel.

DSH 插件：任务完成 / 权限请求 / 出错的提示音——host 监听会话事件并推送提示信号，web 客户端播放不同音效（完成=悦耳上行音，权限=双音注意，出错=下行警示），不阻塞对话内容；默认开启，可在面板控制。

- **Tech**: Node.js, DSH cordis plugin
- **Features**: per-kind sound mapping, global mute & per-category toggles, `sound_alert_status` query tool

## dsh-session-history

DSH web plugin that keeps a persistent "past conversations" panel on the left of the conversation view — browse previous sessions by title, first-message excerpt and time; click any entry to open it and jump straight to its first user message.

DSH web 插件：在对话界面左侧提供常驻的「历史会话」面板，按标题 + 首条消息摘要 + 时间快速浏览之前的对话，点击任意会话即可打开并定位到该会话的第一条用户消息。

- **Tech**: Node.js, DSH cordis plugin
- **Features**: persistent sidebar panel, session list with excerpts & timestamps, one-click jump to first user message

More projects to come as I explore materials research tooling and data analysis.
