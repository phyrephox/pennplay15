function Road(ax, ay, bx, by){
    this.x0=ax;
    this.y0=ay;
    this.x2=bx;
    this.y2=by;
    if (this.x0 == this.x2) {
        this.x2 +=.01;
    }
    if (this.y0 == this.y2) {
        this.y2 +=.01;
    }
    var dx = this.x2-this.x0;
    var dy = this.y2-this.y0;
    this.dist = Math.sqrt(dx*dx+dy*dy);
    
    var xMid = (this.x0+this.x2)/2;
    var yMid = (this.y0+this.y2)/2;
    var xTemp = xMid+(this.x0-this.x2);
    var yTemp = -dx/dy*(xTemp-xMid)+yMid;
    var distT = Math.sqrt((xTemp-xMid)*(xTemp-xMid)+(yTemp-yMid)*(yTemp-yMid));
    //console.log(Math.sqrt(dx*dx+dy*dy));
    
    this.x1 = xMid + this.dist/4/distT*(xTemp-xMid);
    this.y1 = yMid + this.dist/4/distT*(yTemp-yMid);

    this.draw = function(ctx, offset){
        ctx.moveTo(this.x0+offset,this.y0);
        for (var i=0;i<100;i++){
            var t=i/100.0;
            var x=(1-t)*((1-t)*this.x0+t*this.x1)+t*((1-t)*this.x1+t*this.x2);
            var y=(1-t)*((1-t)*this.y0+t*this.y1)+t*((1-t)*this.y1+t*this.y2);
            var xDraw = x + offset;
            if (xDraw<0){
                xDraw+=1000;
            }
            if (xDraw>640){
                xDraw-=1000;
            }
            ctx.moveTo(xDraw,y);
            ctx.arc(xDraw,y,3,0,2*Math.PI);
        }
    }
}
