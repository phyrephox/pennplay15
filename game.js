var graph = require('./graph');

function game() {
	var g = new graph();
	var time = new Date().getTime();
	var newVertices = [];
	var newEdges = [];
	var that = this;
	var callback;
	var powerCounterNode0 = 0;
	var powerCounterEdge0 = 0;
	var power0 = 50;
	var powerCounterNode1 = 0;
	var powerCounterEdge1 = 0;
	var power1 = 50;
	var NODE_COST = 10;
	var EDGE_COST = 5;
	var costTime = new Date().getTime();

	this.start = function(cb) {
		console.log('game starting loop');
		//		this.gameloop();

		callback = cb;
		g.addVertex(500, 320, 0);
		g.addVertex(1500, 320, 1);
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

			var power = that.updatePower();
			var rank = that.getUpdate();
			callback([power, rank]);
			time = now;
		}
	}
	this.getUpdate = function() {
		//UPDATE POWER
		return g.updateNodes();	
	}

	this.updatePower = function() {
		var currentTime = new Date().getTime();
		var timeBonus = 0;
		if (currentTime - costTime > 200) {
			timeBonus = 1;
			costTime = currentTime;
		} 
		power0 = power0 - powerCounterNode0 - powerCounterEdge0  + timeBonus;
		power1 = power1 - powerCounterNode1 - powerCounterEdge1 + timeBonus;

		console.log("power0 ", power0, "power1 ", power1);
		console.log("pcN0 ", powerCounterNode0);

		if (power0 > 100) {
			power0 = 100;
		}
		if (power1 > 100) {
			power1 = 100;
		}
		powerCounterNode0 = 0;
		powerCounterNode1 = 0;
		powerCounterEdge0 = 0;
		powerCounterEdge1 = 0;
		return [power0, power1];
	}

	//gets the entire state of the graph.
	this.getState = function() {
		return g.getVertices();
	}

	//adds a new vertex to G. Returns the index of the vertex added.
	this.newVertex = function(x, y, index, owner, reset) {
		if (owner == 0) {
			powerCounterNode0 = powerCounterNode0 +  NODE_COST;
		}
		if (owner == 1) {
			console.log("COSTIN YOU MONEY");
			powerCounterNode1 = powerCounterNode1 +  NODE_COST;
		}

		realIndex = g.addVertex(x, y, owner);
		console.log("real=", realIndex, " fake=", index); 
		console.log(g.getVertices());
		if (index != realIndex) {
			reset(); //calls function in server to send reset state to client.
		}
		return realIndex;
	}

	//adds edge to G. 
	this.newEdge = function(u, v, weight, owner) {
		if (g.addEdge(u, v, weight)) {
			if (owner == 0) {
				powerCounterEdge0 += EDGE_COST;
			} 
			if (owner == 1) {
				powerCounterEdge1 += EDGE_COST;
			}
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
