function Road(ax, ay, bx, by){
    this.x0=ax;
    this.y0=ay;
    this.x2=bx;
    this.y2=by;
    if (this.x0 == this.x2) {
        if (this.y0<this.y2){
            this.x2 += 0.01;
        } else {
            this.x0 += 0.01;
        }
    }
    if (this.y0 == this.y2) {
        if (this.x0<this.x2) {
            this.y2 += 0.01;
        } else {
            this.y0 += 0.01;
        }
    }
    var dx = this.x2-this.x0;
    var dy = this.y2-this.y0;
    this.dist = Math.sqrt(dx*dx+dy*dy);
    
    var xMid = (this.x0+this.x2)/2;
    var yMid = (this.y0+this.y2)/2;
    var xTemp = xMid+(this.x0-this.x2);
    var yTemp = -dx/dy*(xTemp-xMid)+yMid;
    var distT = Math.sqrt((xTemp-xMid)*(xTemp-xMid)+(yTemp-yMid)*(yTemp-yMid));
    
    this.x1 = xMid + this.dist/4/distT*(xTemp-xMid);
    this.y1 = yMid + this.dist/4/distT*(yTemp-yMid);
    
    var img = new Image;
    img.src = 'road.png';
    var render = function(width, height, renderFunc) {
        var buff = document.createElement('canvas');
        buff.width = width;
        buff.height = height;
        renderFunc(buff.getContext('2d'));
        return buff;
    }
    var cached = function(ctx) {
        ctx.arc(0,0,500,0,2*Math.PI);
    }

    var count = 0;
    var calc = false;
    var can;
    this.draw = function(ctx, offset){
        if (!calc) {
            can = document.createElement('canvas');
            can.width = 2000;
            can.height = 640,
            context = can.getContext('2d');
            for (var i=0;i<100;i++){
                var t=i/100.0;
                var x=(1-t)*((1-t)*this.x0+t*this.x1)+t*((1-t)*this.x1+t*this.x2);
                var y=(1-t)*((1-t)*this.y0+t*this.y1)+t*((1-t)*this.y1+t*this.y2);
                var xDraw = x;
                if (xDraw<0){
                    xDraw+=2000;
                }
                if (xDraw>640){
                    xDraw-=2000;
                }
                ctx.moveTo(xDraw,y);
                var dx = 2*(1-t)*(this.x1-this.x0)+2*t*(this.x2-this.x1);
                var dy = 2*(1-t)*(this.y1-this.y0)+2*t*(this.y2-this.y1);
                drawRotatedImage(context, img, xDraw, y, Math.atan2(dy, dx));
                drawRotatedImage(context, img, xDraw+2000, y, Math.atan2(dy, dx));
                drawRotatedImage(context, img, xDraw-2000, y, Math.atan2(dy, dx));
                offsetInternal = xDraw;
            }
            calc=true;
        }
        ctx.drawImage(can,offset,0);
        ctx.drawImage(can,offset-2000,0);
        for (var i=count; i<100; i+=50) {
            var t=i/100;
            var x=(1-t)*((1-t)*this.x0+t*this.x1)+t*((1-t)*this.x1+t*this.x2);
            var y=(1-t)*((1-t)*this.y0+t*this.y1)+t*((1-t)*this.y1+t*this.y2);
            ctx.beginPath();
            ctx.arc(x+offset,y,3,0,2*Math.PI);
            ctx.arc(x+offset-2000,y,3,0,2*Math.PI);
            ctx.fill();
        }
        count+=1;
        count%=50;
    }
    
    function drawRotatedImage(ctx, image, x, y, angle){//, wave) { 
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	//if (wave) {
	    //ctx.drawImage(image, -(image.width/2*1.5), -(image.height/2*1.5),15,15);
	    //ctx.arc(0,0,3,0,2*Math.PI);
	//} else {
	    ctx.drawImage(image, -(image.width/2), -(image.height/2));
	//}
	ctx.restore(); 
}
    
    function crossProd(x1, y1, x2,y2) {
        return x1*x2+y1*y2;
    }
    
    this.cross = function(Cx, Cy, Dx, Dy){
        Cx%=2000;
        Dx%=2000;
        var Ax=this.x0;
        var Bx=this.x2;
        var Ay=this.y0;
        var By=this.y2;
        
        var o1 = orientation(Ax, Ay, Bx, By, Cx, Cy);
        var o2 = orientation(Ax, Ay, Bx, By, Dx, Dy);
        var o3 = orientation(Cx, Cy, Dx, Dy, Ax, Ay);
        var o4 = orientation(Cx, Cy, Dx, Dy, Bx, By);
        if (o1 != o2 && o3 != o4) {
            return true;
        }
        Cx+=2000;
        Dx+=2000;
        o1 = orientation(Ax, Ay, Bx, By, Cx, Cy);
        o2 = orientation(Ax, Ay, Bx, By, Dx, Dy);
        o3 = orientation(Cx, Cy, Dx, Dy, Ax, Ay);
        o4 = orientation(Cx, Cy, Dx, Dy, Bx, By);
        if (o1 != o2 && o3 != o4) {
            return true;
        }
        Cx-=4000;
        Dx-=4000;
        o1 = orientation(Ax, Ay, Bx, By, Cx, Cy);
        o2 = orientation(Ax, Ay, Bx, By, Dx, Dy);
        o3 = orientation(Cx, Cy, Dx, Dy, Ax, Ay);
        o4 = orientation(Cx, Cy, Dx, Dy, Bx, By);
        if (o1 != o2 && o3 != o4) {
            return true;
        }
        return false;
    }
    function orientation(x1, y1, x2, y2, x3, y3) {
        var val = (y2-y1)*(x3-x2)-(x2-x1)*(y3-y2);
        if (val == 0) return 0;
        return (val>0)?1:2;
    }
 }
