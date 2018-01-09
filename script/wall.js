function Wall(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.type = "wall";         // typ objektu
    this.fillStyle = "white";      // barva výplně
    this.strokeStyle = "black";   // barva obrysu
    this.lineWidth = 5;
    this.lineDash = [];
    this.hitboxSize = 25;  
  
    this.collision = function(bx, by) {
      if((bx + ball.radius >= this.x && bx + ball.radius < this.x + this.hitboxSize) && (by >= this.y && by < this.y + this.height)) {
        ball.xSpeed = -(ball.xSpeed);
        ball.x -= ball.radius/4;
      }
      else if((bx - ball.radius <= this.x + this.width && bx - ball.radius > this.x + this.width - this.hitboxSize) && (by >= this.y && by < this.y + this.height)) {
        ball.xSpeed = -(ball.xSpeed);
        ball.x += ball.radius/4;
      }
      else if((by + ball.radius >= this.y && by + ball.radius < this.y + this.hitboxSize) && (bx >= this.x && bx < this.x + this.width)) {
        ball.ySpeed = -(ball.ySpeed);
        ball.y -= ball.radius/4;
      }
      else if((by - ball.radius <= this.y + this.height && by - ball.radius > this.y + this.height - this.hitboxSize) && (bx >= this.x && bx < this.x + this.width)) {
        ball.ySpeed = -(ball.ySpeed);
        ball.y += ball.radius/4;
      }
    }

    this.paint = function(ctx) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}