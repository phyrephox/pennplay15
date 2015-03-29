function vertex(x, y, owner) {
	this.inEdges = [];
	this.outEdges = [];


	this.p1rank;
	this.p2rank;
	if (owner == 0) {
		this.p1rank = 1.0;
		this.p2rank = .0;
	} else if (owner == 1) {
		this.p1rank = .0;
		this.p2rank = 1.0;
	}

	//this.p1rank = 0;
	//this.p2rank = 0;
	this.totalRank = 1.0;
	this.oldRank = 1.0;
	this.x = x;
	this.y = y;
	this.owner = owner;
	this.outDegree;

	this.nextState = function() {
		this.oldRank = this.totalRank;
		console.log('old rank : ' + this.oldRank);
	}

	this.setP1Rank = function(val) {
		this.p1rank = val;
		this.totalRank = this.p1rank + this.p2rank;
	}

	this.setP2Rank = function(val) {
		this.p2rank = val;
		this.totalRank = this.p1rank + this.p2rank;
	}

	//returns true if this vertex has an edge to v. False otherwise.
	this.hasOutEdge = function(v) {
		if (v > this.outEdges.length - 1) {
			return false;
		}
		return this.outEdges[v] != -1
	}
	//returns true if there is an edge to this vertex from v. False otherwise.
	this.hasInEdge = function(v) {
		if (v > this.outEdges.length - 1) {
			return false;
		}
		return this.inEdges[v] != -1;
	}
	//returns true if there is an edge to this edge from v or from this edge to v.
	//false otherwise.
	this.hasEdge = function(v) {
		return this.hasOutEdge(v) || this.hasInEdge(v);
}

	//Adds an edge to inEdges -- denotes an edge from another vertex to this one.
	this.addInEdge = function(v, weight) {
		if (v >= this.inEdges.length) {
			for (var i = this.inEdges.length; i < v; i++) {
				this.inEdges[i] = -1;
			}
		}
		this.inEdges[v] = weight;
	}

	//Adds an edge to outEdges -- denotes an edge from this vertex to another.
	this.addOutEdge = function(v, weight) {
		if (v >= this.outEdges.length) {
			for (var i = this.outEdges.length; i < v; i++) {
				this.outEdges[i] = -1;
			}
		}
		this.outEdges[v] = weight;
	}

	this.getInEdges = function() {
		return this.inEdges;
	}

	this.getOutEdges = function() {
		return this.outEdges;
	}
}
module.exports = vertex;
