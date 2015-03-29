var mus = document.getElementById('music_loop');
var musI = document.getElementById('music_intro');
var musRoad = document.createElement('audio');
//musRoad.src = '/makeRoad.wav';
musI.play();
//mus.play();
mus.loop=true;
musI.addEventListener('ended', function(){mus.play()}, false);

window.addEventListener('keydown', keyPress, false);
window.addEventListener('keyup', keyRelease, false);

var ctx = document.getElementById('field').getContext('2d');
var roads = [];
var cities = [];
cities[0] = new City(500,320,0);
cities[1] = new City(1500,320,1);

var offset = 0;
var scroll = 0;
var startCity = -1;
var startX = 0;
var startY = 0;
var team = 0;
var outcome = 0;
var power = 100;

var bg = new Image();
bg.src = '/mars.jpg';

var socket = io();
socket.on('onconnected', function(msg) {
	console.log('connected!');
	socket.emit('want-to-play');
});
socket.on('found', function(msg){
    team = msg;
    console.log(team);
	socket.emit('playing');
	if (team == 0) {
	    offset = -180;
	} else {
	    offset = -1180;
	}
});
socket.on('endgame', function(msg){
    if (team == msg) {
        outcome=1;
    } else {
        outcome=-1;
    }
});

socket.on('new-state', function(state){
    //console.log(state);
    roads=[];
    for (var i=0; i<state.length; i++){
        cities[i]=new City(state[i].x, state[i].y, state[i].owner);
    }
    var count=0;
    for (var i=0; i<state.length; i++){
        for (var j=0; j<state[i].outEdges.length; j++){
            if (state[i].outEdges[j]!=-1){
                var startX = cities[i].x;
                var startY = cities[i].y;
                var x = cities[j].x;
                var y = cities[j].y;
                roads[count] = makeRoad(startX, startY, x, y);
                count++;
            }
        }
    }
    roads.length=count;
    //console.log(cities);
    //console.log(roads);
});

socket.on('update', function(info){
    //console.log(state);
    power = info[0][team];
    var state = info[1];
    for (var i=0; i<state.length;i++){
        cities[i].rank1=state[i][0];
        cities[i].rank2=state[i][1];
        cities[i].rank =state[i][2];
        cities[i].owner=state[i][3];
    }
});

socket.on('realize_city', function(msg){
    if (msg[2] != cities.length) {
        socket.emit('client_confused');
    } else {
        cities[msg[2]] = new City(msg[0], msg[1], msg[3]);
    }
});

socket.on('realize_road', function(msg){
    console.log(msg);
    if (msg[0] >= cities.length || msg[1] >= cities.length) {
        socket.emit('client_confused');
    } else {
        var start = cities[msg[0]], end = cities[msg[1]];
        roads[roads.length] = makeRoad(start.x, start.y, end.x, end.y);
    }
});

socket.on('realize_delete', function(msg){
    var count = 0;
    startX = msg[0];
    startY = msg[1];
    x = msg[2];
    y = msg[3];
    for (var i=0; i<roads.length; i++){
        if (!roads[i].cross(startX, startY, x, y)) {
            roads[count] = roads[i];
            count++;
        }
    }
    roads.length = count;
});

function makeRoad(startX, startY, x, y) {
    var distA = Math.abs(startX-x);
    var distB = Math.abs(startX-x+2000);
    var distC = Math.abs(startX-x-2000);
    if (distA<=distB && distA<=distC) {
        return new Road(startX,startY, x, y);
    } else if (distB<=distA && distB<=distC){
        return new Road(startX,startY, x-2000, y);
    } else {
        return new Road(startX,startY, x+2000, y);
    }

}

function draw(){
    //console.log(team);
    //console.log(cities);
    //console.log(roads);
    ctx.clearRect(0,0,640,640);
    ctx.drawImage(bg,2000-offset,0,offset,640,0,0,offset, 640);
    ctx.drawImage(bg,1000-offset,0,offset,640,0,0,offset, 640);
    ctx.drawImage(bg,offset,0);
    offset+=scroll;
    if (offset < 0) {
        offset += 2000;
    }
    if (offset > 2000) {
        offset -= 2000;
    }
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    for (var i=0;i<roads.length;i++){
        roads[i].draw(ctx, offset);
    }
    ctx.fill();
    for (var i=0;i<cities.length;i++){
        cities[i].draw(ctx, offset);
    }
    if (outcome==1) {
        ctx.font="30px verdana";
        ctx.fillText("CONGRADULATIONS!",10,305);
    } else if (outcome==-1) {
        ctx.font="30px verdana";
        ctx.fillText("YOU LOSE",10,305);
    }
    ctx.fillStyle='#000000';
    ctx.fillRect(0,640,640,10);
    if (team == 0){
        ctx.fillStyle='#0000ff';
    } else {
        ctx.fillStyle='#00ff00';
    }
    ctx.fillRect(0,640,power/100*640,10);
}

function handleMouseDown(e) {
    var x = e.offsetX-offset;
    if (x<0){
        x+=2000;
    }
    if (x>640){
        x-=2000;
    }
    var y = e.offsetY;
    for (var i=0; i<cities.length; i++) {
        if(cities[i].contains(x, y)) {
            startCity = i;
            startX=cities[i].x;
            startY=cities[i].y;
        }
    }
    if (startCity == -1) {
        startCity = cities.length;
        startX = x;
        startY = y;
    }
}
function handleMouseUp(e) {
    var x = e.offsetX-offset;
    if (x<0){
        x+=2000;
    }
    if (x>640){
        x-=2000;
    }
    var y = e.offsetY;
    var endCity=-1;
    for (var i=0;i<cities.length;i++) {
        if (cities[i].contains(x,y)) {
            endCity = i;
            x = cities[i].x;
            y = cities[i].y;
        }
    }
    if (endCity==-1) {
        endCity = cities.length;
    }
    console.log('click '+startCity+" "+endCity);
    if (startCity==endCity) {
        var count = 0;
        var sendCount=0;
        var ans = [];
        var dist1 = Math.abs(startX-x);
        var dist2 = Math.abs(startX-x+2000);
        var dist3 = Math.abs(startX-x-2000);
        if (dist1 <= dist2 && dist1 <= dist3);
        else if (dist2 <= dist1 && dist2 <= dist3){
            startX+=2000;
        } else {
            x+=2000;
        }
        console.log(x+" "+startX);
        for (var i=0; i<roads.length; i++){
            if (!roads[i].cross(startX, startY, x, y)) {
                roads[count] = roads[i];
                count++;
            } else {
                var from = -1;
                var to = -1;
                console.log("road"+roads[i].x2+" "+roads[i].y2);
                for (var j=0;j<cities.length;j++){
                    console.log("city"+cities[j].x+" "+cities[j].y);
                    if (cities[j].contains(roads[i].x0, roads[i].y0)) {
                        from = j;
                    } else if (cities[j].contains(roads[i].x2, roads[i].y2)) {
                        to = j;
                    }
                }
                if (cities[from].owner == team) {
                    //socket.emit('road_delete', [from, to]);
                    ans[sendCount] = [from, to];
                    sendCount++;
                    console.log(from+" "+to);
                } else {
                    console.log("can't cut ("+from+", "+to+")");
                    roads[count] = roads[i];
                    count++;
                }
            }
        }
        if (ans.length != 0) {
            socket.emit('road_delete', [ans,[startX, startY, x, y]]);
        }
        roads.length = count;
        startCity=-1;
        return;
    }
    var road_temp = makeRoad(startX, startY, x, y);
    if (road_temp.dist>400) {
        startCity=-1;
        return;
    }
    if (startCity != cities.length) { //start city is old
        if (cities[startCity].owner != team) { // start city is enemy
            console.log('starting at enemy '+startCity);
            startCity = -1;
            return;
        }
        if (endCity == cities.length) { // end city is new
            console.log('from exist to new');
            if (power<25) {
                startCity=-1;
                return;
            }
            power-=15;
            cities[cities.length] = new City(x, y, team);
            socket.emit('new_city', [x, y, cities.length-1]);
        }
    } else { // start city is new
        if (cities[endCity].owner != team) { // end city is enemy with new city
            console.log('from new to enemy');
            startCity = -1;
            return;
        }
        if (power<25) {
            startCity=-1;
            return;
        }
        power-=15;
        cities[cities.length] = new City(startX, startY, team);
        socket.emit('new_city', [startX, startY, cities.length-1]);
    }
    if (power<10) {
        startCity=-1;
        return;
    }
    power-=10;
    socket.emit('new_road', [startCity, endCity, road_temp.dist]);
    startCity=-1;
}

function keyPress(e){
    if (e.which == 37) {
        scroll = 10;
    } else if(e.which == 39) {
        scroll = -10;
    }
}
function keyRelease(e){
    if (e.which == 37|| e.which == 39) {
        scroll = 0;
    }
}

function getNextFrame(){
    draw();
    window.requestAnimationFrame(getNextFrame);
}
window.requestAnimationFrame(getNextFrame);
