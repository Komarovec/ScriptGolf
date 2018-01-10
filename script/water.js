function Water(x, y, w, h) {
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
        if(ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
            ball.x = ball.startX;
            ball.y = ball.startY;
            ball.xSpeed = 0;
            ball.ySpeed = 0;
        }
    }

    this.paint = function(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}