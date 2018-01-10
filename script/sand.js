function Sand(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.type = "sand";         // typ objektu
    this.fillStyle = "yellow";      // barva výplně
    this.strokeStyle = "black";   // barva obrysu
    this.friction = 0.95;
    this.lineWidth = 5;
    this.lineDash = [];
  
    this.collision = function(bx, by) {
      if(ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
        ball.xSpeed *= this.friction;
        ball.ySpeed *= this.friction;
      }
    }

    this.paint = function(ctx) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}