const numEnemies = 8;
const swingSpeed = 2;
const swingDist = 75;
const enemy = {
    width: 50,
    height: 50,
    damage: 1,
    speed: 0.8,
    score: 10,
    lives: 4
}
const enemy2 = {
    width: 50,
    height: 50,
    damage: 3,
    speed: 0.3,
    score: 20,
    lives: 8
}
const enemy3 = {
    width: 50,
    height: 50,
    damage: 1,
    speed: 0.1,
    score: 30,
    lives: 4
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
    speed: 30,
    lives: 1,
    fireRateLvl: 4
}
var rockets = [];
var enemies = [];
var enemies2 = [];
var enemies3 = [];
var status = MENU;
var enemySwing = 0;

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

window.addEventListener("keydown", function keydown(e) {
    //<-
    //console.log("onkeydown");
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
        } else if (status == TRANSITION) {
            nextLevel();
            status = GAME;
        } else if (status == GAME) {
            if (mutex.space == 1) {
                mutex.space--;
                createRocket();
            }
        }
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

function DeathDetection() {
    for (var e = 0; e < enemies.length; e++) {
        if (enemies[e].lives <= 0) {
            if (enemies[e].lives > -100)
                config.score += enemy.score;
            enemies.splice(e, 1);
        }
    }
    for (var e = 0; e < enemies2.length; e++) {
        if (enemies2[e].lives <= 0) {
            if (enemies2[e].lives > -100)
                config.score += enemy2.score;
            enemies2.splice(e, 1);
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
    if (enemies.length == 0 && enemies2.length == 0) {
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
}

function rocketWallCollision() {

    //console.log("rocket wall collide");
    for (var r = 0; r < rockets.length; r++) {
        if (rockets[r].top < 0) {
            rockets[r].lives = -100;
            console.log("rocket wall collide");
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
}

function createEnemy() {
    var lft = 200;
    var tp = 175;
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
    var tp = 100;
    for (var i = 0; i < numEnemies; i++) {
        enemies2.push({
            left: lft,
            top: tp,
            lives: enemy2.lives,
            id: i
        });
        lft += 100;
    }
}


function createRocket() {
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
    if (keys.space)
        setTimeout(createRocket, 15);
    else
        mutex.space = 1;
}

function drawEnemy() {
    document.getElementById("enemyContainer").innerHTML = "";
    for (var i = 0; i < enemies.length; i++) {
        var lft = enemies[i].left + "px";
        var tp = enemies[i].top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h1" + i + "' value='" + enemies[i].lives + "' max='4'></progress></div>");
    }
    for (var i = 0; i < enemies2.length; i++) {
        var lft = enemies2[i].left + "px";
        var tp = enemies2[i].top + "px"
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy2' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h2'" + i + " value='" + enemies2[i].lives + "' max='8'></progress></div>");
    }
    for (var i = 0; i < enemies3.length; i++) {
        var lft = enemies3[i].left + "px";
        var tp = enemies3[i].top + "px";
        document.getElementById("enemyContainer").innerHTML += (
            "<div class='enemy3' style='left:" + lft + ";top:" + tp + ";'>\
            <progress id='h3" + i + "' value='" + enemies3[i].lives + "' max='4'></progress></div>");
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
    if (enemySwing > swingDist)
        enemySwing = -swingDist - 20;
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

    enemySwing++;
}

function moveRocket() {
    for (var i = 0; i < rockets.length; i++)
        rockets[i].top -= rocket.speed;
}

function moveShip(dir) {
    if (dir == "left") {
        if (ship.left > ship.speed) {
            ship.left -= ship.speed;
            drawship();
            if (keys.left)
                setTimeout(moveShip, 16, dir);
            else
                mutex.left = 1;
        }
    } else if (dir == "right") {
        if (ship.left + ship.width < 1200 + ship.speed) {
            ship.left += ship.speed;
            drawship();
            if (keys.right)
                setTimeout(moveShip, 16, dir);
            else
                mutex.right = 1;
        }
    }
}

function drawship() {
    document.getElementById("ship").style.left = ship.left + "px";
}

function reset() {
    enemies = [];
    rockets = [];
    enemies2 = [];
    enemies3 = [];
    ship = {
        width: 50,
        height: 50,
        top: 700,
        left: 600,
        speed: 10,
        lives: 1,
        fireRate: 250
    }
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
    enemies2 = [];
    enemies3 = [];
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
    rocketWallCollision();
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
    setTimeout(FSM, 16);
}