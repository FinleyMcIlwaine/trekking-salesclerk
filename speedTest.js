// Finley McIlwaine
// COSC3020 Professor Kotthoff
// Assignment 3, Problem 1
// 4/23/2019

function dynamicHeldKarp(g, start) {
  let set;
  let sets;
  let costs = [];
  let setNum = 0;

  let setOfVerts = new Array(g.length);
  for (let i = 0; i < setOfVerts.length; i++) {
    setOfVerts[i] = i;
  }
  setOfVerts.splice(start,1);
  sets = getPowerset(setOfVerts);

  // i tracks 'via' set length
  let i = 0;
  costs[i] = [];
  while(true) {
    set = new Set(sets[i]);

    costs[set.size][setNum] = [];

    for(let j = 0; j < g.length; j++) {
      if (set.has(j) || j == start) continue;
      costs[set.size][setNum][j] = [...getMinEdge(g,costs,set,start,j),set];
    }

    if (++i == sets.length - 1) {
      break;
    }
    else if (sets[i].length != set.size) {
      setNum = 0;
      costs[sets[i].length] = []
    }
    else {
      setNum++;
    }
  }

  return constructPath(costs,start);
}

function getMinEdge(g,costs,set,i,j) {
  if (set.size == 0) return [g[i][j], i];
  let minCost = Infinity;
  let minPar;
  let testCost;
  // For each set that is set size length - 1
  for (let i = 0; i < costs[set.size-1].length; i++) {
    costs[set.size-1][i].forEach((cost,toVert)=>{
      if (!cost[2].has(j) && toVert != j && set.has(toVert) && isSubset(cost[2],set)) {
        testCost  = cost[0] + g[toVert][j];
        if (testCost < minCost) {
          minCost = testCost;
          minPar  = toVert;
        }
      }
    })
  }
  return [minCost, minPar];
}

function constructPath(costs,start) {
  let minPathCost = Infinity;
  let pathSet;
  let current;
  let parent;
  let path = [];

  for (let i = costs.length - 1; i >= 0; i--) {
    for (let j = 0; j < costs[i].length; j++) {
      for (let k = 0; k < costs[i][j].length; k++) {
        if (costs[i][j][k] != undefined) {
          if (i == costs.length - 1) {
            if (costs[i][j][k][0] < minPathCost) {
              minPathCost = costs[i][j][k][0];
              pathSet     = costs[i][j][k][2];
              parent      = costs[i][j][k][1];
              current     = k;
            }
          }
          else if (pathSet != undefined && !setsAreEqual(pathSet,costs[i][j][k][2])) {
            break;
          }
          else if (k == parent) {
            parent  = costs[i][j][k][1];
            current = k;
          }
        }
      }
    }
    path.unshift(current);
    pathSet.delete(parent);
  }
  path.unshift(start);
  return [path,minPathCost];
}

function isSubset(sub,set) {
  for (let elem of sub) {
    if (!set.has(elem)) return false;
  }
  return true;
}

function setsAreEqual(sa,sb) {
  if (sa.size !== sb.size) return false;
  for (let a of sa) {
    if (!sb.has(a)) return false;
  }
  return true;
}

function getPowerset(arr) {
  let result = [[]],
      temp;

  arr.forEach(elem => {
    let length = result.length;
    for(let i = 0; i < length; i++) {
      temp = result[i].slice(0);
      temp.push(elem);
      result.push(temp);
    }
  })
  result.sort((a,b)=>{
    return a.length - b.length
  });
  return result;
}

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

function outputResult(path,cost,delta) {
  console.log("\nFound minimum path:   " + path.join(" -> "));
  console.log("With minimumm cost:   " + cost);
  if (delta < 1000) {
    console.log("\nIt took " + delta + " milliseconds! (" + (delta/1000) + " seconds)\n");
  }
  else if (delta < 60000) {
    console.log("\nIt took " + (delta/1000) + " seconds!\n");
  }
  else {
    console.log("\nIt took " + (delta/60000) + " minutes! (" + (delta/1000) + " seconds)\n");
  }
}

function printGraph(g) {
  g.forEach(row=>{
    console.log("| " + row.join(" , ") + " |");
  })
}

function speedTestHeldKarp(maxSize,minSize,increment,numRuns) {
  let g, start, t1, t2, delta, path, cost, averages = new Object(), times = new Object();
  for (let i = 0; i < numRuns; i++) {
    for (let size = minSize; size <= maxSize; size += increment) {
      g = generateRandomGraph(size,50,2);
      start = ~~(Math.random()*(g.length-1))

      console.log("Testing graph: \n")
      printGraph(g);
      console.log("\nWith size " + g.length + " from start node " + start + "...\n");

      t1 = Date.now();
      [path,cost] = dynamicHeldKarp(g,start);
      t2 = Date.now();

      delta = t2 - t1;
      if (times.hasOwnProperty(size)) {
        times[size].push(delta);
      }
      else {
        times[size] = [delta];
      }
      outputResult(path,cost,delta);
    }
    size = minSize;
    console.log("+**********+ RUN " + (i+1) + " COMPLETE +**********+")
  }
  let sum = 0;
  for (key in times) {
    if (times.hasOwnProperty(key)) {
      times[key].forEach(elem=>{
        sum += elem;
      })
      averages[key] = sum / times[key].length;
    }
    sum = 0;
  }
  
  for (key in averages) {
    console.log("\nSize: " + key);
    if (averages[key] < 1000) {
      console.log("Average time after " + numRuns + " runs: " + averages[key] + " milliseconds! (" + (averages[key]/1000) + " seconds)\n");
    }
    else if (delta < 60000) {
      console.log("Average time after " + numRuns + " runs: " + (averages[key]/1000) + " seconds!\n");
    }
    else {
      console.log("Average time after " + numRuns + " runs: " + (averages[key]/60000) + " minutes! (" + (averages[key]/1000) + " seconds)\n");
    }
  }
}

let MAX_SIZE = 18;
let MIN_SIZE = 2;
let increment = 1;
let numRuns = 3;
speedTestHeldKarp(MAX_SIZE,MIN_SIZE,increment,numRuns);