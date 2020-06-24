var rockets = [];
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

function moveship() {
    document.getElementById("ship").style.left = ship.left + "px";
}

function loop() {
    console.log("123");
    setTimeout(loop, 1000);
}