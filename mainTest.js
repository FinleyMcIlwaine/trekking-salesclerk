// Finley McIlwaine
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

const { printGraph,
  generateRandomGraph,
  printResult,
  printRunTime
}                         = require("./helpers");
const { twoOpt }          = require("./p2");
const { dynamicHeldKarp } = require('./p1');

/**
 * Tests and times the dynamic Held-Karp and 2-Opt algorithms
 * against the same graphs. Then, when the maxHK size is reached,
 * continues only testing/timing the 2-Opt. Outputs the graphs and
 * paths found until too large, also outputs the cost of the paths
 * found.
 * @param {*} minSize The mnimum size of graph to test
 * @param {*} maxHK   The maximum size of graph to test
 *                    against the Held-Karp algorithm
 * @param {*} maxTO   The maximum size of graph to test
 *                    against the 2-opt algorithm
 */
function mainTest(minSize,maxHK,maxTO) {
  let g, start,
      t1HK, t2HK, deltaHK,
      t1TO, t2TO, deltaTO,
      pathHK, costHK,
      pathTO, costTO,
      timesHK = new Object(),
      timesTO = new Object();

  for (let size = minSize; size <= maxTO;
   size = (size >= maxHK) ?
   ((size + 100 > maxTO) ? maxTO: size + 100) : 
   size + 1) {

    g = generateRandomGraph(size,9,1);
    start = ~~(Math.random()*(g.length-1));
    if (size < 18) {
      console.log("\nTesting graph: \n")
      printGraph(g);
      console.log("\nWith size " + g.length + " from start node " + start + "...\n");
    }
    else {
      console.log("\nTesting graph of size " + size + "...\n");
    }
      
    if (size <= maxHK) {
      t1HK = Date.now();
      [pathHK,costHK] = dynamicHeldKarp(g,start);
      t2HK = Date.now();
      deltaHK = t2HK - t1HK;
      if (timesHK.hasOwnProperty(size)) {
        timesHK[size].push(deltaHK);
      }
       else {
        timesHK[size] = [deltaHK];
      }
      console.log("Held-Karp solution:");
      printResult([pathHK,costHK]);
      printRunTime(deltaHK);
    }

    t1TO = Date.now();
    [pathTO,costTO] = twoOpt(g,start);
    t2TO = Date.now();
    deltaTO = t2TO - t1TO;
    if (timesTO.hasOwnProperty(size)) {
      timesTO[size].push(deltaTO);
    }
    else {
      timesTO[size] = [deltaTO];
    }
    console.log("2-opt solution:");
    printResult([pathTO,costTO]);
    printRunTime(deltaTO);

    if (size == maxTO) break;
  }
}

const MIN_SIZE  = 3;
const MAX_HK    = 18;
const MAX_TO    = 600;

mainTest(MIN_SIZE, MAX_HK, MAX_TO);
