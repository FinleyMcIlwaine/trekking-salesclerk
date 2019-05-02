// Finley McIlwaine
// W#: 08133841
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

const { printGraph,
        generateRandomGraph,
        printResult
      }                   = require("./helpers");
const { twoOpt }          = require("./p2");
const { dynamicHeldKarp } = require('./p1');
const { bruteForceTSP }   = require("./bruteForceTSP");

/**
 * Outputs test results of each algorithm (brute-force permutations, dynamic Held-Karp,
 * and 2-opt) to the command line for comparison. Also gives the average percent
 * incorrect-ness of the 2-opt algorithm after all tests.
 * @param {*} numTests Number of tests to run
 * @param {*} maxSize  Max size of graphs to test
 * @param {*} minSize  Min size of graphs to test
 * @param {*} maxEdgeC Max edge weight of graphs to test
 * @param {*} minEdgeC Min edge weight of graphs to test
 */
function compareResults(numTests,maxSize,minSize,maxEdgeC,minEdgeC) {
  let sizes = new Array(numTests),
      start,
      results,
      twoOptResultDiffs = [],
      twoOptDiffSum = 0,
      g;
  for (let i = 0; i < sizes.length; i++) {
    sizes[i] = ~~(Math.random()*(maxSize-minSize)) + minSize;
  }

  sizes.forEach(size=>{
    g = generateRandomGraph(size,maxEdgeC,minEdgeC);
    start = ~~(Math.random()*(g.length-1));
    console.log("\nTesting graph:");
    printGraph(g);

    results = [bruteForceTSP(g,start),dynamicHeldKarp(g,start),twoOpt(g,start)];

    console.log("\nBrute-force result:");
    printResult(results[0]);
    console.log("\nHeld-Karp result:");
    printResult(results[1]);
    console.log("\n2-opt result:");
    printResult(results[2]);
    twoOptResultDiffs.push((results[2][1] - results[0][1])/results[2][1] * 100);
    console.log("");
  })

  twoOptResultDiffs.forEach(diff=>{
    twoOptDiffSum += diff;
  })

  console.log("\nIn " + numTests + " tests, the 2-opt algorithm minimum cost result was an\naverage of " + 
              (Math.round(twoOptDiffSum/numTests*100) / 100) +
              "% above the global minimum cost.\n");

}

// Sizes above 11 take very long time for brute force method on
// my microsoft surface pro 4
const NUM_TESTS     = 10
      MAX_SIZE      = 9,
      MIN_SIZE      = 9,
      MAX_EDGE_COST = 9,
      MIN_EDGE_COST = 2;

compareResults(NUM_TESTS,MAX_SIZE,MIN_SIZE,MAX_EDGE_COST,MIN_EDGE_COST);