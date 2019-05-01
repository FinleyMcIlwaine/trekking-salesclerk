// Finley McIlwaine
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

// PROBLEM 2 IMPLEMENTATION
// 2-opt local search algorithm for finding TSP solutions.

const { getCost, 
        generateGreedyPath, // Included for experiments with initial path.
        generateRandomPath
      } = require("./helpers");

/**
 * Returns the shortest found path from start node to visit all other
 * nodes in graph g.
 * @param {*} g     Cost matrix
 * @param {*} start Start node
 */
function twoOpt(g, start) {
      // bestPath/Cost store cheapest found path/cost.
  let bestPath, bestCost = Infinity,
      curPath, curCost,
      // newPath/Cost vars store path and cost post-swap
      newPath, newCost,
      // improved is true after an iteration if better path found, false otherwise.
      improved = true;
      // Prev variables store previous swap bounds so we don't undo previous swaps.
      iPrev = -1, kPrev = -1;


  for (let x = 0; x < g.length; x++) {
    curPath = generateRandomPath(g, start);
    curCost = getCost(g, curPath);
    iPrev = -1;
    kPrev = -1;
    improved = true;

    // STOPPING CRITERION: Stop when no improvement is made after all swaps of an iteration.
    while (improved) {
      improved = false;
      // Loop over lower bounds to swapping range.
      for (let i = 1; i < curPath.length - 1; i++) {
        // Loop over upper bounds to swapping range
        for (let k = i + 1; k < curPath.length; k++) {
          // If range was last to be swapped, get new bounds.
          if (i == iPrev && k == kPrev)
            continue;
          
          // Get new path and cost after swapping
          newPath = twoOptSwap([...curPath], i, k);
          iPrev = i;
          kPrev = k;
          newCost = getCost(g, newPath);

          // If newCost is better, update curPath/Cost
          if (newCost < curCost) {
            curPath = [...newPath];
            curCost = newCost;
            improved = true;
          }
        }
      }
    }
    // If a better path was found during that iteration, update our
    // best path/cost.
    if (curCost < bestCost) [bestPath,bestCost] = [[...curPath],curCost];
  }
  return [bestPath, bestCost];
}

/**
 * Returns input path but with section of elements [i,k]
 * reversed.
 * @param {*} path Path to swap
 * @param {*} i    Inclusive lower bound of section to reverse.
 * @param {*} k    Inclusive upper bound of section to reverse.
 */
function twoOptSwap(path, i, k) {
  while (k > i) {
    [path[i], path[k]] = [path[k], path[i]];
    i++;
    k--;
  }
  return path;
}

module.exports = {
  twoOpt: twoOpt
}
