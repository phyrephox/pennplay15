var graph = require('./graph');
var g = new graph();
console.log(graph);
console.log(g.addVertex(1,2));
console.log(g.addVertex(1,3));
console.log(g.addVertex(2,3));
console.log(g.addVertex(4,5));
console.log(g.addEdge(0, 1, 10));
console.log(g.addEdge(0, 2, 10));
console.log(g.addEdge(1, 2, 10));
console.log(g.addEdge(3, 0, 10));
//console.log(g.getVertices());
console.log(g.getVertices()[0]);
console.log(g.getVertices()[1].getOutEdges());
console.log(g.getVertices()[2].getOutEdges());
console.log(g.getVertices()[3].getOutEdges());

