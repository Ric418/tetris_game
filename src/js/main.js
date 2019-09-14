document.getElementById("hello_text").textContent = "初めてのJavaScript";

var cells;
var count = 0;

var xyState = [];

var blocks = {
  i: {
    class: "i",
    pattern: [[1, 1, 1, 1]]
  },
  o: {
    class: "o",
    pattern: [[1, 1], [1, 1]]
  },
  t: {
    class: "t",
    pattern: [[0, 1, 0], [1, 1, 1]]
  },
  s: {
    class: "s",
    pattern: [[0, 1, 1], [1, 1, 0]]
  },
  z: {
    class: "z",
    pattern: [[1, 1, 0], [0, 1, 1]]
  },
  j: {
    class: "j",
    pattern: [[1, 0, 0], [1, 1, 1]]
  },
  l: {
    class: "l",
    pattern: [[0, 0, 1], [1, 1, 1]]
  }
};

loadTable();
var tetris = setInterval(function() {
  // Counting order, count up in step 1
  count++;
  document.getElementById("hello_text").textContent =
    "初めてのJavaScript(" + count + ")";
  //
  // checkGameOver();
  if (hasFallingBlock()) {
    fallBlocks();
  } else {
    deleteRow();
    generateBlock();
  }
}, 1000);

function loadTable() {
  cells = [];
  var td_array = document.getElementsByTagName("td"); // array have 200 elements
  var index = 0;
  for (var row = 0; row < 20; row++) {
    cells[row] = []; // create 2-dimention array
    for (var col = 0; col < 10; col++) {
      cells[row][col] = td_array[index];
      index++;
    }
  }
}

function fallBlocks() {
  // make bottom row empty
  for (var i = 0; i < 10; i++) {
    if (cells[19][i].blockNum === fallingBlockNum) {
      isFalling = false;
      return;
    }
  }
  // check there is block below
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (
          cells[row + 1][col].className !== "" &&
          cells[row + 1][col].blockNum !== fallingBlockNum
        ) {
          isFalling = false;
          return;
        }
      }
    }
  }
  // from second row to bottom, pull down reccursively.
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
}

function checkGameOver() {
  for (var col = 3; col < 7; col++) {
    if (
      cells[0][col].className !== "" &&
      cells[1][col].className !== "" &&
      cells[2][col].className !== ""
    ) {
      clearInterval(tetris);
      alert("game over");
    }
  }
}

var isFalling = false;
function hasFallingBlock() {
  return isFalling;
}

function deleteRow() {
  for (var row = 19; row >= 0; row--) {
    var canDelete = true;
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className === "") {
        canDelete = false;
      }
    }
    if (canDelete) {
      for (var col = 0; col < 10; col++) {
        cells[row][col].className = "";
      }
      // ここもロジックとしておかしい気がする
      for (var downRow = row - 1; row >= 0; row--) {
        for (var col = 0; col < 10; col++) {
          cells[downRow + 1][col].className = cells[downRow][col].className;
          cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
          cells[downRow][col].className = "";
          cells[downRow][col].blockNum = null;
        }
      }
    }
  }
}

var fallingBlockNum = 0;
function generateBlock() {
  // ランダムにブロックを生成する
  // 1. ブロックパターンからランダムに一つパターンを選ぶ
  var keys = Object.keys(blocks);
  var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
  var nextBlock = blocks[nextBlockKey];
  if (nextBlock.className !== "i") {
    if (nextBlock.className === "o") {
      for (var col = 3; col < 5; col++) {
        if (cells[1][col].className !== "" || cells[0][col].className !== "") {
          clearInterval(tetris);
          alert("game over");
        }
      }
    } else {
      for (var col = 3; col < 6; col++) {
        if (cells[1][col].className !== "" || cells[0][col].className !== "") {
          clearInterval(tetris);
          alert("game over");
        }
      }
    }
  }
  var nextFallingBlockNum = fallingBlockNum + 1;
  // 2. 選んだパターンをもとにブロックを配置する
  var pattern = nextBlock.pattern;
  for (var row = 0; row < pattern.length; row++) {
    for (var col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        cells[row][col + 3].className = nextBlock.class;
        cells[row][col + 3].blockNum = nextFallingBlockNum;
      }
    }
  }
  // 3. 落下中のブロックがあるとする
  isFalling = true;
  fallingBlockNum = nextFallingBlockNum;
}

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
  if (event.keyCode === 37) {
    moveLeft();
  } else if (event.keyCode === 39) {
    moveRight();
  } else if (event.keyCode === 40) {
    fallBlocks();
  }
}

function moveRight() {
  var xyIndex = 0;
  for (var row = 0; row < 20; row++) {
    for (var col = 9; col >= 0; col--) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        // console.log("yeah");
        if (
          col === 9 ||
          (cells[row][col + 1].className !== "" &&
            cells[row][col + 1].blockNum !== fallingBlockNum)
        ) {
          return;
        } else {
          xyState[xyIndex] = { row: row, col: col };
          xyIndex++;
        }
      }
    }
  }
  for (var xyIndex = 0; xyIndex < 4; xyIndex++) {
    cells[xyState[xyIndex].row][xyState[xyIndex].col + 1].className =
      cells[xyState[xyIndex].row][xyState[xyIndex].col].className;
    cells[xyState[xyIndex].row][xyState[xyIndex].col + 1].blockNum =
      cells[xyState[xyIndex].row][xyState[xyIndex].col].blockNum;
    cells[xyState[xyIndex].row][xyState[xyIndex].col].className = "";
    cells[xyState[xyIndex].row][xyState[xyIndex].col].blockNum = null;
  }
}

function moveLeft() {
  var xyIndex = 0;
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
        if (
          col === 0 ||
          (cells[row][col - 1].className !== "" &&
            cells[row][col - 1].blockNum !== fallingBlockNum)
        ) {
          return;
        } else {
          xyState[xyIndex] = { row: row, col: col };
          xyIndex++;
        }
      }
    }
  }
  for (var xyIndex = 0; xyIndex < 4; xyIndex++) {
    cells[xyState[xyIndex].row][xyState[xyIndex].col - 1].className =
      cells[xyState[xyIndex].row][xyState[xyIndex].col].className;
    cells[xyState[xyIndex].row][xyState[xyIndex].col - 1].blockNum =
      cells[xyState[xyIndex].row][xyState[xyIndex].col].blockNum;
    cells[xyState[xyIndex].row][xyState[xyIndex].col].className = "";
    cells[xyState[xyIndex].row][xyState[xyIndex].col].blockNum = null;
  }
}

function jumpDown() {}

function spinBlock() {
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === fallingBlockNum) {
      }
    }
  }
}

function cacheBlock() {}
