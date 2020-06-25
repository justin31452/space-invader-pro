const numEnemies = 16;
const rowEnemies = 2;
const enemy = {
    width: 50,
    height: 50,
    damage: 1,
    speed: 5,
    score: 10
}
const enemy2 = {
    width: 50,
    height: 50,
    damage: 3,
    speed: 3,
    score: 20
}
const enemy3 = {
    width: 50,
    height: 50,
    damage: 1,
    speed: 2,
    score: 30
}
const rocket = {
    width: 10,
    height: 16,
    damage: 1,
    speed: 30
}

const MENU = 0;
const GAME = 1;
const LOSE = 2;
const TRANSITION = 3;

var config = {
    level: 1,
    score: 0
}
var ship = {
    width: 50,
    height: 50,
    top: 700,
    left: 600,
    speed: 20,
    lives: 1
}
var rockets = [];
var enemies = [];
var status = MENU;
var enemySwing = 0;

document.onkeydown = function(e) {
    //<-
    if (e.keyCode == 37) {
        if (ship.left > ship.speed) {
            ship.left -= ship.speed;
            drawship();
        }
    }
    //->
    else if (e.keyCode == 39) {
        if (ship.left + ship.width < 1200 + ship.speed) {
            ship.left += ship.speed;
            drawship();
        }
    }
    //menu
    else if (e.keyCode == 32) {
        if (status == MENU) {
            status = TRANSITION;
        } else if (status == LOSE) {
            status = MENU;
        } else if (status == TRANSITION) {
            nextLevel();
            status = GAME;
        } else if (status == GAME) {
            rockets.push({
                left: ship.left + 25,
                top: ship.top + 10,
                lives: 1
            });
            rockets.push({
                left: ship.left,
                top: ship.top + 10,
                lives: 1
            });
            drawRocket();
        }
    }
}

function DeathDetection() {
    for (var e = 0; e < enemies.length; e++) {
        if (enemies[e].lives <= 0) {
            if (enemies[e].lives > -100)
                config.score += enemy.score;
            enemies.splice(e, 1);
        }
    }
    for (var r = 0; r < rockets.length; r++) {
        if (rockets[r].lives <= 0) {
            rockets.splice(r, 1);
        }
    }
    if (ship.lives <= 0) {
        status = LOSE;
    }
    if (enemies.length == 0) {
        status = TRANSITION;
        config.level++;
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
}

function enemyWallCollision() {
    for (var e = 0; e < enemies.length; e++) {
        if (enemies[e].top + enemy.height > 800) {
            enemies[e].lives = -100;
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
}

function createEnemy() {
    var lft = 200;
    var tp = 100;
    for (var i = 0; i < numEnemies; i++) {
        enemies.push({
            left: lft,
            top: tp,
            lives: 1
        });
        lft += 100;
        if ((i + 1) % (numEnemies / rowEnemies) == 0) {
            lft = 200;
            tp += 75;
        }
    }
}

function drawEnemy() {
    document.getElementById("enemyContainer").innerHTML = "";
    for (var i = 0; i < enemies.length; i++) {
        var lft = enemies[i].left + "px";
        var tp = enemies[i].top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy3' style='left:" + lft + ";top:" + tp + ";'></div>");
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

function moveEnemy() {
    //console.log(enemySwing);
    if (enemySwing > 12)
        enemySwing = -12;
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].top += enemy.speed;
        if (enemySwing > 0) {
            enemies[i].left += enemy.speed * 5;
        } else {
            enemies[i].left -= enemy.speed * 5;
        }
    }
    enemySwing++;
}

function moveRocket() {
    for (var i = 0; i < rockets.length; i++)
        rockets[i].top -= rocket.speed;
}

function drawship() {
    document.getElementById("ship").style.left = ship.left + "px";
}

function reset() {
    enemies = [];
    rockets = [];
    ship = {
        width: 50,
        height: 50,
        top: 700,
        left: 600,
        speed: 10,
        lives: 1
    };
    config = {
        level: 1,
        score: 0
    };
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

function transition() {
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        " <div class='info'>\
            <p>PREPARE FOR BATTLE</p>\
            <p>LEVEL " + config.level + " IS COMMING</p>\
            <p>PRESS SPACE TO CONTINUE!!</p>\
        </div>"
}

function nextLevel() {
    enemies = [];
    rockets = [];
    ship.top = 700;
    ship.left = 600;
    document.getElementById("infoContainer").style.visibility = "hidden";
    drawship();
    createEnemy();
}

function menu() {
    document.getElementById("infoContainer").style.visibility = "visible";
    document.getElementById("infoContainer").innerHTML =
        "<div class='info'>\
            <p>WELCOME TO THE GAME</p>\
            <p>PRESS SPACE TO START!!</p>\
        </div>";
    reset();
}

function gameloop() {
    drawRocket();
    moveRocket();
    drawEnemy();
    moveEnemy();
    enemyRocketCollision();
    shipEnemyCollision();
    enemyWallCollision();
    DeathDetection();
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
    setTimeout(FSM, 100);
}