var graph = require('./graph');
var game = require('./game');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cparser = require('cookie-parser');
//var router = app.Router();
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var uuid = require('node-uuid');
//var routes = require('./routes');

app.use(cparser());
app.get('/cookie', function(req, res, err) {
	var html = 'hi';
	console.log("Cookies: ", req.cookies)
	})

lookingFirst = true;
firstSocket = null;
secondSocket = null;

io.on('connection', function(socket) {
	//firstSocket = null;
	console.log('a user connected.');
	socket.emit('onconnected');
	socket.on('disconnect', function() {
		lookingFirst = true;
		console.log('a user disconnected');
	});

	socket.on('want-to-play', function() {
		console.log('user wants to play.');
		newPlayer = function(socket) {
			if (lookingFirst) {
				lookingFirst = false;
				socket.game = new game();
				console.log(socket.game);
				firstSocket = socket;
				firstSocket.uuid = uuid.v1();
			} else {
				lookingFirst = true;
				console.log("old" + firstSocket);
				socket.game = firstSocket.game;
				socket.uuid = uuid.v1();
				secondSocket = socket;
				socket.game.start(function(state) {
					socket.emit('update', state);
					firstSocket.emit('update', state);
				});
				console.log('second' + socket.game);
				socket.emit('found', 1);
				firstSocket.emit('found', 0);
			}
		};
		newPlayer(socket);
	});

	socket.on('playing', function() {
		console.log('playing');
	});

	socket.on('new_city', function(c) {
		console.log("current uuid:" + socket.uuid);
		console.log("firstScoketID:" + firstSocket.uuid);
		if (socket.uuid == firstSocket.uuid) {
			var owner = 0;
		} else {
			var owner = 1;
		}

		console.log(socket.game.newVertex);
		console.log(socket.emit);
		var realIndex = socket.game.newVertex(c[0], c[1], c[2], 
					owner, function() {
			console.log("state being reset.");
			socket.emit('new-state', socket.game.getState());
		});
		firstSocket.emit("realize_city", [c[0], c[1], realIndex, owner]);
		secondSocket.emit("realize_city", [c[0], c[1], realIndex, owner]);

	});

	socket.on('new_road', function(road) {
		if (socket.game.newEdge(road[0], road[1])) {
			firstSocket.emit('realize_road', [road[0], road[1]]);
			secondSocket.emit('realize_road', [road[0], road[1]]);
		} else {
			console.log('client tried to make an illegal road.');
			socket.emit('new-state', socket.game.getState());
		}
	});

	socket.on('road_delete', function(array2D) {

		if (socket.game.deleteEdge(array2D[0])) {
			firstSocket.emit('realize_delete', array2D[1]);
			secondSocket.emit('realize_delete', array2D[1]);
		} else {
			console.log('client tried illegal delete.');
			socket.emit('new-state', socket.game.getState());
		}
	});

	socket.on('client_confused', function() {
		socket.emit('new-state', socket.game.getState());
	});

//	socket.on('game-event'), function() {
//		console.log('game event.');
//
//	}
});



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
app.get('/Space_Intro.wav', function(req, res, err){
	res.sendFile(__dirname + '/res/Space_Intro.wav');
});
app.get('/', function(req, res, err){
	res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
 console.log('listening on 3000');
});
