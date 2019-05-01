// Finley McIlwaine
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

// PROBLEM 1 IMPLEMENTATION
// Dynamic Held-Karp using memoization

/**
 * Returns the shortest found path from start node to visit all other
 * nodes in graph g.
 * @param {*} g     Cost matrix
 * @param {*} start Start node
 */
function dynamicHeldKarp(g, start) {
  let set;
  let sets;
  let costs = [];
  let setNum = 0;

  // Generate subsets of vertices to travel 'via'.
  // 'Via' sets range from empty set to sets of size
  // n-2 since we do not include starting and ending nodes.
  let setOfVerts = new Array(g.length);
  for (let i = 0; i < setOfVerts.length; i++) {
    setOfVerts[i] = i;
  }
  setOfVerts.splice(start, 1);
  sets = getPowerset(setOfVerts);

  // i tracks 'via' set length.
  let i = 0;

  // costs is the data structure that I use to memoize sub-problem results.
  // costs[i][j][k][0-1] holds the results for travelling to the kth
  // destination though the jth 'via' set of length i. The 0th element
  // of this result is the cost of the route and the 1st element is the
  // node that we travelled through before arriving at j. 
  costs[i] = [];

  // Loop over 'via' sets, starting at empty set, ordered in increasing
  // set size.
  while (true) {
    set = new Set(sets[i]);

    // Initialize the results array for this 'via' setNum.
    costs[set.size][setNum] = [];

    // Loop over valid destinations for this 'via' set and get costs.
    for (let j = 0; j < g.length; j++) {
      if (set.has(j) || j == start)
        continue;
      costs[set.size][setNum][j] = [...getMinEdge(g, costs, set, start, j), set];
    }

    // If we have tested all the 'via' sets, break
    if (++i == sets.length - 1) {
      break;
    }
    // If we have testing all the 'via' sets of length i-1,
    // reset setNum and initialize the costs array for
    // sets of next length.
    else if (sets[i].length != set.size) {
      setNum = 0;
      costs[sets[i].length] = [];
    }
    // Otherwise, increment setNum
    else {
      setNum++;
    }
  }

  // The solution is found. Build the path and return the path and cost.
  return constructPath(costs, start);
}

/**
 * Returns the parent node and the resulting minimum cost for travelling
 * from start node i via the given set to the destination node j.
 * @param {*} g     Cost matrix
 * @param {*} costs Subproblem results
 * @param {*} set   Via set to consider considering
 * @param {*} i     Start node
 * @param {*} j     Destination node
 */
function getMinEdge(g, costs, set, i, j) {
  // If via set is empty, just return cost of edges leaving start node.
  if (set.size == 0)
    return [g[i][j], i];
  let minCost = Infinity;
  let minPar;
  let testCost;
  // For each set that is set size - 1
  for (let i = 0; i < costs[set.size - 1].length; i++) {
    // Loop over sub-problem results
    costs[set.size - 1][i].forEach((cost, toVert) => {
      // Make sure the subproblem is valid for current problem:
      //     - Our current 'via' set contains the target node of subproblem.
      //     - The subproblem 'via' set is a subset of current set.
      if (set.has(toVert) && isSubset(cost[2], set)) {
        testCost = cost[0] + g[toVert][j];
        if (testCost < minCost) {
          minCost = testCost;
          minPar = toVert;
        }
      }
    });
  }
  return [minCost, minPar];
}

/**
 * Constructs the minimum path found by Held-Karp algorithm
 * based on the memoized results.
 * @param {*} costs Subproblem results
 * @param {*} start Start node
 */
function constructPath(costs, start) {
  let minPathCost = Infinity;
  let pathSet;
  let current;
  let parent;
  let path = [];

  // Loop over 'via' set sizes, beginning with longest.
  for (let i = costs.length - 1; i >= 0; i--) {
    // Loop over 'via' sets of length i.
    for (let j = 0; j < costs[i].length; j++) {
      // Loop over destination nodes of ith via set.
      for (let k = 0; k < costs[i][j].length; k++) {

        if (costs[i][j][k] != undefined) {
          // If considering longest 'via' sets,
          // set appropriate minimum variables.
          if (i == costs.length - 1) {
            if (costs[i][j][k][0] < minPathCost) {
              minPathCost = costs[i][j][k][0];
              pathSet = costs[i][j][k][2];
              parent = costs[i][j][k][1];
              current = k;
            }
          }

          // If the pathSet and subproblem sets are not equal, do not cosider the
          // subproblem result.
          else if (pathSet != undefined && !setsAreEqual(pathSet, costs[i][j][k][2])) {
            break;
          }

          // If the subproblem result has the parent node as destination and pathSet is
          // equal to subproblem set, update path accordingly.
          else if (k == parent) {
            parent = costs[i][j][k][1];
            current = k;
          }
        }
      }
    }
    // Add the current node to the beginning of our path array
    // and delete the parent from the pathSet
    path.unshift(current);
    pathSet.delete(parent);
  }

  // Unshift start node and return minimum path and cost.
  path.unshift(start);
  return [path, minPathCost];
}

/**
 * Returns true if sub is subset of set.
 * @param {*} sub Potential subset
 * @param {*} set Potential superset
 */
function isSubset(sub, set) {
  for (let elem of sub) {
    if (!set.has(elem))
      return false;
  }
  return true;
}
/**
 * Returns true if set a is equal to set b.
 * @param {*} sa Set A
 * @param {*} sb Set B
 */
function setsAreEqual(sa, sb) {
  if (sa.size !== sb.size)
    return false;
  for (let a of sa) {
    if (!sb.has(a))
      return false;
  }
  return true;
}
/**
 * Returns an array of the powerset of a set of elements
 * contained in arr.
 * @param {*} arr Set of elements
 */
function getPowerset(arr) {
  let result = [[]], temp, length;
  arr.forEach(elem => {
    length = result.length;
    for (let i = 0; i < length; i++) {
      temp = result[i].slice(0);
      temp.push(elem);
      result.push(temp);
    }
  });
  // Sort resulting powerset in order of increasing length.
  result.sort((a, b) => {
    return a.length - b.length;
  });
  return result;
}

exports.dynamicHeldKarp = dynamicHeldKarp;
