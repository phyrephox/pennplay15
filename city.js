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
    
    this.draw = function(ctx){
        ctx.arc(this.x, this.y, 50, 0, 2*Math.PI);
    }
}