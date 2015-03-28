function vertex(x, y) {
	this.inEdges = new Array(50);
	for (var i = 0; i < this.inEdges.length; i++) {
		this.inEdges[i] = -1;
	}
	this.outEdges = new Array(50);
	for (var i = 0; i < this.outEdges.length; i++) {
		this.outEdges[i] = -1;
	}
	this.p1rank;
	this.p2rank;
	this.x = x;
	this.y = y;
	this.owner;


	//returns true if this vertex has an edge to v. False otherwise.
	this.hasOutEdge = function(v) {
		return this.outEdges[v] != -1
	}
	//returns true if there is an edge to this vertex from v. False otherwise.
	this.hasInEdge = function(v) {
		return this.inEdges[v] != -1;
	}
	//returns true if there is an edge to this edge from v or from this edge to v.
	//false otherwise.
	this.hasEdge = function(v) {
		return this.hasOutEdge(v) || this.hasInEdge(v);
	}


	this.addInEdge = function(v, weight) {
		if (v >= this.inEdges.length) {
			for (var i = this.inEdges.length; i < v; i++) {
				inEdges[i] = -1;
			}
		}
		this.inEdges[v] = weight;
	}

	this.addOutEdge = function(v, weight) {
		if (v >= this.outEdges.length) {
			for (var i = this.outEdges.length; i < v; i++) {
				outEdges[i] = -1;
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
