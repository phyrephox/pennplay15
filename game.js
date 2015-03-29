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
		g.addVertex(250, 320, 0);
		g.addVertex(750, 320, 1);
		console.log(callback);
		setInterval(this.gameloop,50);
	}
	
	this.gameloop = function() {
		var now = new Date().getTime();
		if (now - time > 66) {
			for (var i = 0; i < newVertices.length; i++) {
				g.addVertex(newVertices[i].x, newVertices[i].y);
			}
			for (var i = 0; i < newEdges.length; i++) {
				g.addEdge(newEdges[i].u, 
							newEdges[i].v, newEdges[i].weight);
			}

			callback(that.getUpdate());
			time = now;
		}
	}
	this.getUpdate = function() {
		return g.updateNodes();	
	}

	//gets the entire state of the graph.
	this.getState = function() {
		return g.getVertices();
	}

	//adds a new vertex to G. Returns the index of the vertex added.
	this.newVertex = function(x, y, index, owner, reset) {
		realIndex = g.addVertex(x, y, owner);
		console.log("real=", realIndex, " fake=", index); 
		console.log(g.getVertices());
		if (index != realIndex) {
			reset(); //calls function in server to send reset state to client.
		}
		return realIndex;
	}

	//adds edge to G. 
	this.newEdge = function(u, v, weight) {
		if (g.addEdge(u, v, weight)) {
			console.log("new edge!");
			return true;
		}
		return false;
	}

	//deletes edge from G. returns true if there was an edge
	//between u and v. False otherwise.
	this.deleteEdge = function(arrayUV) {
		var OK = true;
		for (var i = 0; i < arrayUV.length; i++) {
			if (!g.deleteEdge(arrayUV[i][0], arrayUV[i][1])) {
				OK = false;
			}
		}
		if (!OK) {
			console.log("not ok in edge deletion (game)");
			return false;
		}
		return true;
	}
}
module.exports = game;
