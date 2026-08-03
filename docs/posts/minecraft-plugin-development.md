---
title: My Journey Building Minecraft Plugins
date: 2026-07-28
tags: [Minecraft, Java, Development]
---

It started with a simple question: *"What if the server had a configurable boss that spawns at 8 PM?"* That question became [CustomBoss](https://github.com/DobeShadow/CustomBoss).

## How I got started

I run a survival server called MINEMC, and I kept hitting the same wall: public plugins never did *exactly* what I wanted. So I learned to write my own. The Bukkit/Paper API is surprisingly approachable once you get past the event system.

## What I've built so far

| Plugin | What it does |
|---|---|
| [CustomBoss](https://github.com/DobeShadow/CustomBoss) | Timed boss spawns, custom stats, broadcasts |
| [ItemBank](https://github.com/DobeShadow/ItemBank) | Deposit items, earn daily points, redeem in shop |
| [TeamPlugin](https://github.com/DobeShadow/TeamPlugin) | Lightweight teams with PvP protection &amp; summon |
| [FreeResidence](https://github.com/DobeShadow/FreeResidence) | One free land claim for new players |
| [AtPlayer](https://github.com/DobeShadow/AtPlayer) | `@mention` players with title + sound alerts |

## Lessons learned

1. **Config files are the API.** A good plugin is 80% well-designed config.
2. **Async everything.** Never block the main thread on I/O.
3. **Ship small, iterate fast.** v1 is never perfect, and that's fine.

## What's next

I'm experimenting with Nukkit (Bedrock) and thinking about a loot-generation system. More dev logs coming soon.
