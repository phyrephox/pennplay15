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
					console.log(state[1]);
					if (state[1][0]) {
						firstSocket.emit('endgame', 0);
						secondSocket.emit('endgame', 0);
						console.log("WOOO 0 won!");
					} 
					if (state[1][1]) {
						firstSocket.emit('endgame', 1);
						secondSocket.emit('endgame', 1);
						console.log("WOOO 1 won!");
					}
					socket.emit('update', state[0]);
					firstSocket.emit('update', state[0]);
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
		if (socket.game.newEdge(road[0], road[1], road[2])) {
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
app.get('/about', function(req, res, err) {
	res.sendFile(__dirname + '/about.html');
});

app.get('/city1.png', function(req, res, err) {
    res.sendFile(__dirname + '/res/city1.png');
});
app.get('/road.png', function(req, res, err) {
    res.sendFile(__dirname + '/res/road.png');
});
app.get('/mars.jpg', function(req, res, err) {
    res.sendFile(__dirname + '/res/mars.jpg');
});
app.get('/logo.png', function(req, res, err) {
	res.sendFile(__dirname + '/res/logo.png');
});
app.get('/symphonia.jpg', function(req, res, err) {
	res.sendFile(__dirname + '/res/symphonia.jpg');
});
app.get('/master.css', function (req, res, err) {
	console.log('master requested.');
	res.sendFile(__dirname + '/res/master.css');
});
app.get('/', function(req, res, err){
	res.sendFile(__dirname + '/index.html');
});
http.listen(3000, function(){
 console.log('listening on 3000');
});
