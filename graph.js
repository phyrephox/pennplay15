var vertex = require('./vertex');

function graph() {

	//defines edges in the graph.
	this.edge = function(u, v, weight) {
		this.v;
		this.u;
		this.weight;
		this.equals = function(o) {
			if (o == null) {
				return false;
			}
			if (this.v = o.v) {
				if (this.u = o.u) {
					return true;
				}
			}
			return false;
		}
	}

	this.vertices = [];

	//adds edge between two nodes in graph. 
	//returns true if there had been no edge between u and v
	//		false otherwise.
	//throws exception if u or v is not in graph
	this.addEdge = function(u, v, weight) {
		if (weight < 0) {
			throw "NO NEGATIVE EDGE WEIGHTS PLEASE";
		}
		if (u > this.vertices.length - 1 || u < 0) {
			throw "THERE AINT NO VERTEX AT U";
		}
		if (v > this.vertices.length - 1 || v < 0) {
			throw "THERE AINT NO VERTEX AT V";
		}
		if (this.hasEdge(u,v)) {
			console.log("EDGE ALREADY EXISTS. AW DANG.");
			return false;
		}
		if (u == v) {
			console.log("AINT NO SELF LOOPS IN MY HOUSE.");
			return false;
		}
		this.vertices[u].addOutEdge(v, weight);
		this.vertices[v].addInEdge(u, weight);
		return true;
	}

	this.nodeExists = function(u) {
		if (u < 0 || u > this.vertices.length - 1) {
			console.log("current number of vertices: " + this.vertices.length);
			return false;
		}
		return true;
	}

	//returns true if there is an edge from node u to v.
	//		false otherwise.
	//
	this.hasEdge = function(u, v) {
		if (!this.nodeExists(u)) {
			console.log("hasEdge -- no vertex at " + u);
			return false;
		}
		if (!this.nodeExists(v)) {
			console.log("hasEdge -- no vertex at " + v);
			return false;
		}
		return this.vertices[u].hasOutEdge(v);
	}

	//adds a node to the graph.
	//returns the index of the node (used to identify the vertex.)
	this.addVertex = function(x, y) {
		this.vertices[this.vertices.length] = new vertex(x, y);
		return this.vertices.length - 1;
	}

	//returns JSON representation of each node's current rank.
	this.getVertices = function() {
		return this.vertices;
	}
	
	//calls rankUpdate to update rank. YESH.
	this.updateNodes = function() {
		//TODO	
	}

	//returns number of nodes.
	this.getSize = function() { 
		return this.vertices.length;
	}
}

module.exports = graph;
