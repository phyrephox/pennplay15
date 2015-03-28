function City(xPos,yPos){
    this.x=xPos;
    this.y=yPos;
    this.rank;
    this.rankA;
    this.rankB;
    this.owner;
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
        ctx.moveTo(xDraw, this.y);
        ctx.arc(xDraw, this.y, rad, 0, 2*Math.PI);
    }
    
    this.contains = function(x, y) {
        dist = (x-this.x)*(x-this.x)+(y-this.y)*(y-this.y);
        if (dist < rad*rad) {
            return true;
        }return false;
    }
}
