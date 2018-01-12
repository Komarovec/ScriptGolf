function StartRect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.type = "start";         // typ objektu
    this.fillStyle = "rgb(0,100,0)";      // barva výplně

    this.inStart = function() {
        return (ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height);
    }

    this.paint = function(ctx) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}