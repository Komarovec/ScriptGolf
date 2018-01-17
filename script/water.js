function Water(x, y, w, h) { //Žbluňk
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.type = "water";         // typ objektu
    this.fillStyle = "blue";      // barva výplně
    this.strokeStyle = "black";   // barva obrysu
    this.lineWidth = 5;
    this.lineDash = [];
  
    this.collision = function() {
        if(!ball.placed) return;
        if(ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
            ball.xSpeed = 0;
            ball.ySpeed = 0;
            ball.placed = false;
            ball.splash.play();
        }
    }

    this.paint = function(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}