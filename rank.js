// PR(A) = (1-d) + d(PR(T1)/C(T1) + ... + PR(T(n)/C(Tn))

module.exports.rank2 = function(vertices) {
//	console.log(vertices);
	var oldVertices = vertices;
	var o = Object.freeze(oldVertices);
	console.log("frozen" ,Object.isFrozen(oldVertices));
//	console.log(oldVertices);
	var d = .85;
	for (var i = 0; i < vertices.length; i++) {
		console.log("computing vertex " + i);
		vertices[i].p1rank = (1 - d);
		vertices[i].p2rank = (1 - d);
		//console.log("mid=ster[", vertices[i]);
		for (var j = 0; j < vertices[i].inEdges.length; j++) {
			console.log("     computing vertex " +j);  
			//	console.log("oldvertices[j] ", oldVertices[j]);
		//	console.log("vertices[i].inEdges[j] ", vertices[i].inEdges[j]);
			if (!(vertices[i].inEdges[j] == -1)) {
				console.log("              calculation " , vertices[i].p1rank, " + (",d, " * " ,
							o[j].p1rank ," / ", o[j].outEdges.length);
				vertices[i].setP1Rank(vertices[i].p1rank +
							(d * oldVertices[j].p1rank / oldVertices[j].outEdges.length));
				vertices[i].setP2Rank(vertices[i].p2rank +
			   				(d * oldVertices[j].p2rank / oldVertices[j].outEdges.length));
			}
		}
	}
	console.log(vertices);
}

module.exports.rank = function(vertices) {
	//var tmpvertices = vertices;
	//var olds = Object.freeze(tmpvertices);
	var d = .85;

	var count = 0;
	for (var i = 0; i < vertices.length; i++) {
		for (var j = 0; j < vertices[i].outEdges.length; j++) {
			if (vertices[i].outEdges[j] != -1) {
				count++;
			}
		}
		vertices[i].outDegree = count;
		console.log(vertices[i].outDegree);
		count = 0;
	}
//	console.log('before                 ----------------------------------', vertices);
	var update = [[]];
	for (var i = 0; i < vertices.length; i++) {
	console.log("vertex " + i); 			//TODO
		if (vertices[i].owner == 0) {
			vertices[i].setP1Rank(1 - d);
			vertices[i].setP2Rank(.0);
		} else {
			vertices[i].setP1Rank(.0);
			vertices[i].setP2Rank(1 - d);
		}
		for (var j = 0; j < vertices[i].inEdges.length; j++) {
			if (vertices[i].inEdges[j] != -1) {
				console.log("        from vertex " + j); //TODO
				if (vertices[j].owner == 0) {
					console.log("addtoplayer0");
					vertices[i].setP1Rank(vertices[i].p1rank + 
										(d * vertices[j].oldRank / vertices[j].outDegree));
					} else {
					console.log("addtoplayer1");
					vertices[i].setP2Rank(vertices[i].p2rank + 
										(d * vertices[j].oldRank / vertices[j].outDegree));
				}
				vertices[i].nextState();
			} 
		}
		if (vertices[i].p1rank > vertices[i].p2rank) {
			vertices[i].owner = 0;
		} else {
			vertices[i].owner = 1;
		}

		update[i] = [vertices[i].totalRank, vertices[i].owner];
	}

	console.log(vertices);
	console.log(update);
}
