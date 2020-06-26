---
title: 'SPACE INVADER PRO'
disqus: hackmd
---

Space Invader Pro
===


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
![](https://i.imgur.com/5Mbh4rg.jpg)

    First of all, there is a div in size 1200*800 containing gaming background image. On top of that, there are layers of containers contain different classes of objects loke rockets, enemies. On top of everything, there's a layer containing text message and a different background image, and it's hidden in the GAME state.

* **MOVE function**
![](https://i.imgur.com/JRxGg5Q.jpg)

    Due to the debouncing design of keyboard & everything, it's hard to move things smoothly via keyDown. Thus, I set another keydown function that has negative edge only when keyUp occurs. On the other hand, I set a mutex lock to lock the MOVE function, which ensures that there are exactly one MOVE function executing at a time.



## Appendix and FAQ

:::info
**Find this document incomplete?** Leave a comment!
:::

###### tags: `game` `spaceInvader`
