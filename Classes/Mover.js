class Mover {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;

    this.show = function() {
      noStroke()
      fill(194, 48, 87);
      let x = this.i * this.w;
      let y = this.j * this.w;
      rect(x, y, this.w, this.w);
    }

    this.move = function(newI, newJ) {
      this.i = newI;
      this.j = newJ;
    }

    this.moveUp = function() {
      if (index(mover.i, mover.j-1) !== -1) {
        // console.log("UP pressed");
        if (!grid[index(mover.i, mover.j)].walls[0] && !grid[index(mover.i, mover.j-1)].walls[2]) {
          mover.move(mover.i, mover.j-1);
        }
      }
    }
    this.moveRight = function() {
      if (index(mover.i+1, mover.j) !== -1) {
        // console.log("RIGHT pressed");
        if (!grid[index(mover.i, mover.j)].walls[1] && !grid[index(mover.i+1, mover.j)].walls[3]) {
          mover.move(mover.i+1, mover.j);
        }
      }
    }
    this.moveDown = function() {
      if (index(mover.i, mover.j+1) !== -1) {
        // console.log("DOWN pressed");
        if (!grid[index(mover.i, mover.j)].walls[2] && !grid[index(mover.i, mover.j+1)].walls[0]) {
          mover.move(mover.i, mover.j+1);
        }
      }
    }
    this.moveLeft = function() {
      if (index(mover.i-1, mover.j) !== -1) {
        // console.log("LEFT pressed");
        if (!grid[index(mover.i, mover.j)].walls[3] && !grid[index(mover.i-1, mover.j)].walls[1]) {
          mover.move(mover.i-1, mover.j);
        }
      }
    }
  }  
}