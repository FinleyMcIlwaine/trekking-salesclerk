/**
 * Returns the total cost of path over graph g.
 * @param {*} g    Cost matrix
 * @param {*} path Path array
 */
function getCost(g, path) {
  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    cost += g[path[i]][path[i + 1]];
  }
  return cost;
}

/**
 * Prints a graph in the form of a cost matrix to the
 * out stream.
 * @param {*} g Cost matrix
 */
function printGraph(g) {
  g.forEach((row,ind)=>{
    if (ind < 10) {
      console.log("Node " + ind + "  | " + row.join(" , ") + " |");
    }
    else {
      console.log("Node " + ind + " | " + row.join(" , ") + " |");
    }
  })
}

/**
 * Generates and returns a random path through graph g starting at start.
 * @param {*} g     Cost matrix
 * @param {*} start Start node (number)
 */
function generateRandomPath(g,start) {
  let path = [start], next = start;
  while (path.length != g.length) {
    while (next == start || path.includes(next)) {
      next = ~~(Math.random()*g.length);
    }
    path.push(next);
  }
  return path;
}

/**
 * Generates and returns a random cost matrix of given size,
 * containing weights between the max and min input weights.
 * @param {*} size       Size of desired graph
 * @param {*} maxWeight  Max potential weight of edges in graph
 * @param {*} minWeight  Min potential weight of edges in graph
 */
function generateRandomGraph(size, maxWeight, minWeight) {
  let g = new Array(size);
  for (let i = 0; i < size; i++) {
    g[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      g[i][j] = ~~(Math.random()*(maxWeight-minWeight)) + minWeight;
    }
    g[i][i] = 0;
  }
  return g;
}

// I wrote this greedy path helper for some experiments with the
// initial path used in my 2-opt implementation. I ended up using a random
// initial path to give the algorithm a chance to converge at different
// local minimums in different iterations of the outer control loop.
/**
 * Generates and returns the greedy path through graph g from start node.
 * @param {*} g     Cost matrix
 * @param {*} start Start node (number)
 */
function generateGreedyPath(g, start) {
  let path = [start], cur = start, min = Infinity, minInd;
  while (path.length != g.length) {
    for (let i = 0; i < g.length; i++) {
      if (!path.includes(i) && g[path[path.length - 1]][i] < min && g[path[path.length - 1]][i] != 0) {
        min = g[path[path.length - 1]][i];
        minInd = i;
      }
    }
    path.push(minInd);
    min = Infinity;
  }
  return path;
}

/**
 * Prints a path and the resulting cost to the command line
 * @param {*} result Array holding path and cost
 */
function printResult(result) {
  console.log("     Min. path: " + ((result[0].length < 20) ? result[0].join(' -> ') : "Too long to print!"));
  console.log("     Min. cost: " + result[1]);
}

module.exports = {
  getCost: getCost,
  printGraph: printGraph,
  generateRandomGraph: generateRandomGraph,
  generateRandomPath: generateRandomPath,
  generateGreedyPath: generateGreedyPath,
  printResult: printResult
}
