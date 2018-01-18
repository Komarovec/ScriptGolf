var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/*-------------------LEVELY-------------------
Pravidla vytváření:    
    StartRect musí byt v poli levelu vždy PRVNÍ!
    Pozice v poli ovlivňuje překrývání objektů! Čím víc vlevo tím víc vpředu.
    Doporučené schéma: StartRect, Hole, Water/Sand, Walls.
    Obdelníkové objekty 4 parametry (X, Y, Šířka, Výška) X max 800, Y max 600
    Kruhové objekty 2 parametry (X, Y) --> poloměr nastaven "natvrdo" 
*/

var level1 = [new StartRect(50,50,150,100), new Water(400,400,400,200), new Wall(390,0,25,275), new Wall(390,325,25,275), new Hole(675,50)];
var level2 = [new StartRect(50,450,150,100), new Wall(250,100,50,600), new Wall(500,0,50,500), new Hole(675,50)];
var level3 = [new StartRect(50,50,100,100), new Wall(200,0,25,225), new Wall(0,200,150,25), new Wall(650,200,150,25), new Wall(575,0,25,225), new Water(350, 100,100,400), new Hole(750,50)];
var level4 = [new StartRect(325,350,150,100), new Hole(400,250), new Wall(50, 285, 700, 25)];
var level5 = [new StartRect(700,520,75,75), new Hole(50,50), new Sand(0,100,200,200), new Sand(600,300,200,200),new Wall(0,90,700,25), new Wall(100,490,700,25), new Wall(0,290,375,25), new Wall(425,290,375,25)];
var level6 = [new StartRect(350,325,100,75), new Hole(50,50), new Sand(0,500,800,100), new Water(200,200,500,90), new Wall(25,290,700,25), new Wall(700,90,25,200)];

var objects = []; //Aktuálně vykreslované objekty
var plyCount = 1; //Počet hráčů
var plyPlay = 1;  //Hrající hráč
var pl1Strokes = 0; //Stroky různych hráčů
var pl2Strokes = 0;
var pl3Strokes = 0;
var pl4Strokes = 0;
var end = false;
var ball = null;
var color = "white";
var strokes = 0; //Aktualní počet stroku v JEDNOM levelu
var cx, cy;  //Aktuální pozice kurzoru
var currentLevel = 1;
var winSound = new sound("content/sounds/winner.mp3");

var mainLoop = setInterval(think, 15); //Nastavení hlavního opakování
plNameUpdate();
loadLevel(level1); //Načtení prvního levelu

function plNameUpdate() { //Aktualizace nápisu hrače podle plyPlay
    document.getElementById("mg").innerHTML = "Minigolf - Player "+plyPlay;
}

function setBackground(borderColor, backgroundColor) { //Nastaví pozadí hracího pole
    canvas.style.border = "3px solid " + borderColor;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function sound(src) { //Objekt zvuk pro různé efekty
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function getMousePos(canvas, evt) { //Nazev mluví za vše...
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function canvas_arrow(context, fromx, fromy, tox, toy){ //Funkce pro vykreslení vektorové šipky
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

function unloadLevel() { //Volána vždy po dokončení levelu --> Příprava na další level
    objects = [];
    ball = null;
    if(plyPlay == 1) document.getElementById("strokelist").innerHTML += "<li>Level "+currentLevel+":</li>";
    document.getElementById("strokelist").innerHTML += "Player <b>"+plyPlay+".</b> finished with <b>"+strokes+"</b> strokes<br>";
    plyCount = players();

    switch(plyPlay) { //Změna barvy :)
        case 1:
            color = "yellow";
            pl1Strokes += strokes;
            break;
        case 2:
            color = "red";
            pl2Strokes += strokes;
            break;
        case 3:
            color = "blue";
            pl3Strokes += strokes;
            break;
        case 4:
            color = "pink";
            pl4Strokes += strokes;
            break;
    }

    strokes = 0;

    if(plyPlay == plyCount) { //Všichni hráči již odehráli
        plyPlay = 0;
        currentLevel++;
        color = "white";
    }
    
    plyPlay++;
    plNameUpdate();

    switch(currentLevel){
        case 1:
            loadLevel(level1);
            break;
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
            document.getElementById("win").innerHTML += "<b>End! Thanks for playing!</b><br>";
            if(pl1Strokes != 0) document.getElementById("win").innerHTML += "Player 1 has <b>"+pl1Strokes+"</b> strokes.<br>";
            if(pl2Strokes != 0) document.getElementById("win").innerHTML += "Player 2 has <b>"+pl2Strokes+"</b> strokes.<br>";
            if(pl3Strokes != 0) document.getElementById("win").innerHTML += "Player 3 has <b>"+pl3Strokes+"</b> strokes.<br>";
            if(pl4Strokes != 0) document.getElementById("win").innerHTML += "Player 3 has <b>"+pl4Strokes+"</b> strokes.<br>";
            setBackground("black", "white");
            winSound.play();
            clearInterval(mainLoop);
            end = true;
            break;
    }
}

function artiWin() { //Funkce pro testování /artificial win/
    currentLevel = 7;
    unloadLevel();
}

function players() { //Vratí počet hráču ve formuláří
    if(document.getElementById("pl1").checked) return 1;
    else if(document.getElementById("pl2").checked) return 2;
    else if(document.getElementById("pl3").checked) return 3;
    else return 1;
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

function placeBall(ball) { //Nastaví souřadnice míče na kurzor
    ball.x = cx;
    ball.y = cy;
}

function loadLevel(level) { //Načte do aktivních objektu, objekty levelu
    objects = level;
    ball = new Golfball(cx,cy,color);
}

function paint() {
    setBackground("black", "green");
    objects.forEach(function(obj) {
        if(obj.type == "wall") obj.collision(ball.x, ball.y); //Kontrola kolizí
        if(obj.type == "sand") obj.collision(ball.x, ball.y);
        if(obj.type == "water") obj.collision(ball.x, ball.y);
        if(obj.type == "hole" && ball.placed) {
            if((obj.dist(ball.x, ball.y) <= obj.radius*2) && (ball.xSpeed < 2 && ball.ySpeed < 2 && ball.xSpeed > -2 && ball.ySpeed > -2)) {
                ball.holeStroke.play();
                unloadLevel();
                return;
            }
        }
        obj.paint(ctx);
    });

    if(objects[0].inStart() || ball.placed) //Vykresli míč pouze pokud je ve startu nebo už byl položen.
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

function think() { //Zakladní opakovací funkce ..Moc nevyužita :)
    if(ball == null || end == true) return;
    ball.move(canvas);
    paint();
}

document.addEventListener("mousemove", function(evt) { //Aktualizování pozice myši
    cx = getMousePos(canvas, evt).x;
    cy = getMousePos(canvas, evt).y;
}) 

document.addEventListener("click", function(evt) {
    if(end) return;
    if(ball.placed == false && objects[0].inStart()) {
        ball.placed = true;
    }
    else {
        if(ball == null) return;
        if(ball.moving()  || ball.dist(cx, cy) > 200) return;
        var xF = -((ball.x - cx)/10);
        var yF = -((ball.y - cy)/10);
        ball.stroke(xF,yF);
    }
})
