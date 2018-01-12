function Hole(x, y) {
    this.x = x;
    this.y = y;
    this.type = "hole";         // typ objektu
    this.radius = 12;
    this.fillStyle = "brown";      // barva výplně
    this.strokeStyle = "black";   // barva obrysu
    this.lineWidth = 5;
    this.lineDash = [];
    
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

    this.dist = function(cx, cy) { //Výpočet vzdálenosti mičku od jamky
        var dx = Math.abs(cx - this.x);
        var dy = Math.abs(cy - this.y);
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return distance;
    }
}