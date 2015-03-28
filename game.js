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
		g.addVertex(250, 320);
		g.addVertex(750, 320);
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
			callback(that.getState());
			time = now;
		}
	}
	this.getUpdate = function() {
		//TODO
		console.log("NUTIN HET");
	}

	this.getState = function() {
		return g.getVertices();
	}

	this.newVertex = function(x, y, index, owner, reset) {
		realIndex = g.addVertex(x, y, owner);
		console.log("real=", realIndex, " fake=", index); 
		console.log(g.getVertices());
		if (index != realIndex) {
			reset(); //calls function in server to send reset state to client.
		}
	}

	this.newEdge = function(u, v, weight) {
		console.log("new edge!");
		g.addEdge(u, v, weight);
	}

}
module.exports = game;
