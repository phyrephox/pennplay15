var mus = document.getElementById('music_loop');
mus.playbackRate = 1;

window.addEventListener('keydown', keyPress, false);
window.addEventListener('keyup', keyRelease, false);

var ctx = document.getElementById('field').getContext('2d');
var roads = [];
var cities = [];
cities[0] = new City(250,320,0);
cities[1] = new City(750,320,1);

var offset = 0;
var scroll = 0;
var startCity = -1;
var startX = 0;
var startY = 0;
var team = 0;

var socket = io();
socket.on('found', function(msg){
    team = msg;
    console.log(team);
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

socket.on('update', function(state){
    //console.log(state);
    roads=[];
    for (var i=0; i<state.length; i++){
        cities[i]=new City(state[i].x, state[i].y, state[i].owner);
        //console.log(state[i].owner+" "+cities[i].owner);
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

socket.on('realize_city', function(msg){
    if (msg[2] != cities.length) {
        socket.emit('client_confused');
    } else {
        cities[msg[2]] = new City(msg[0], msg[1], msg[3]);
    }
});

socket.on('realize_road', function(msg){
    if (msg[0] >= cities.length || msg[1] >= cities.length) {
        socket.emit('client_confused');
    } else {
        var start = cities[msg[0]], end = cities[msg[1]];
        roads[roads.length] = new Road(start.x, start.y, end.x, end.y);
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
    socket.emit('road_delete', ans);
    roads.length = count;
});

function makeRoad(startX, startY, x, y) {
    var distA = Math.abs(startX-x);
    var distB = Math.abs(startX-x+1000);
    var distC = Math.abs(startX-x-1000);
    if (distA<=distB && distA<=distC) {
        return new Road(startX,startY, x, y);
    } else if (distB<=distA && distB<=distC){
        return new Road(startX,startY, x-1000, y);
    } else {
        return new Road(startX,startY, x+1000, y);
    }

}

function draw(){
    //console.log(team);
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
    console.log(startCity+" "+endCity);
    if (startCity==endCity) {
        var count = 0;
        var sendCount=0;
        var ans = [];
        for (var i=0; i<roads.length; i++){
            if (!roads[i].cross(startX, startY, x, y)) {
                roads[count] = roads[i];
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
                if (cities[from].owner == team) {
                    //socket.emit('road_delete', [from, to]);
                    ans[sendCount] = [from, to];
                    sendCount++;
                    console.log(from+" "+to);
                } else {
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
    if (startCity != cities.length) { //start city is old
        if (cities[startCity].owner != team) { // start city is enemy
            console.log('starting at enemy '+startCity);
            startCity = -1;
            return;
        }
        if (endCity == cities.length) { // end city is new
            console.log('from exist to new');
            cities[cities.length] = new City(x, y, team);
            socket.emit('new_city', [x, y, cities.length-1]);
        }
    } else { // start city is new
        if (cities[endCity].owner != team) { // end city is enemy with new city
            console.log('from new to enemy');
            startCity = -1;
            return;
        }
        cities[cities.length] = new City(startX, startY, team);
        socket.emit('new_city', [startX, startY, cities.length-1]);
    }
    roads[roads.length] = makeRoad(startX, startY, x, y);
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
