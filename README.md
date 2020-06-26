---
title: 'SPACE INVADER PRO'
disqus: hackmd
---

Space Invader Pro
===
![downloads](https://img.shields.io/github/downloads/atom/atom/total.svg)
![build](https://img.shields.io/appveyor/ci/:user/:repo.svg)
![chat](https://img.shields.io/discord/:serverId.svg)




[TOC]

## Overview
A classic space invader game with 5 different levels and 4 different types of enemies! Written in pure Javascript.

![](https://i.imgur.com/5kGeGhx.jpg)


How to use
---
Simply download whole repository, and then execute the html file with newer generation web browsers like chrome or safari. Have fun!


System Structure
---
* **Finite State Machine**
![](https://i.imgur.com/wFVYNLC.jpg)
As figure shown above, there are 5 states.
    1. MENU state: homepage showing welcome message.
    2. TRANSITION state: a state which would count down 3 seconds, and then proceed to GAME state.
    3. GAME state: keep calling gameloop() for every 16 miliseconds, doing things like draw enemy, collision detection etc.
    4. LOSE state: showing your scoring and reached level.
    5. WIN state: showing congratulation message.
* **HTML structure**

    First of all, there is a div in size 1200*800 containing gaming background image. On top of that, there are layers of containers contain different classes of objects loke rockets, enemies. On top of everything, there's a layer containing text message and a different background image, and it's hidden in the GAME state.


## Appendix and FAQ

:::info
**Find this document incomplete?** Leave a comment!
:::

###### tags: `game` `spaceInvader`
