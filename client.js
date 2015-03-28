var mus = document.getElementById('music_loop');
mus.playbackRate = 1;

window.addEventListener('keydown', keyPress, false);
window.addEventListener('keyup', keyRelease, false);

var ctx = document.getElementById('field').getContext('2d');
var roads = [];
var cities = [];
cities[0] = new City(50,50);
cities[1] = new City(450,450);
roads[0] = new Road(cities[0].x,cities[0].y,cities[1].x, cities[1].y);

var offset = 0;
var scroll = 0;

function draw(){
    ctx.clearRect(0,0,640,640);
    offset+=scroll;
    if (offset < 0) {
        offset += 1000;
    }
    if (offset > 1000) {
        offset -= 1000;
    }
    ctx.beginPath();
    for (var i=0;i<cities.length;i++){
        cities[i].draw(ctx, offset);
    }
    ctx.fill();

    ctx.beginPath();
    for (var i=0;i<roads.length;i++){
        roads[i].draw(ctx, offset);
    }
    ctx.fill();
    console.log(offset);
}

function handleMouse(e) {
    //console.log(e);
}

function keyPress(e){
    //console.log(e);
    if (e.which == 37) {
        scroll = -5;
    } else if(e.which == 39) {
        scroll = 5;
    }
}
function keyRelease(e){
    console.log(e);
    if (e.which == 37|| e.which == 39) {
        scroll = 0;
    }
}

function getNextFrame(){
    draw();
    window.requestAnimationFrame(getNextFrame);
}
window.requestAnimationFrame(getNextFrame);
