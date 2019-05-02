// Finley McIlwaine
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

const { printGraph,
  generateRandomGraph,
  printResult,
  generateRandomPath
}                         = require("./helpers");
const { twoOpt }          = require("./p2");
const { dynamicHeldKarp } = require('./p1');
const { bruteForceTSP }   = require("./bruteForceTSP");

function mainTest(numIters,minSize,maxHK,maxTO) {
  let g, start,
      t1HK, t2HK, deltaHK,
      t1TO, t2TO, deltaTO,
      pathHK, costHK,
      pathTO, costTO,
      averagesHK = new Object(), timesHK = new Object(),
      averagesTO = new Object(), timesTO = new Object();
  for (let iter = 0; iter < numIters; iter++) {
    for (let size = minSize; size <= maxTO; size++) {
      g = generateRandomGraph(size,9,1);
      start = ~~(Math.random()*(g.length-1));

      console.log("Testing graph: \n")
      printGraph(g);
      console.log("\nWith size " + g.length + " from start node " + start + "...\n");

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
    }
  }
}

function printRunTime(delta) {
  if (delta < 1000) {
    console.log("     Computed in " + delta + " milliseconds! (" + (Math.round(delta/1000 * 100)/100) + " seconds)\n");
  }
  else if (delta < 60000) {
    console.log("     Computed in " + (Math.round(delta/1000*100)/100) + "seconds!\n");
  }
  else {
    console.log("     Computed in " + (Math.round(delta/60000 * 100)/100) + "minutes! (" + (Math.round(delta/1000*100)/100) + " seconds)\n");
  }
}

const NUM_ITERS = 3;
const MIN_SIZE  = 3;
const MAX_HK    = 8;
const MAX_TO    = 20;

mainTest(NUM_ITERS, MIN_SIZE, MAX_HK, MAX_TO);