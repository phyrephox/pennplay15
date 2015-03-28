function City(xPos,yPos){
    this.x=xPos;
    this.y=yPos;
    this.rank;
    this.rankA;
    this.rankB;
    
    this.updateRank = function(rankA, rankB){
        this.rankA=rankA;
        this.rankB=rankB;
        this.rank=rankA+rankB;
    }
    
    this.draw = function(ctx, offset){
        var xDraw = this.x+offset;
        ctx.moveTo(xDraw, this.y);
        ctx.arc(xDraw, this.y, 50, 0, 2*Math.PI);
        if (xDraw<0){
            xDraw+=1000;
        }
        if (xDraw>640){
            xDraw-=1000;
        }
        ctx.moveTo(xDraw, this.y);
        ctx.arc(xDraw, this.y, 50, 0, 2*Math.PI);
    }
}
