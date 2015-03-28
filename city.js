function City(xPos, yPos, owner){
    this.x=xPos;
    if (this.x<0){
        this.x+=1000;
    }
    if (this.x>640){
        this.x-=1000;
    }
    this.y=yPos;
    this.rank;
    this.rankA;
    this.rankB;
    this.owner=owner;
    var rad=15;
    
    this.updateRank = function(rankA, rankB) {
        this.rankA=rankA;
        this.rankB=rankB;
        this.rank=rankA+rankB;
    }
    
    this.draw = function(ctx, offset) {
        var xDraw = this.x+offset;
        ctx.moveTo(xDraw, this.y);
        ctx.arc(xDraw, this.y, rad, 0, 2*Math.PI);
        if (xDraw<0){
            xDraw+=1000;
        }
        if (xDraw>640){
            xDraw-=1000;
        }
        ctx.beginPath();
        ctx.moveTo(xDraw, this.y);
        ctx.arc(xDraw, this.y, rad, 0, 2*Math.PI);
        if (this.owner == 1) {
            ctx.fillStyle = "#ff0000";
        } else {
            ctx.fillStyle = "#0000ff";
        }
        ctx.fill();
    }
    
    this.contains = function(x, y) {
        dist = (x-this.x)*(x-this.x)+(y-this.y)*(y-this.y);
        if (dist < 4*rad*rad) {
            return true;
        }return false;
    }
}
