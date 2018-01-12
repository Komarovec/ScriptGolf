var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var objects = [];
var level1 = [new StartRect(50,50,150,100), new Water(400,400,400,200), new Wall(390,0,25,275), new Wall(390,325,25,275), new Hole(675,50)];
var level2 = [new StartRect(125,550,150,100), new Wall(250,100,50,600), new Wall(500,0,50,500), new Hole(675,50)];
var level3 = [new StartRect(50,50,150,100), new Wall(200,0,25,225), new Wall(0,200,150,25), new Wall(650,200,150,25), new Wall(575,0,25,225), new Water(350, 100,100,400), new Hole(750,50)];
var level4 = [new StartRect(400,350,150,100), new Hole(400,250), new Wall(50, 285, 700, 25)];
var level5 = [new StartRect(750,550,150,100), new Hole(50,50), new Sand(0,100,200,200), new Sand(600,300,200,200),new Wall(0,90,700,25), new Wall(100,490,700,25), new Wall(0,290,375,25), new Wall(425,290,375,25)];
var level6 = [new StartRect(400,350,150,100), new Hole(50,50), new Sand(0,500,800,100), new Water(200,200,500,90), new Wall(25,290,700,25), new Wall(700,90,25,200)];
var strokeList = [];
var end = false;
var ball = null;
var strokes = 0;
var cx, cy;
var currentLevel = 1;
setInterval(think, 15);

loadLevel(level1);

function setBackground(borderColor, backgroundColor) {
    canvas.style.border = "3px solid " + borderColor;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function canvas_arrow(context, fromx, fromy, tox, toy){
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

function unloadLevel() {
    objects = [];
    ball = null;
    strokeList.push(strokes);
    document.getElementById("strokelist").innerHTML += "<li>Level "+currentLevel+": <b>"+strokes+"</b> strokes</li>";
    strokes = 0;
    currentLevel++;
    switch(currentLevel){
        case 2: 
            loadLevel(level2);
            break;
        case 3: 
            loadLevel(level3);
            break;
        case 4: 
            loadLevel(level4);
            break;
        case 5: 
            loadLevel(level5);
            break;
        case 6: 
            loadLevel(level6);
            break;
        default:
            document.getElementById("win").innerHTML += "<b>End! Thanks for playing!</b>";
            setBackground("black", "white");
            end = true;
            break;
    }
}

function artiWin() { //Funkce pro testování /artificial win/
    currentLevel = "TEST";
    unloadLevel();
}

function restart() { //Zatím nefunkční
    end = false;
    document.getElementById("win").innerHTML = "";
    document.getElementById("strokelist").innerHTML = "";
    objects = [];
    currentLevel = 1;
    strokes = 0;
    strokeList = [];
    loadLevel(level1);
}

function placeBall(ball) {
    ball.x = cx;
    ball.y = cy;
}

function loadLevel(level) {
    objects = level;
    ball = new Golfball(cx,cy);
}

function paint() {
    setBackground("black", "green");
    objects.forEach(function(obj) {
        if(obj.type == "wall") obj.collision(ball.x, ball.y); //Kontrola kolizí
        if(obj.type == "sand") obj.collision(ball.x, ball.y);
        if(obj.type == "water") obj.collision(ball.x, ball.y);
        if(obj.type == "hole" && ball.placed) {
            if((obj.dist(ball.x, ball.y) <= obj.radius*2) && (ball.xSpeed < 2 && ball.ySpeed < 2 && ball.xSpeed > -2 && ball.ySpeed > -2)) {
                unloadLevel();
                return;
            }
        }
        obj.paint(ctx);
    });
    ball.paint(ctx);
    if(ball.placed) {
        if(ball == null || end == true) return;
        ball.paint(ctx);
        if(ball.moving() || ball.dist(cx, cy) > 200) return; //Vykresli šipku
        ctx.beginPath();
        canvas_arrow(ctx, ball.x, ball.y, cx, cy);
        ctx.stroke();
    }
    else {
        placeBall(ball);
    }
}

function think() {
    if(ball == null || end == true) return;
    ball.move(canvas);
    paint();
}

document.addEventListener("mousemove", function(evt) {
    cx = getMousePos(canvas, evt).x;
    cy = getMousePos(canvas, evt).y;
}) 

document.addEventListener("click", function(evt) {
    if(ball.placed == false) {
        if(objects[0].inStart()) {
            ball.placed = true;
            console.log("PLACED!");
        }
    }
    else {
        if(ball == null) return;
        if(ball.moving()  || ball.dist(cx, cy) > 200) return;
        var xF = -((ball.x - cx)/10);
        var yF = -((ball.y - cy)/10);
        ball.stroke(xF,yF);
    }
})
