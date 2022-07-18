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
  }  
}