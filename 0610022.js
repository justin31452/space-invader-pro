const numEnemies = 8;
const swingSpeed = 2;
const swingDist = 75;
const attackRate = 30;
const enemy = {
    width: 50,
    height: 50,
    damage: 3,
    speed: 1.2,
    score: 10,
    lives: 4
}
const enemy2 = {
    width: 50,
    height: 50,
    damage: 10,
    speed: 0.3,
    score: 20,
    lives: 15
}
const enemy3 = {
    width: 50,
    height: 50,
    damage: 1,
    speed: 0.1,
    score: 30,
    lives: 10
}
const rocket = {
    width: 10,
    height: 16,
    damage: 4,
    speed: 20
}
const bullet = {
    width: 7,
    height: 16,
    damage: 1,
    speed: 50
}
const attack = {
    width: 16,
    height: 16,
    damage: 1,
    speed: 5
}
const expTable = [0, 100, 300, 500, 500];
const maxLifeTable = [0, 3, 4, 5, 7, 10];
const MENU = 0;
const GAME = 1;
const LOSE = 2;
const TRANSITION = 3;
const WIN = 4;

var config
var ship
var rockets = [];
var bullets = [];
var enemies = [];
var enemies2 = [];
var enemies3 = [];
var explosions = [];
var attacks = [];
var status = MENU;
var enemySwing = 0;
var transitionCountDown = 3;
var transitionCountDownCnt = 0;
var attackCnt = 0;
var explosionBigLives = 50;
var explosionBigAlive = false;

var boss = {
    width: 441,
    height: 321,
    speed: 5,
    verticalSwing: 0,
    verticalSwingRange: 50,
    horizontalSwing: 0,
    horizontalSwingRange: 90,
    top: 50,
    left: 150,
    lives: 0,
    maxLives: 10000,
    attackRate: 30,
    alive: false
}

var keys = {
    space: 0,
    right: 0,
    left: 0
};

var mutex = {
    space: 1,
    left: 1,
    right: 1
};

function reset() {
    enemies = [];
    rockets = [];
    enemies2 = [];
    enemies3 = [];
    explosions = [];
    attacks = [];
    bullets = [];
    ship = {
        width: 50,
        height: 50,
        top: 700,
        left: 600,
        speed: 3,
        lives: 3,
        fireRateLvl: 4,
        maxLives: 3,
        exp: 0,
        level: 1
    }
    config = {
        level: 1,
        score: 0
    };
}

window.addEventListener("keydown", function keydown(e) {
    //<-
    //console.log(e);
    if (e.keyCode == 37) {
        keys.left = 1;
        if (mutex.left == 1) {
            mutex.left--;
            moveShip("left");
        }
    }
    //->
    if (e.keyCode == 39) {
        keys.right = 1;
        if (mutex.right == 1) {
            mutex.right--;
            moveShip("right");
        }
    }
    //menu
    if (e.keyCode == 32) {
        keys.space = 1;
        if (status == MENU) {
            status = TRANSITION;
        } else if (status == LOSE) {
            status = MENU;
        } else if (status == WIN) {
            status = MENU;
        } else if (status == GAME) {
            if (mutex.space == 1) {
                mutex.space--;
                createRocket();
            }
        }
    }
    //N
    if (e.keyCode == 78) {
        status = TRANSITION;
        config.level++;
    }
    //L
    if (e.keyCode == 76) {
        if (ship.level < 5)
            ship.level++;
        ship.lives = ship.maxLives;
    }
    //K
    if (e.keyCode == 75) {
        if (config.level == 5)
            boss.lives = 10;
    }
});

window.addEventListener("keyup", function keyup(e) {
    if (e.keyCode == 32)
        keys.space = 0;
    else if (e.keyCode == 37)
        keys.left = 0;
    else if (e.keyCode == 39)
        keys.right = 0;
});

function showStatus() {
    ship.maxLives += 0;
    ship.exp += 0;
    ship.level += 0;
    expTable[shipLevel] += 0;
    document.getElementById("status").innerHTML = "";
    document.getElementById("status").innerHTML += (
        "<p>SHIP LEVEL: " + ship.level + " </p>\
        LIFE : <progress id='health' value='" + ship.lives + "' max='" + ship.maxLives + "'></progress><p></p>\
        EXP  : <progress id='exp' value='" + ship.exp + "' max='" + expTable[ship.level] + "'></progress>");
    //console.log(expTable[ship.level]);
}

function shipLevel() {
    if (ship.exp >= expTable[ship.level] && ship.level < 5) {
        ship.exp -= expTable[ship.level];
        ship.level++;
        ship.lives += (maxLifeTable[ship.level] - ship.maxLives);
    }
    if (ship.level == 1) {
        ship.speed = 8;
        ship.maxLives = 3;
    }
    if (ship.level == 2) {
        ship.speed = 8;
        ship.maxLives = 4;
    }
    if (ship.level == 3) {
        ship.speed = 11;
        ship.maxLives = 5;
    }
    if (ship.level == 4) {
        ship.speed = 11;
        ship.maxLives = 7;
    }
    if (ship.level == 5) {
        ship.speed = 15;
        ship.maxLives = 10;
    }
}

function DeathDetection() {
    for (var e = 0; e < enemies.length; e++) {
        if (enemies[e].lives <= 0) {
            if (enemies[e].lives > -100) {
                config.score += enemy.score;
                ship.exp += enemy.score;
                explosions.push({
                    top: enemies[e].top,
                    left: enemies[e].left,
                    lives: 10
                });
            }
            enemies.splice(e, 1);
        }
    }
    for (var e = 0; e < enemies2.length; e++) {
        if (enemies2[e].lives <= 0) {
            if (enemies2[e].lives > -100) {
                config.score += enemy2.score;
                ship.exp += enemy2.score;
                explosions.push({
                    top: enemies2[e].top,
                    left: enemies2[e].left,
                    lives: 10
                });
            }
            enemies2.splice(e, 1);
        }
    }
    for (var e = 0; e < enemies3.length; e++) {
        if (enemies3[e].lives <= 0) {
            if (enemies3[e].lives > -100) {
                config.score += enemy3.score;
                ship.exp += enemy3.score;
                explosions.push({
                    top: enemies3[e].top,
                    left: enemies3[e].left,
                    lives: 10
                });
            }
            enemies3.splice(e, 1);
        }
    }
    for (var r = 0; r < rockets.length; r++) {
        if (rockets[r].lives <= 0) {
            rockets.splice(r, 1);
        }
    }
    for (var r = 0; r < bullets.length; r++) {
        if (bullets[r].lives <= 0) {
            bullets.splice(r, 1);
        }
    }
    for (var i = 0; i < attacks.length; i++) {
        if (attacks[i].lives <= 0) {
            attacks.splice(i, 1);
        }
    }
    if (ship.lives <= 0) {
        status = LOSE;
    }
    if (config.level == 5 && boss.lives <= 0) {
        attacks = [];
        boss.alive = false;
    }
    if (enemies.length + enemies2.length + enemies3.length + explosions.length <= 0 && !boss.alive && !explosionBigAlive) {
        config.level++;
        status = TRANSITION;
    }
    for (var i = 0; i < explosions.length; i++) {
        if (explosions[i].lives <= 0)
            explosions.splice(i, 1);
    }
}

function shipEnemyCollision() {
    for (var e = 0; e < enemies.length; e++) {
        if ((ship.top <= enemies[e].top + enemy.height) &&
            (ship.top + ship.height >= enemies[e].top) &&
            (ship.left + ship.width >= enemies[e].left) &&
            (ship.left <= enemies[e].left + enemy.width)
        ) {
            ship.lives -= enemy.damage;
            enemies[e].lives = -100;
        }
    }
    for (var e = 0; e < enemies2.length; e++) {
        if ((ship.top <= enemies2[e].top + enemy2.height) &&
            (ship.top + ship.height >= enemies2[e].top) &&
            (ship.left + ship.width >= enemies2[e].left) &&
            (ship.left <= enemies2[e].left + enemy2.width)
        ) {
            ship.lives -= enemy2.damage;
            enemies2[e].lives = -100;
        }
    }
    for (var e = 0; e < enemies3.length; e++) {
        if ((ship.top <= enemies3[e].top + enemy3.height) &&
            (ship.top + ship.height >= enemies3[e].top) &&
            (ship.left + ship.width >= enemies3[e].left) &&
            (ship.left <= enemies3[e].left + enemy3.width)
        ) {
            ship.lives -= enemy3.damage;
            enemies3[e].lives = -100;
        }
    }
}

function shipAttackCollision() {
    for (var i = 0; i < attacks.length; i++) {
        if ((ship.top <= attacks[i].top + attack.height) &&
            (ship.top + ship.height >= attacks[i].top) &&
            (ship.left + ship.width >= attacks[i].left) &&
            (ship.left <= attacks[i].left + attack.width)
        ) {
            ship.lives -= attack.damage;
            attacks[i].lives = -100;
        }
    }
}

function rocketWallCollision() {

    //console.log("rocket wall collide");
    for (var r = 0; r < rockets.length; r++) {
        if (rockets[r].top < 0) {
            rockets[r].lives = -100;
            //console.log("rocket wall collide");
        }
    }
}

function bulletWallCollision() {
    for (var r = 0; r < bullets.length; r++) {
        if (bullets[r].top < 0) {
            bullets[r].lives = -100;
        }
    }
}

function attackWallCollision() {
    for (var r = 0; r < attacks.length; r++) {
        if (attacks[r].top > 800) {
            attacks[r].lives = -100;
        }
    }
}

function enemyWallCollision() {
    for (var e = 0; e < enemies.length; e++) {
        if (enemies[e].top + enemy.height > 800) {
            enemies[e].lives = -100;
        }
    }
    for (var e = 0; e < enemies2.length; e++) {
        if (enemies2[e].top + enemy2.height > 800) {
            enemies2[e].lives = -100;
        }
    }
    for (var e = 0; e < enemies3.length; e++) {
        if (enemies3[e].top + enemy3.height > 800) {
            enemies3[e].lives = -100;
        }
    }
}

function enemyRocketCollision() {
    for (var e = 0; e < enemies.length; e++) {
        for (var r = 0; r < rockets.length; r++) {
            if ((rockets[r].top <= enemies[e].top + enemy.height) &&
                (rockets[r].top + rocket.height >= enemies[e].top) &&
                (rockets[r].left + rocket.width >= enemies[e].left) &&
                (rockets[r].left <= enemies[e].left + enemy.width)
            ) {
                rockets[r].lives--;
                enemies[e].lives -= rocket.damage;
            }
        }
    }

    for (var e = 0; e < enemies2.length; e++) {
        for (var r = 0; r < rockets.length; r++) {
            if ((rockets[r].top <= enemies2[e].top + enemy2.height) &&
                (rockets[r].top + rocket.height >= enemies2[e].top) &&
                (rockets[r].left + rocket.width >= enemies2[e].left) &&
                (rockets[r].left <= enemies2[e].left + enemy2.width)
            ) {
                rockets[r].lives--;
                enemies2[e].lives -= rocket.damage;
            }
        }
    }

    for (var e = 0; e < enemies3.length; e++) {
        for (var r = 0; r < rockets.length; r++) {
            if ((rockets[r].top <= enemies3[e].top + enemy3.height) &&
                (rockets[r].top + rocket.height >= enemies3[e].top) &&
                (rockets[r].left + rocket.width >= enemies3[e].left) &&
                (rockets[r].left <= enemies3[e].left + enemy3.width)
            ) {
                rockets[r].lives--;
                enemies3[e].lives -= rocket.damage;
            }
        }
    }
    if (config.level == 5) {
        for (var r = 0; r < rockets.length; r++) {
            if ((rockets[r].top <= boss.top + boss.height) &&
                (rockets[r].top + rocket.height >= boss.top) &&
                (rockets[r].left + rocket.width >= boss.left) &&
                (rockets[r].left <= boss.left + boss.width)
            ) {
                rockets[r].lives--;
                boss.lives -= rocket.damage;
            }
        }
    }
}

function enemyBulletCollision() {
    for (var e = 0; e < enemies.length; e++) {
        for (var r = 0; r < bullets.length; r++) {
            if ((bullets[r].top <= enemies[e].top + enemy.height) &&
                (bullets[r].top + bullet.height >= enemies[e].top) &&
                (bullets[r].left + bullet.width >= enemies[e].left) &&
                (bullets[r].left <= enemies[e].left + enemy.width)
            ) {
                bullets[r].lives--;
                enemies[e].lives -= bullet.damage;
            }
        }
    }

    for (var e = 0; e < enemies2.length; e++) {
        for (var r = 0; r < bullets.length; r++) {
            if ((bullets[r].top <= enemies2[e].top + enemy2.height) &&
                (bullets[r].top + bullet.height >= enemies2[e].top) &&
                (bullets[r].left + bullet.width >= enemies2[e].left) &&
                (bullets[r].left <= enemies2[e].left + enemy2.width)
            ) {
                bullets[r].lives--;
                enemies2[e].lives -= bullet.damage;
            }
        }
    }

    for (var e = 0; e < enemies3.length; e++) {
        for (var r = 0; r < bullets.length; r++) {
            if ((bullets[r].top <= enemies3[e].top + enemy3.height) &&
                (bullets[r].top + bullet.height >= enemies3[e].top) &&
                (bullets[r].left + bullet.width >= enemies3[e].left) &&
                (bullets[r].left <= enemies3[e].left + enemy3.width)
            ) {
                bullets[r].lives--;
                enemies3[e].lives -= bullet.damage;
            }
        }
    }
    if (config.level == 5) {
        for (var r = 0; r < bullets.length; r++) {
            if ((bullets[r].top <= boss.top + boss.height) &&
                (bullets[r].top + bullet.height >= boss.top) &&
                (bullets[r].left + bullet.width >= boss.left) &&
                (bullets[r].left <= boss.left + boss.width)
            ) {
                bullets[r].lives--;
                boss.lives -= bullet.damage;
            }
        }
    }
}

function createEnemy() {
    //console.log(config.level);
    if (config.level == 1) {
        var lft = 200;
        var tp = 250;
        for (var i = 0; i < numEnemies; i++) {
            enemies.push({
                left: lft,
                top: tp,
                lives: enemy.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 175;
        for (var i = 0; i < numEnemies; i++) {
            enemies.push({
                left: lft,
                top: tp,
                lives: enemy.lives,
                id: i
            });
            lft += 100;
        }
    } else if (config.level == 2) {
        var lft = 200;
        var tp = 250;
        for (var i = 0; i < numEnemies; i++) {
            enemies2.push({
                left: lft,
                top: tp,
                lives: enemy2.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 175;
        for (var i = 0; i < numEnemies; i++) {
            enemies2.push({
                left: lft,
                top: tp,
                lives: enemy2.lives,
                id: i
            });
            lft += 100;
        }
    } else if (config.level == 3) {
        var lft = 200;
        var tp = 250;
        for (var i = 0; i < numEnemies; i++) {
            enemies3.push({
                left: lft,
                top: tp,
                lives: enemy3.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 175;
        for (var i = 0; i < numEnemies; i++) {
            enemies3.push({
                left: lft,
                top: tp,
                lives: enemy3.lives,
                id: i
            });
            lft += 100;
        }
    } else if (config.level == 4) {
        var lft = 200;
        var tp = 250;
        for (var i = 0; i < numEnemies; i++) {
            enemies.push({
                left: lft,
                top: tp,
                lives: enemy.lives,
                id: i
            });
            lft += 100;
        }

        var lft = 200;
        var tp = 320;
        for (var i = 0; i < numEnemies; i++) {
            enemies.push({
                left: lft,
                top: tp,
                lives: enemy.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 175;
        for (var i = 0; i < numEnemies; i++) {
            enemies2.push({
                left: lft,
                top: tp,
                lives: enemy2.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 100;
        for (var i = 0; i < numEnemies; i++) {
            enemies3.push({
                left: lft,
                top: tp,
                lives: enemy3.lives,
                id: i
            });
            lft += 100;
        }

        lft = 200;
        tp = 25;
        for (var i = 0; i < numEnemies; i++) {
            enemies3.push({
                left: lft,
                top: tp,
                lives: enemy3.lives,
                id: i
            });
            lft += 100;
        }
    } else if (config.level == 5) {
        boss.lives = boss.maxLives;
        boss.alive = true;
        explosionBigAlive = true;
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function createAttack() {
    attackCnt++;
    if (attackCnt == attackRate && enemies3.length != 0) {
        attackCnt = 0;
        var i = getRandom(0, enemies3.length - 1);
        attacks.push({
            left: enemies3[i].left + 17,
            top: enemies3[i].top + 40,
            lives: 1
        })
    }
    if (config.level == 5 && boss.alive) {
        if (attackCnt == boss.attackRate) {
            attackCnt = 0;
            attacks.push({
                left: boss.left + 100,
                top: boss.top + 321,
                lives: 1
            }, {
                left: boss.left + 220,
                top: boss.top + 321,
                lives: 1
            }, {
                left: boss.left + 340,
                top: boss.top + 321,
                lives: 1
            })
        }
    }
}

function createRocket() {
    bullets.push({
        left: ship.left + 12,
        top: ship.top + 10,
        lives: 1
    });
    //if (ship.level > 1)
    bullets.push({
        left: ship.left + 30,
        top: ship.top + 10,
        lives: 1
    }, {
        left: ship.left - 6,
        top: ship.top + 10,
        lives: 1
    });
    if (ship.level > 2) {
        rockets.push({
            left: ship.left + 25,
            top: ship.top + 10,
            lives: 1
        }, {
            left: ship.left,
            top: ship.top + 10,
            lives: 1
        });
        //if (ship.level > 3)
        bullets.push({
            left: ship.left + 35,
            top: ship.top + 10,
            lives: 1
        }, {
            left: ship.left - 11,
            top: ship.top + 10,
            lives: 1
        });
    }
    if (ship.level > 4)
        rockets.push({
            left: ship.left + 50,
            top: ship.top + 10,
            lives: 1
        }, {
            left: ship.left - 26,
            top: ship.top + 10,
            lives: 1
        });
    drawRocket();
    if (keys.space) {
        if (ship.level == 1)
            setTimeout(createRocket, 150);
        if (ship.level == 2)
            setTimeout(createRocket, 150);
        if (ship.level == 3)
            setTimeout(createRocket, 100);
        if (ship.level == 4)
            setTimeout(createRocket, 100);
        if (ship.level == 5)
            setTimeout(createRocket, 50);
    } else
        mutex.space = 1;
}

function drawAttack() {
    //clear all rockets
    document.getElementById("attackContainer").innerHTML = "";
    for (var i = 0; i < attacks.length; i++) {
        var lft = attacks[i].left + "px";
        var tp = attacks[i].top + "px";
        document.getElementById("attackContainer").innerHTML += (
            "<div class='attack' style='left:" + lft + ";top:" + tp + ";'></div>");
    }
}

function drawExplosion() {
    document.getElementById("explosionContainer").innerHTML = "";
    for (var i = 0; i < explosions.length; i++) {
        var lft = explosions[i].left + "px";
        var tp = explosions[i].top + "px";
        document.getElementById("explosionContainer").innerHTML += (
            "<div class='explosion' style='left:" + lft + ";top:" + tp + ";'></div>");
        explosions[i].lives--;
    }
    if (config.level == 5 && !boss.alive) {
        explosionBigAlive = true;
        explosionBigLives--;
        console.log("explosion");
        if (explosionBigLives <= 0) {
            explosionBigAlive = false;
        }
        document.getElementById("explosionContainer").innerHTML = "";
        var lft = boss.left + "px";
        var tp = (boss.top - 20) + "px";
        document.getElementById("explosionContainer").innerHTML += (
            "<div class='explosion_big' style='left:" + lft + ";top:" + tp + ";'></div>");
    }
}

function drawEnemy() {
    document.getElementById("enemyContainer").innerHTML = "";
    for (var i = 0; i < enemies.length; i++) {
        var lft = enemies[i].left + "px";
        var tp = enemies[i].top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h1" + i + "' value='" + enemies[i].lives + "' max='" + enemy.lives + "'></progress></div>");
    }
    for (var i = 0; i < enemies2.length; i++) {
        var lft = enemies2[i].left + "px";
        var tp = enemies2[i].top + "px"
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy2' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h2'" + i + " value='" + enemies2[i].lives + "' max='" + enemy2.lives + "'></progress></div>");
    }
    for (var i = 0; i < enemies3.length; i++) {
        var lft = enemies3[i].left + "px";
        var tp = enemies3[i].top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy3' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h3" + i + "' value='" + enemies3[i].lives + "' max='" + enemy3.lives + "'></progress></div>");
    }
    if (config.level == 5 && boss.lives > 0) {
        var lft = boss.left + "px";
        var tp = boss.top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='boss' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='hboss' value='" + boss.lives + "' max='" + boss.maxLives + "'></progress></div>");
    }
}

function drawRocket() {
    //clear all rockets
    document.getElementById("rocketContainer").innerHTML = "";
    for (var i = 0; i < rockets.length; i++) {
        var lft = rockets[i].left + "px";
        var tp = rockets[i].top + "px";
        document.getElementById("rocketContainer").innerHTML += (
            "<div class='rocket' style='left:" + lft + ";top:" + tp + ";'></div>");
    }
}

function drawBullet() {
    document.getElementById("bulletContainer").innerHTML = "";
    for (var i = 0; i < bullets.length; i++) {
        var lft = bullets[i].left + "px";
        var tp = bullets[i].top + "px";
        document.getElementById("bulletContainer").innerHTML += (
            "<div class='bullet' style='left:" + lft + ";top:" + tp + ";'></div>");
    }
}

function moveAttack() {
    for (var i = 0; i < attacks.length; i++)
        attacks[i].top += attack.speed;
}

function moveEnemy() {
    //console.log(enemySwing);
    if (enemySwing > swingDist)
        enemySwing = -swingDist;
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].top += enemy.speed;
        if (enemySwing > 0) {
            enemies[i].left += swingSpeed;
        } else {
            enemies[i].left -= swingSpeed;
        }
    }

    for (var i = 0; i < enemies2.length; i++) {
        enemies2[i].top += enemy2.speed;
        if (enemySwing > 0) {
            enemies2[i].left += swingSpeed;
        } else {
            enemies2[i].left -= swingSpeed;
        }
    }

    for (var i = 0; i < enemies3.length; i++) {
        enemies3[i].top += enemy3.speed;
        if (enemySwing > 0) {
            enemies3[i].left += swingSpeed;
        } else {
            enemies3[i].left -= swingSpeed;
        }
    }

    if (config.level == 5 && boss.lives >= 0) {
        if (boss.verticalSwing > boss.verticalSwingRange)
            boss.verticalSwing = -boss.verticalSwingRange;
        if (boss.horizontalSwing > boss.horizontalSwingRange)
            boss.horizontalSwing = -boss.horizontalSwingRange;
        if (boss.horizontalSwing > 0) {
            boss.left += boss.speed;
        } else {
            boss.left -= boss.speed;
        }
        if (boss.verticalSwing > 0) {
            boss.top += swingSpeed;
        } else {
            boss.top -= swingSpeed;
        }
        boss.verticalSwing++;
        boss.horizontalSwing++;
    }

    enemySwing++;
}

function moveRocket() {
    for (var i = 0; i < rockets.length; i++)
        rockets[i].top -= rocket.speed;
}

function moveBullet() {
    for (var i = 0; i < bullets.length; i++)
        bullets[i].top -= bullet.speed;
}

function moveShip(dir) {
    if (dir == "left") {
        if (ship.left > ship.speed) {
            ship.left -= ship.speed;
            drawship();
        }
        if (keys.left)
            setTimeout(moveShip, 16, dir);
        else
            mutex.left = 1;

    } else if (dir == "right") {
        if (ship.left + ship.width < 1200 + ship.speed) {
            ship.left += ship.speed;
            drawship();
        }
        if (keys.right)
            setTimeout(moveShip, 16, dir);
        else
            mutex.right = 1;

    }
}

function drawship() {
    document.getElementById("ship").style.left = ship.left + "px";
}

function lose() {
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        " <div class='info'>\
            <p>GAME OVER!!!</p>\
            <p>YOU REACHED LEVEL " + config.level + "</p>\
            <p>YOU SCORED " + config.score + "</p>\
            <p>PRESS SPACE TO RESTART THE GAME!!</p>\
        </div>"
}

function win() {
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        " <div class='info'>\
            <p>GAME OVER!!!</p>\
            <p>YOU REACHED THE MAXIMMUM LEVEL!!</p>\
            <p>YOU SCORED " + config.score + "</p>\
            <p>PRESS SPACE TO RESTART THE GAME!!</p>\
        </div>"
}

function transition() {
    transitionCountDownCnt++;
    if (config.level == 6) {
        status = WIN;
    }
    if (transitionCountDownCnt == 60) {
        transitionCountDown--;
        transitionCountDownCnt = 0;
    }
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        " <div class='info'>\
            <p>PREPARE FOR BATTLE</p>\
            <p>CURRENT SCORE " + config.score + "</p>\
            <p>NEXT LEVEL " + config.level + "</p>\
            <p>COUNTDOWN:</p>\
            <div id='countDown'>" + transitionCountDown + "</div\
        </div>";
    if (transitionCountDown == 0) {
        if (config.level < 6) {
            nextLevel();
            status = GAME;
            //console.log(document.getElementById("infoContainer").style.visibility);
            transitionCountDown = 3;
        }
    }
}

function nextLevel() {
    enemies = [];
    enemies2 = [];
    enemies3 = [];
    rockets = [];
    bullets = [];
    explosions = [];
    attacks = [];
    ship.top = 700;
    ship.left = 600;
    attackCnt = 0;
    document.getElementById("infoContainer").style.visibility = "hidden";
    drawship();
    createEnemy();
}

function menu() {
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        "<div class='intro'>\
            <p>WELCOME TO THE GAME</p>\
            <p>PRESS SPACE TO START!!</p>\
        </div>";
    reset();
}

function gameloop() {
    shipLevel();
    showStatus();
    drawRocket();
    moveRocket();
    drawBullet();
    moveBullet();
    drawEnemy();
    moveEnemy();
    createAttack();
    drawAttack();
    moveAttack();
    drawExplosion();
    enemyRocketCollision();
    enemyBulletCollision();
    shipEnemyCollision();
    enemyWallCollision();
    rocketWallCollision();
    attackWallCollision();
    bulletWallCollision();
    shipAttackCollision();
    DeathDetection();
    //console.log(attacks.length);
    // console.log(explosionBigLives);
    // console.log(status);
    // console.log(config.level);
    console.log(explosionBigLives);
    // console.log(boss.lives);
}

FSM();

function FSM() {
    //console.log(status);
    if (status == MENU)
        menu();
    else if (status == TRANSITION)
        transition();
    else if (status == LOSE)
        lose();
    else if (status == GAME)
        gameloop();
    else if (status == WIN)
        win();
    setTimeout(FSM, 16);
}