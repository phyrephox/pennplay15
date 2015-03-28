var graph = require('./graph');

function game() {
	var g = new graph();
	var time = new Date().getTime();
	var newVertices = [];
	var newEdges = [];
	var that = this;
	var callback;
	this.start = function(cb) {
		console.log('game starting loop');
		//		this.gameloop();

		callback = cb;
		g.addVertex(0, 0);
		g.addVertex(0, 1);
		g.addEdge(0, 1, 10);
		console.log(callback);
		setInterval(this.gameloop,50);
	}
	
	this.gameloop = function() {
		var now = new Date().getTime();
		console.log("now" + now);
		console.log("time" + time);
		if (now - time > 66) {
			console.log(now - time);
			for (var i = 0; i < newVertices.length; i++) {
				g.addVertex(newVertices[i].x, newVertices[i].y);
			}
			for (var i = 0; i < newEdges.length; i++) {
				g.addEdge(newEdges[i].u, 
							newEdges[i].v, newEdges[i].weight);
			}

			g.updateNodes();
			callback(getState());
			time = now;
		}
	}

	var getState = function() {
		return g.getVertices();
	}

	var newVertex = function(x, y, index, reset) {
		realIndex = g.addVertex(x,y);
		if (index != realIndex) {
			reset(); //calls function in server to send reset state to client.
		}
	}

	var newEdge = function(u, v, weight) {
		g.addEdge(u, v, weight);
	}

}
module.exports = game;
