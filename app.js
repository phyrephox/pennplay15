var graph = require('./graph');
var g = new graph();
console.log(graph);
console.log(g.addVertex(1,2));
console.log(g.addVertex(1,3));
console.log(g.addEdge(0, 1, 10));
//console.log(g.getVertices());
console.log(g.getVertices()[0].getOutEdges());
