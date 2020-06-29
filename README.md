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

Game Features
---
*  **Weapons**
![](https://i.imgur.com/jQw5l7q.png)
![](https://i.imgur.com/IXaGwIj.png)\
    each bullet damage = 1 speed = 50\
    each rocket damage = 4 speed = 20

* **Enemies**
![](https://i.imgur.com/t47apSp.png)
![](https://i.imgur.com/Irgq1xP.png)
![](https://i.imgur.com/oEmNOjg.png)
![](https://i.imgur.com/sr79kJT.png)\
    enemy1 : damage: 10 speed: 0.3 score: 10 lives: 15 (basic enemy)\
    enemy2 : damage: 3 speed: 1.2 score: 20 lives: 4(fast enemy)\
    enemy3 : damage: 1 speed: 0.1 score: 30 lives: 10(archer enemy)\
    enemy4 : ???
    
* **Ship Level**
![](https://i.imgur.com/cRjHM2h.png)\
    level1: bullets:3 rocket:0 firerate:1/150 speed:8 maxLives:3\
    level2: bullets:3 rocket:0 firerate:1/150 speed:8 maxLives:4\
    level3: bullets:5 rocket:2 firerate:1/100 speed:11 maxLives:5\
    level4: bullets:5 rocket:2 firerate:1/100 speed:11 maxLives:7\
    level5: bullets:5 rocket:4 firerate:1/50  speed:15 maxLives:10
    
* **Other Features**\
    1.health bar: made of progress bar.\
    2.explosion effect


System Structure
---
* **Finite State Machine**
![](https://i.imgur.com/wFVYNLC.jpg)

As figure shown above, there are 5 states.\
    1. MENU state: homepage showing welcome message.\
    2. TRANSITION state: a state which would count down 3 seconds, and then proceed to GAME state.\
    3. GAME state: keep calling gameloop() for every 16 miliseconds, doing things like draw enemy, collision detection etc.\
    4. LOSE state: showing your scoring and reached level.\
    5. WIN state: showing congratulation message.
* **HTML structure**
![](https://i.imgur.com/5Mbh4rg.jpg)\
    First of all, there is a div in size 1200*800 containing gaming background image. On top of that, there are layers of containers contain different classes of objects like rockets, enemies. On top of everything, there's a layer containing text message and a different background image, and it's hidden in the GAME state.

* **MOVE function**
![](https://i.imgur.com/JRxGg5Q.jpg)\
    Due to the debouncing design of keyboard & everything, it's hard to move things smoothly via keyDown. Thus, I set another keydown function that has negative edge only when keyUp occurs. On the other hand, I set a mutex lock to lock the MOVE function, which ensures that there are exactly one MOVE function executing at a time.



## Appendix and FAQ

:::info
**Find this document incomplete?** Leave a comment!
:::

###### tags: `game` `spaceInvader`
