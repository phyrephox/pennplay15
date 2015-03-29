// PR(A) = (1-d) + d(PR(T1)/C(T1) + ... + PR(T(n)/C(Tn))
module.exports.rank = function(vertices) {
	var d = .85;
	var count = 0;
	for (var i = 0; i < vertices.length; i++) {
		for (var j = 0; j < vertices[i].outEdges.length; j++) {
			if (vertices[i].outEdges[j] != -1) {
				count++;
			}
		}
		vertices[i].outDegree = count;
		count = 0;
	}
	var update = [[]];
	for (var i = 0; i < vertices.length; i++) {
		if (vertices[i].owner == 0) {
			vertices[i].setP1Rank(1 - d);
			vertices[i].setP2Rank(.0);
		} else {
			vertices[i].setP1Rank(.0);
			vertices[i].setP2Rank(1 - d);
		}
		for (var j = 0; j < vertices[i].inEdges.length; j++) {
			if (vertices[i].inEdges[j] != -1) {
				if (vertices[j].owner == 0) {
					vertices[i].setP1Rank(vertices[i].p1rank + 
										(d * vertices[j].oldRank / vertices[j].outDegree));
					} else {
					vertices[i].setP2Rank(vertices[i].p2rank + 
										(d * vertices[j].oldRank / vertices[j].outDegree));
				}
			} 
		}
		if (vertices[i].p1rank > vertices[i].p2rank) {
			vertices[i].owner = 0;
		} else {
			vertices[i].owner = 1;
		}	
		update[i] = [ vertices[i].p1rank, vertices[i].p2rank, vertices[i].totalRank, vertices[i].owner];
	}
	for (var i = 0; i < vertices.length; i++) {
		vertices[i].nextState();
	}
	console.log('  ');
	console.log(' ');
	console.log(update);
	return update;
}
