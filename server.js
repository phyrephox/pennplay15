var graph = require('./graph');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cparser = require('cookie-parser');

app.get('/client.js', function(req, res, err){
    res.sendFile(__dirname + '/client.js');
});
app.get('/city.js', function(req, res, err){
    res.sendFile(__dirname + '/city.js');
});
app.get('/road.js', function(req, res, err){
    res.sendFile(__dirname + '/road.js');
});
app.get('/Space_Loop.wav', function(req, res, err){
    res.sendFile(__dirname + '/res/Space_Loop.wav');
});
app.get('/', function(req, res, err){
	res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
 console.log('listening on 3000');
});
