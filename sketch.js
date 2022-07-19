var cols, rows;
var w = 40;
var grid = [];
var stack = [];

var startCell = null;
var currentCell = null;
var endCell;
var mover;

var finished = false; // flag indicating maze generation completion
var ready = false; // flag indicating maze is ready to be played. finished must be true

var debugging = {
  doLogging: false,
  coloredCells: true
};

var mobileFirst = false;

var buttonRegions;
var buttonSize = 125;
var buttonPadding = 10;

function setup() {
  let density = displayDensity();
  pixelDensity(density);
  buttonRegions = {
    upButton: {
      start: {
        x: buttonSize*1 + buttonPadding*2,
        y: windowHeight - buttonSize*2 - buttonPadding*2,
      },
      end: {
        x: buttonSize*2 + buttonPadding*2,
        y: windowHeight - buttonSize - buttonPadding*2
      }
    },
    leftButton: {
      start: {
        x: buttonPadding,
        y: windowHeight - buttonSize - buttonPadding
      },
      end: {
        x: buttonSize + buttonPadding,
        y: windowHeight - buttonPadding
      }
    },
    downButton: {
      start: {
        x: buttonSize + buttonPadding*2,
        y: windowHeight - buttonSize - buttonPadding
      },
      end: {
        x: buttonSize*2 + buttonPadding*2,
        y: windowHeight - buttonPadding
      }
    },
    rightButton: {
      start: {
        x: buttonSize*2 + buttonPadding*3,
        y: windowHeight - buttonSize - buttonPadding
      },
      end: {
        x: buttonSize*3 + buttonPadding*3,
        y: windowHeight - buttonPadding
      }
    }
  }
  if (debugging.doLogging)
    console.log(buttonRegions);
  if (density > 2 && windowWidth/density < 600) {
    createCanvas(windowWidth, windowHeight);
    mobileFirst = true;
  } else {
    createCanvas(windowWidth, windowHeight);
  }
  // frameRate(5);
  if (mobileFirst) {
    w = 50;
    rows = floor((windowWidth-buttonSize*2 - buttonPadding*3)/w);
  } else {
    rows = floor(height/w);
  }
  cols = floor(width/w);
  mover = new Mover(0, 0, w);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  currentCell = grid[0];
}

function drawButtons() {
  fill(144);
  noStroke();
  rect(buttonRegions.upButton.start.x, buttonRegions.upButton.start.y, buttonSize, buttonSize);
  rect(buttonRegions.leftButton.start.x, buttonRegions.leftButton.start.y, buttonSize, buttonSize);
  rect(buttonRegions.downButton.start.x, buttonRegions.downButton.start.y, buttonSize, buttonSize);
  rect(buttonRegions.rightButton.start.x, buttonRegions.rightButton.start.y, buttonSize, buttonSize);
}

function draw() {
  if (mobileFirst && finished && ready) {
    background(51);
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }
  }

  currentCell.visited = true;
  if (!mobileFirst)
    currentCell.highlight();
  // STEP 1
  if (!finished) {
    var next = currentCell.checkNeighbors();
    if (next) {
      next.visited = true;
      
      // STEP 2
      stack[stack.length] = currentCell;

      // STEP 3
      removeWalls(currentCell, next);

      // STEP 4
      currentCell = next;
    } else if (stack.length > 0) {
      var cell = stack[stack.length-1];
      currentCell = cell;
      stack.length = stack.length-1;
    } else {
      //console.log("done");
      finished = true;
    }
  }

  if (finished && !ready) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        if (i == 0 || j == 0 || i == cols-1 || j == rows-1) { // if on the edge
          if (debugging.doLogging)
            console.log(i,j)
          if (floor(random(0, 10)) == 7 && startCell == null) {
            if (debugging.doLogging)
              console.log("starting point chosen");
            grid[index(i, j)].startingCell = true;
            startCell = grid[index(i, j)];
            break;
          }
        }
      }
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        if (i == 0 || j == 0 || i == cols-1 || j == rows-1) { // if on the edge
          if (debugging.doLogging)
            console.log(i,j)
          if (floor(random(0,10)) == 7 && endCell == null) {
            if (debugging.doLogging)
              console.log("ending point chosen");
            endCell = grid[index(i,j)];
            grid[index(i, j)].endingCell = true;
            break;
          }
        }
      }
    }

    if (startCell != null && endCell != null) {
      ready = true;
    } else {
      grid[0].startingCell = true;
      grid[grid.length-1].endingCell = true;
      ready = true;
    }

    mover.i = startCell.i;
    mover.j = startCell.j;
  }
  if (ready && endCell) {
    if (mover.i == endCell.i && mover.j == endCell.j) {
      grid = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          var cell = new Cell(i, j);
          grid.push(cell);
        }
      }
      currentCell = grid[0];
      startCell = null;
      endCell = null;
      finished = false;
      ready = false;
    }
  }
  // for (let i = 0; i < stack.length; i++) {
  //   // stack[i].highlight();
  // }


  if (debugging.doLogging && !ready)
    console.log(currentCell);
  if (ready)
    mover.show();
  if (mobileFirst)
    drawButtons();
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }

}

// INPUT
function keyReleased() {
  if (ready) {
    if (keyCode == UP_ARROW) {
      if (index(mover.i, mover.j-1) !== -1) {
        // console.log("UP pressed");
        if (!grid[index(mover.i, mover.j)].walls[0] && !grid[index(mover.i, mover.j-1)].walls[2]) {
          mover.move(mover.i, mover.j-1);
        }
      }
    } else if (keyCode == RIGHT_ARROW) {
      if (index(mover.i+1, mover.j) !== -1) {
        // console.log("RIGHT pressed");
        if (!grid[index(mover.i, mover.j)].walls[1] && !grid[index(mover.i+1, mover.j)].walls[3]) {
          mover.move(mover.i+1, mover.j);
        }
      }
    } else if (keyCode == DOWN_ARROW) {
      if (index(mover.i, mover.j+1) !== -1) {
        // console.log("DOWN pressed");
        if (!grid[index(mover.i, mover.j)].walls[2] && !grid[index(mover.i, mover.j+1)].walls[0]) {
          mover.move(mover.i, mover.j+1);
        }
      }
    } else if (keyCode == LEFT_ARROW) {
      if (index(mover.i-1, mover.j) !== -1) {
        // console.log("LEFT pressed");
        if (!grid[index(mover.i, mover.j)].walls[3] && !grid[index(mover.i-1, mover.j)].walls[1]) {
          mover.move(mover.i-1, mover.j);
        }
      }
    }
  }
}

function touchEnded() {
  let moverI = mover.i;
  let moverJ = mover.j;
  // Up button
  if ((mouseX >= buttonRegions.upButton.start.x && mouseX <= buttonRegions.upButton.end.x) && 
      (mouseY >= buttonRegions.upButton.start.y && mouseY <= buttonRegions.upButton.end.y)) {
        if (debugging.doLogging) {
          console.log({direction: "up", mouseX, mouseY, moverI, moverJ, testCondition1: (index(mover.i, mover.j-1) !== -1)});
        }
        if (index(mover.i, mover.j-1) !== -1) {
          // console.log("UP pressed");
          if (debugging.doLogging) {
            console.log({moverI, moverJ, testCondition2: (!grid[index(mover.i, mover.j)].walls[0] && !grid[index(mover.i, mover.j-1)].walls[2])});
          }
          if (!grid[index(mover.i, mover.j)].walls[0] && !grid[index(mover.i, mover.j-1)].walls[2]) {
            mover.move(mover.i, mover.j-1);
          }
        }
  }

  // Left button
  if ((mouseX >= buttonRegions.leftButton.start.x && mouseX <= buttonRegions.leftButton.end.x) && 
      (mouseY >= buttonRegions.leftButton.start.y && mouseY <= buttonRegions.leftButton.end.y)) {
        if (debugging.doLogging) {
          console.log({direction: "left", mouseX, mouseY, moverI, moverJ, testCondition1: (index(mover.i-1, mover.j) !== -1)});
        }
        if (index(mover.i-1, mover.j) !== -1) {
          // console.log("LEFT pressed");
          if (debugging.doLogging) {
            console.log({moverI, moverJ, testCondition2: (!grid[index(mover.i, mover.j)].walls[3] && !grid[index(mover.i-1, mover.j)].walls[1])});
          }
          if (!grid[index(mover.i, mover.j)].walls[3] && !grid[index(mover.i-1, mover.j)].walls[1]) {
            mover.move(mover.i-1, mover.j);
          }
        }
  }

  // Down button
  if ((mouseX >= buttonRegions.downButton.start.x && mouseX <= buttonRegions.downButton.end.x) && 
      (mouseY >= buttonRegions.downButton.start.y && mouseY <= buttonRegions.downButton.end.y)) {
        if (debugging.doLogging) {
          console.log({direction: "down", mouseX, mouseY, moverI, moverJ, testCondition1: (index(mover.i, mover.j+1) !== -1)});
        }
        if (index(mover.i, mover.j+1) !== -1) {
          // console.log("DOWN pressed");
          if (debugging.doLogging) {
            console.log({moverI, moverJ, testCondition2: (!grid[index(mover.i, mover.j)].walls[2] && !grid[index(mover.i, mover.j+1)].walls[0])});
          }
          if (!grid[index(mover.i, mover.j)].walls[2] && !grid[index(mover.i, mover.j+1)].walls[0]) {
            mover.move(mover.i, mover.j+1);
          }
        }
  }

  // Right button
  if ((mouseX >= buttonRegions.rightButton.start.x && mouseX <= buttonRegions.rightButton.end.x) && 
      (mouseY >= buttonRegions.rightButton.start.y && mouseY <= buttonRegions.rightButton.end.y)) {
        if (debugging.doLogging) {
          console.log({direction: "right", mouseX, mouseY, moverI, moverJ, testCondition1: (index(mover.i+1, mover.j) !== -1)});
        }
        if (index(mover.i+1, mover.j) !== -1) {
          // console.log("RIGHT pressed");
          if (debugging.doLogging) {
            console.log({moverI, moverJ, testCondition2: (!grid[index(mover.i, mover.j)].walls[1] && !grid[index(mover.i+1, mover.j)].walls[3])});
          }
          if (!grid[index(mover.i, mover.j)].walls[1] && !grid[index(mover.i+1, mover.j)].walls[3]) {
            mover.move(mover.i+1, mover.j);
          }
        }
  }

  return false;
}