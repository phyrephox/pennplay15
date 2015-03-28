var graph = require('./graph');
var io = require('socket.io');
var express = require('expres');

app.get('/', function(req, res, err) {
	res.sendFile(__dirname + '/index.html');
});
