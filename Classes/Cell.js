class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.visited = false;
    this.startingCell = false;
    this.endingCell = false;

    this.highlight = function () {
      var x = this.i * w;
      var y = this.j * w;
      noStroke();
      fill(0, 255, 255, 100);
      rect(x, y, w, w);
    };

    this.show = function () {
      var x = this.i * w;
      var y = this.j * w;

      stroke(255);

      if (this.walls[0]) {
        line(x, y, x + w, y); // Top
      }
      if (this.walls[1]) {
        line(x + w, y, x + w, y + w); // Right
      }
      if (this.walls[2]) {
        line(x + w, y + w, x, y + w); // Bottom
      }
      if (this.walls[3]) {
        line(x, y + w, x, y); // Left
      }
      if (this.visited && debugging.coloredCells == true) {
        fill(255, 0, 255, 100);
        noStroke();
        rect(x, y, w, w);
      }
      if (this.startingCell) {
        fill(15, 30, 200);
        noStroke();
        rect(x, y, w, w);
      }
      if (this.endingCell) {
        fill(15, 200, 30);
        noStroke();
        rect(x, y, w, w);
      }
    };

    this.checkNeighbors = function () {
      var neighbors = [];
      let topIndex = index(i, j - 1);
      let rightIndex = index(i + 1, j);
      let bottomIndex = index(i, j + 1);
      let leftIndex = index(i - 1, j);
      var top = grid[index(i, j - 1)];
      var right = grid[index(i + 1, j)];
      var bottom = grid[index(i, j + 1)];
      var left = grid[index(i - 1, j)];

      if (debugging.doLogging)
        console.table({
          topIndex,
          rightIndex,
          bottomIndex,
          leftIndex
        });

      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }

      if (debugging.doLogging)
        console.debug(`Neighbors.length = ${neighbors.length}`);
      if (neighbors.length > 0) {
        var randomNeighbor = floor(random(0, neighbors.length));
        if (debugging.doLogging)
          console.debug(neighbors[randomNeighbor]);
        return neighbors[randomNeighbor];
      } else {
        return undefined;
      }
    };
  }
}