var mus = document.getElementById('music_loop');
mus.playbackRate = 1;

window.addEventListener('keydown', keyPress, false);
window.addEventListener('keyup', keyRelease, false);

var ctx = document.getElementById('field').getContext('2d');
var roads = [];
var cities = [];
cities[0] = new City(250,320,0);
cities[1] = new City(750,320,1);
//roads[0] = new Road(cities[0].x,cities[0].y,cities[1].x, cities[1].y);

var offset = 0;
var scroll = 0;
var startCity = -1;
var startX = 0;
var startY = 0;

var socket = io();
socket.on('new-state', function(state){
    console.log(state);
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
                var distA = Math.abs(startX-x);
                var distB = Math.abs(startX-x+1000);
                var distC = Math.abs(startX-x-1000);
                if (distA<=distB && distA<=distC) {
                    roads[count] = new Road(startX,startY, x, y);
                } else if (distB<=distA && distB<=distC){
                    roads[count] = new Road(startX,startY, x-1000, y);
                } else {
                    roads[count] = new Road(startX,startY, x+1000, y);
                }
                count++;
            }
        }
    }
    roads.length=count;
    console.log(cities);
    console.log(roads);
});

socket.on('update', function(state){
    console.log(state);
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
                var distA = Math.abs(startX-x);
                var distB = Math.abs(startX-x+1000);
                var distC = Math.abs(startX-x-1000);
                if (distA<=distB && distA<=distC) {
                    roads[count] = new Road(startX,startY, x, y);
                } else if (distB<=distA && distB<=distC){
                    roads[count] = new Road(startX,startY, x-1000, y);
                } else {
                    roads[count] = new Road(startX,startY, x+1000, y);
                }
                count++;
            }
        }
    }
    roads.length=count;
    console.log(cities);
    console.log(roads);
});

function draw(){
    //console.log(cities);
    //console.log(roads);
    ctx.clearRect(0,0,640,640);
    offset+=scroll;
    if (offset < 0) {
        offset += 1000;
    }
    if (offset > 1000) {
        offset -= 1000;
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
}

function handleMouseDown(e) {
    var x = e.offsetX-offset;
    if (x<0){
        x+=1000;
    }
    if (x>640){
        x-=1000;
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
        x+=1000;
    }
    if (x>640){
        x-=1000;
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
    //console.log(startCity+" "+endCity);
    if (startCity==endCity) {
        var count = 0;
        var newRoads = [];
        for (var i=0; i<roads.length; i++){
            if (!roads[i].cross(startX, startY, x, y)) {
                newRoads[count] = roads[i];
                count++;
            } else {
                var from = 0;
                var to = 0;
                for (var j=0;j<cities.length;j++){
                    if (cities[j].contains(roads[i].x0, roads[i].y0)) {
                        from = j;
                    } else if (cities[j].contains(roads[i].x2, roads[i].y2)) {
                        to = j;
                    }
                }
                socket.emit('road-delete', [from, to]);
                console.log(from+" "+to);
            }
        }
        roads = newRoads;
        startCity=-1;
        return;
    }
    if(endCity==cities.length) {
        if (startCity!=-1){
            cities[cities.length] = new City(x,y);
            socket.emit('new_city',[x, y, cities.length-1]);
        }
    }else {
        if(startCity==cities.length){
            cities[cities.length] = new City(startX, startY);
            socket.emit('new_city',[startX, startY, cities.length-1]);
        }
    }
    var distA = Math.abs(startX-x);
    var distB = Math.abs(startX-x+1000);
    var distC = Math.abs(startX-x-1000);
    if (distA<=distB && distA<=distC) {
        roads[roads.length] = new Road(startX,startY, x, y);
    } else if (distB<=distA && distB<=distC){
        roads[roads.length] = new Road(startX,startY, x-1000, y);
    } else {
        roads[roads.length] = new Road(startX,startY, x+1000, y);
    }
    socket.emit('new_road', [startCity, endCity, roads[roads.length-1].dist]);
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
