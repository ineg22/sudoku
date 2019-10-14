module.exports = function solveSudoku(matrix) {
  let extendedMatrix = new Array(9);
  let resultMatrix = new Array(9);
  let updatedValues;
  let emptyCount;

  matrix.forEach((item1, i) => {
    resultMatrix[i] = new Array(9);
    extendedMatrix[i] = new Array(9);

    item1.forEach((item2, j) => {
      extendedMatrix[i][j] = {
        value: 0,
        possibleVal: [],
      }

      if (matrix[i][j]) {
        extendedMatrix[i][j].value = matrix[i][j];
        extendedMatrix[i][j].possibleVal = 0;
        resultMatrix[i][j] = item2;
      } else {
        resultMatrix[i][j] = 0;
      }
    })
  });


  while (true) {
    emptyCount = 0;

    do {
      updateMatrix();
    } while (updatedValues);

    do {
      reduceOpportunitys();
    } while (updatedValues);

    calcEmptyCount()

    if (!emptyCount) {
      break;
    } else {
      resultMatrix = bruteForce(resultMatrix);
    }
  }

  return resultMatrix;

  function bruteForce(resultMatrix) {
    const nextEmpty = findNextEmpty(resultMatrix);

    calcEmptyCount();
    if (!emptyCount) {
      return resultMatrix;
    }

    const i = nextEmpty[0];
    const j = nextEmpty[1];
    const possibleValues = findPossible(i, j);

    for (let k = 0; k < possibleValues.length; k++) {
      extendedMatrix[i][j].value = possibleValues[k];
      extendedMatrix[i][j].possibleVal = 0;
      resultMatrix[i][j] = possibleValues[k];
      
      bruteForce(resultMatrix);

      calcEmptyCount();
      if (!emptyCount) {
        return resultMatrix;
      }
    }

    resultMatrix[i][j] = 0;
  }

  function findNextEmpty(resultMatrix) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (resultMatrix[i][j] === 0) return [i, j];
      }
    }
  }

  function calcEmptyCount() {
    emptyCount = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!resultMatrix[i][j]) {
          emptyCount++;
        }
      }
    }
  }

  function updateMatrix() {
    updatedValues = 0;

    resultMatrix.forEach((item1, i) => {
      item1.forEach((item2, j) => {
        if (!resultMatrix[i][j]) {
          extendedMatrix[i][j].possibleVal = findPossible(i, j);

          if (extendedMatrix[i][j].possibleVal.length === 1) {
            extendedMatrix[i][j].value = extendedMatrix[i][j].possibleVal[0];
            extendedMatrix[i][j].possibleVal = 0;
            resultMatrix[i][j] = extendedMatrix[i][j].value;
            updatedValues++;
          }
        }
      });
    })
  }

  function findPossible(i, j) {
    let result = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let kvadrantValues = findKvadrantValues(i, j);

    for (let j = 0; j < 9; j++) {
      if (result.includes(resultMatrix[i][j])) {
        result.splice(result.indexOf(resultMatrix[i][j]), 1);
      }
    }

    for (let i = 0; i < 9; i++) {
      if (result.includes(resultMatrix[i][j])) {
        result.splice(result.indexOf(resultMatrix[i][j]), 1);
      }
    }

    for (let i = 0; i < kvadrantValues.length; i++) {
      if (result.includes(kvadrantValues[i])) {
        result.splice(result.indexOf(kvadrantValues[i]), 1);
      }
    }

    return result;
  }

  function findKvadrantValues(i, j) {
    let result = [];

    for (let k = Math.floor(i / 3) * 3; k < Math.floor(i / 3) * 3 + 3; k++) {
      for (let l = Math.floor(j / 3) * 3; l < Math.floor(j / 3) * 3 + 3; l++) {
        if (resultMatrix[k][l]) {
          result.push(resultMatrix[k][l]);
        }
      }
    }

    return result;
  }

  function findKvadrantPossibilities(i, j) {
    let result = [];

    for (let k = Math.floor(i / 3) * 3; k < Math.floor(i / 3) * 3 + 3; k++) {
      for (let l = Math.floor(j / 3) * 3; l < Math.floor(j / 3) * 3 + 3; l++) {
        if (!resultMatrix[k][l]) {
          result.concat(...extendedMatrix[k][l].possibleVal)
        }
      }
    }

    return result;
  }

  function reduceOpportunitys() {
    updatedValues = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!resultMatrix[i][j]) {
          updateMatrix();
          let arr = extendedMatrix[i][j].possibleVal;
          let kvadrantPossibilities = findKvadrantPossibilities(i, j);

          for (let k = 0; k < arr.length; k++) {
            let opp = 0;

            for (let i = 0; i < 9; i++) {
              if (!extendedMatrix[i][j].value && extendedMatrix[i][j].possibleVal.includes(arr[k])) {
                opp++;
              }
            }

            if (opp === 1) {
              extendedMatrix[i][j].value = arr[k];
              extendedMatrix[i][j].possibleVal = 0;
              resultMatrix[i][j] = arr[k];
              updatedValues++;
              break;
            }

            opp = 0;
            for (let j = 0; j < 9; j++) {
              if (!extendedMatrix[i][j].value && extendedMatrix[i][j].possibleVal.includes(arr[k])) {
                opp++;
              }
            }

            if (opp === 1) {
              extendedMatrix[i][j].value = arr[k];
              extendedMatrix[i][j].possibleVal = 0;
              resultMatrix[i][j] = arr[k];
              updatedValues++;
              break;
            }

            opp = 0;
            for (let l = 0; l < kvadrantPossibilities.length; l++) {
              if (kvadrantPossibilities.includes(arr[k])) {
                opp++;
              }
            }

            if (opp === 1) {
              extendedMatrix[i][j].value = arr[k];
              extendedMatrix[i][j].possibleVal = 0;
              resultMatrix[i][j] = arr[k];
              updatedValues++;
              break;
            }
          }
        }
      }
    }
  }
}
