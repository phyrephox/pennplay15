var mus = document.getElementById('music_loop');
mus.playbackRate = 1;

var ctx = document.getElementById('field').getContext('2d');
var roads = [];
var cities = [];
cities[0] = new City(50,50);
cities[1] = new City(450,450);
roads[0] = new Road(cities[0].x,cities[0].y,cities[1].x, cities[1].y);

ctx.beginPath();
for (var i=0;i<cities.length;i++){
    cities[i].draw(ctx);
}
ctx.fill();

ctx.beginPath();
for (var i=0;i<roads.length;i++){
    roads[i].draw(ctx);
}
ctx.stroke();
