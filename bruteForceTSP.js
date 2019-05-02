// Finley McIlwaine
// W#: 08133841
// COSC3020 Professor Kotthoff
// Assignment 3
// 5/3/2019

const { getCost } = require("./helpers");

/**
 * Gets the optimal path through g from start by testing all permutations
 * of paths and returning the minimum path and cost.
 * @param {*} g     Cost matrix
 * @param {*} start Start node
 */
function bruteForceTSP(g, start) {
  let setOfVerts = new Array(g.length);
  for (let i = 0; i < setOfVerts.length; i++) {
    setOfVerts[i] = i;
  }
  setOfVerts.splice(start, 1);
  permArr = [];
  usedNums = [];
  let permutations = permuteArr(setOfVerts);
  let minCost = Infinity;
  let minPath, tempCost;
  for (let i = 0; i < permutations.length; i++) {
    permutations[i].unshift(start);
    tempCost = getCost(g, permutations[i]);
    if (tempCost < minCost) {
      minCost = tempCost;
      minPath = permutations[i];
    }
  }
  return [minPath, minCost];
}

/**
 * Returns an array of all permutations of input arr.
 * @param {*} arr Array to be permuted
 */
function permuteArr(arr) {
  var permArr = [];
  var usedNums = [];
  function permute(arr) {
    var i, ch;
    for (i = 0; i < arr.length; i++) {
      ch = arr.splice(i, 1)[0];
      usedNums.push(ch);
      if (arr.length == 0) {
        permArr.push(usedNums.slice());
      }
      permute(arr);
      arr.splice(i, 0, ch);
      usedNums.pop();
    }
  }
  ;
  permute(arr);
  return permArr;
}

exports.bruteForceTSP = bruteForceTSP;