var graph = require('./graph');
var io = require('socket.io');
var app = require('express');
var cparser = require('cookie-parser');
app.get('/', function(req, res, err) {
	res.sendFile(__dirname + '/index.html');
});
