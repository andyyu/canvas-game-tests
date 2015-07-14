(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1000,
    height = 600,
    player = {
        x: 20,
        y: 100,
        width: 5,
        height: 5,
        speed: 2,
        velX: 0,	
        velY: 0,
        jumping: false,
        grounded: false,
        lwalljump: false,	
        rwalljump: false
    },
    keys = [],
    friction = 0.65,
    airfriction = 0.98,
    gravity = 0.17;

var boxes = [];

// dimensions
boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: height
});
boxes.push({
    x: 0,
    y: height - 2,
    width: width,
    height: 50
});
boxes.push({
    x: width - 10,
    y: 0,
    width: 50,
    height: height
});

boxes.push({
    x: 10,
    y: height-300,
    width: 220,
    height: 300
});
boxes.push({
    x: 310,
    y: height-300,
    width: 30,
    height: 300
});
boxes.push({
    x: 410,
    y: height-300,
    width: 30,
    height: 300
});
boxes.push({
    x: 510,
    y: height-300,
    width: 30,
    height: 300
});
boxes.push({
    x: 610,
    y: height-300,
    width: 30,
    height: 300
});
boxes.push({
    x: 710,
    y: height-300,
    width: 30,
    height: 300
});
boxes.push({
    x: 970,
    y: height-200,
    width: 30,
    height: 200
});


canvas.width = width;
canvas.height = height;

function update() {
    // check keys
    if (keys[38] || keys[32] || keys[87]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2;
            //jumpcounter = true;
        }
    }
    if (keys[39] || keys[68]) {
        // right arrow
        if (player.velX < player.speed) {
        	if (player.grounded) {
        		player.velX+=0.15
        	}
        	else {
            player.velX+=0.5;
        	}
        }

    }
    if (keys[37] || keys[65]) {
        // left arrow
        if (player.velX > -player.speed) {
            if (player.grounded) {
        		player.velX-=0.15
        	}
        	else {
            player.velX-=0.5;
        	}
        }
    }

    if ((keys[38] || keys[32] || keys[87]) && (keys[39] || keys[68])) { //right walljump
    	if (player.rwalljump){
    		player.velX = player.speed * 0.7;
    		player.velY = -player.speed * 1.6;
    	}
    }
    if ((keys[38] || keys[32] || keys[87]) && (keys[37] || keys[65])) { //left walljump
    	if (player.lwalljump){
    		player.velX = -player.speed * 0.7;
    		player.velY = -player.speed * 1.6;
    	}
    }

    if (player.grounded)
    	player.velX *= friction;
    else
    	player.velX *= airfriction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    
    player.grounded = false;
    player.rwalljump = false;
    player.lwalljump = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        var dir = colCheck(player, boxes[i]);
        //if (dir === null) {
        //	player.jumpcounter = false;
        //}
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
            if (dir === "l") {player.rwalljump = true;}
            if (dir === "r") {player.lwalljump = true;}
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
            //player.jumpcounter = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
    
    if(player.grounded){
         player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.fillStyle = "red";
    ctx.fillRect(980, height - 205, 5, 5);
    ctx.fillRect(player.x, player.y, player.width, player.height);
    requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function () {
    update();
});