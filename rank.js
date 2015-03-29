// PR(A) = (1-d) + d(PR(T1)/C(T1) + ... + PR(T(n)/C(Tn))

module.exports.rank = function(vertices) {
	const oldVertices = vertices;
	var d = .85;
	for (var i = 0; i < vertices.length; i++) {
		vertices[i].p1rank = (1 - d);
		vertices[i].p2rank = (1 - d);
		for (var j = 0; j < vertices[i].inEdges.length; j++) {
			vertices[i].p1rank += (d*oldVertices[j].p1rank/oldVertices[j].outEdges.length);
			vertices[i].p1rank += (d*oldVertices[j].p2rank/oldVertices[j].outEdges.length);
		}
	}
	console.log(vertices);
}
