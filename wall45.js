function Wall45(x, y, s, type) {
    this.x = x;
    this.y = y;
    this.size = s;
    this.type = "wall";         // typ objektu
    this.fillStyle = "white";      // barva výplně
    this.hitboxSize = 25;  
    this.type = type; // 1 - 4 Podle toho do jakého rohu.

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
        ctx.moveTo(this.x, this.y);
        if(type == 1) {  
            ctx.lineTo(this.x+this.size, this.y);
            ctx.lineTo(this.x, this.y+this.size);
            ctx.lineTo(this.x, this.y);
        }
        else if(type == 2) {
            ctx.lineTo(this.x+this.size, this.y);
            ctx.lineTo(this.x+this.size, this.y+this.size);
            ctx.lineTo(this.x, this.y);
        }
        else if(type == 3) {
            ctx.lineTo(this.x+this.size, this.y+this.size);
            ctx.lineTo(this.x, this.y+this.size);
            ctx.lineTo(this.x, this.y);
        }
        else if(type == 4) {
            ctx.lineTo(this.x, this.y-this.size);
            ctx.lineTo(this.x, this.y+this.size);
            ctx.lineTo(this.x, this.y);
        }
        ctx.stroke();
        ctx.fill();
    }
}