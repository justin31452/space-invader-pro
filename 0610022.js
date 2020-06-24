const numEnemies = 16;
const rowEnemies = 2;
const enemy = {
    width: 50,
    height: 50,
}
const rocket = {
    width: 10,
    height: 16
}
var rockets = [];
var enemies = [];
var ship = {
    top: 700,
    left: 600,
    speed: 10
}



document.onkeydown = function(e) {
    //<-
    if (e.keyCode == 37) {
        ship.left -= ship.speed;
        moveship();
    }
    //->
    else if (e.keyCode == 39) {
        ship.left += ship.speed;
        moveship();
    }
    //space
    else if (e.keyCode == 32) {
        rockets.push({
            left: ship.left + 25,
            top: ship.top + 10
        });
        rockets.push({
            left: ship.left,
            top: ship.top + 10
        });
        drawRocket();
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
                rockets.splice(r, 1);
                enemies.splice(e, 1);
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
            top: tp
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
            "<div class='enemy' style='left:" + lft + ";top:" + tp + ";'></div>");
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
    for (var i = 0; i < enemies.length; i++)
        enemies[i].top += 3;
}

function moveRocket() {
    for (var i = 0; i < rockets.length; i++)
        rockets[i].top -= 5;
}

function moveship() {
    document.getElementById("ship").style.left = ship.left + "px";
}

createEnemy();
loop();

function loop() {
    drawRocket();
    moveRocket();
    drawEnemy();
    moveEnemy();
    enemyRocketCollision();
    setTimeout(loop, 100);
}