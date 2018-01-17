function Golfball(x, y, color) {
    this.x = x;
    this.y = y;
    this.placed = false;
    this.type = "ball";         // typ objektu
    this.radius = 10;
    this.fillStyle = color;      // barva výplně
    this.strokeStyle = "black";   // barva obrysu
    this.lineWidth = 5;
    this.lineDash = [];
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.friction = 0.08; //Statický odpor  
    this.xFricMulti = 1;
    this.yFricMulti = 1;
    this.strokeSound = new sound("content/sounds/stroke.wav");
    this.ricochet = new sound("content/sounds/bounce.mp3");
    this.holeStroke = new sound("content/sounds/hole.wav");
    this.splash = new sound("content/sounds/splash.wav");
    
    this.dist = function(cx, cy) { //Výpočet vzdálenosti mičku od kurzoru
      var dx = Math.abs(cx - this.x);
      var dy = Math.abs(cy - this.y);
      var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      return distance;
    }
    
    this.moving = function() {
        return (this.xSpeed > 0 || this.xSpeed < 0 || this.ySpeed > 0 || this.ySpeed < 0);
    }

    this.paint = function(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.setLineDash(this.lineDash);
      ctx.arc(this.x, this.y, this.radius, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
      ctx.clip();
      ctx.restore();
    }

    this.stroke = function(xForce, yForce) {
        if(!this.placed) return;
        strokes++;
        this.strokeSound.play();
        this.xSpeed = xForce;
        this.ySpeed = yForce;
        if(Math.abs(xForce) > Math.abs(yForce)) { //Poměrové rozdělení odporů --> zákon superpozice
            this.yFricMulti = Math.abs(yForce)/Math.abs(xForce);
            this.xFricMulti = 1;
        }
        else {
            this.xFricMulti = Math.abs(xForce)/Math.abs(yForce);
            this.yFricMulti = 1;
        }
    }

    this.move = function(canvas) {
        if(!this.placed) return;
        //console.log(this.xSpeed+" "+this.ySpeed); //<-- Ladění pro vyrovnávání

        if(this.xSpeed <= this.friction && this.xSpeed >= -this.friction) {
            //Ochrana proti loopu když je rychlost nevynulovatelná odporem
            this.xSpeed = 0;
        }
        else if(this.xSpeed > 0) { 
            //Použití rychlostí --> zpět z intu na float
            this.x += this.xSpeed; 
            //Vyrovnávání zpět na nulu --> nepřesnost floatu (toFixed / toPrecision nefunkční pro rychlosti)
            //Bohužel ne zcela přesné ale funkční --> někdy nedokáže úplně zastavit
            this.xSpeed = this.xSpeed - this.xFricMulti*this.friction; 
        }
        else if(this.xSpeed < 0) {
            this.x += this.xSpeed;
            this.xSpeed = this.xSpeed + this.xFricMulti*this.friction;
        }

        if(this.ySpeed <= this.friction && this.ySpeed >= -this.friction) {
            this.ySpeed = 0;
        }
        else if(this.ySpeed > 0) {
            this.y += this.ySpeed;
            this.ySpeed = this.ySpeed - this.yFricMulti*this.friction;
        }
        else if(this.ySpeed < 0) {
            this.y += this.ySpeed;
            this.ySpeed = this.ySpeed + this.yFricMulti*this.friction;
        }
        
        if (this.x >= canvas.width - this.radius) { //Odraz od kraje mapy
            this.xSpeed = -this.xSpeed;
            this.x = this.x - this.radius/4; //Kvůli možnému uvíznutí ve stěnách
            this.ricochet.play();
        }
        if (this.x <= this.radius) {
            this.xSpeed = -(this.xSpeed);
            this.x = this.x + this.radius/4;
            this.ricochet.play();
        }

        if (this.y >= canvas.height - this.radius) {
            this.ySpeed = -(this.ySpeed);
            this.y = this.y - this.radius/4;
            this.ricochet.play();
        }
        if (this.y <= this.radius) {
            this.ySpeed = -(this.ySpeed);
            this.y = this.y + this.radius/4;
            this.ricochet.play();
        }
    }
}