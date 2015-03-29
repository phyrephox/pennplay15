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
    this.rank1;
    this.rank2;
    this.owner=owner;
    var rad=25;
    var img = new Image;
    img.src = 'city1.png';
    
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
        ctx.drawImage(img, xDraw-50/2,this.y-35/2, 50, 35);
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(xDraw, this.y, rad, 0, 2*Math.PI);
        if (this.owner == 0) {
            ctx.strokeStyle = "#00ff00";
        } else {
            ctx.strokeStyle = "#0000ff";
        }
        ctx.stroke();
    }
    
    this.contains = function(x, y) {
        dist = (x-this.x)*(x-this.x)+(y-this.y)*(y-this.y);
        if (dist < 2*rad*rad) {
            return true;
        }
        x+=1000;
        dist = (x-this.x)*(x-this.x)+(y-this.y)*(y-this.y);
        if (dist < 2*rad*rad) {
            return true;
        }
        x-=2000;
        dist = (x-this.x)*(x-this.x)+(y-this.y)*(y-this.y);
        if (dist < 2*rad*rad) {
            return true;
        }
        return false;
    }
}
