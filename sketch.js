let amount = 250;
let minsize = 50;
let maxsize = 80;
let wiggle = 5;
let maxage = 150;
let msize = maxsize * 3;

function preload() {}

function gen() {
  let cells = new Array(amount);
  let red = 255;
  let blue = 0;
  for (let i = 0; i < amount; i++) {
    if (i >= amount / 2) {
      red = 0;
      blue = 255;
    }
    cells[i] = new Cell(red, blue);
  }
  return cells;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // noLoop();

  cells = gen();

}

function checkCell(cells, cell) {
  intersects = false;
  for (let i = 0; i < cells.length; i++) {
    pell = cells[i];
    if (cell != pell && cell.size >= pell.size && cell.extracted == false && pell.extracted == false) {
      if (cell.intersects(pell)) {
        intersects = true;
        if (cell.size < msize) {
          cell.age++;
          cell.size--;
          pell.size++;
        }
        if (cell.age == maxage) {
          pell.extract();
          cell.evolve(pell);
        }
      }
      if (cell.size >= msize) {
        cell.divide();
      }
    }
  }
  if (!(intersects)) {
    if (cell.age > 0) {
      cell.age--;
    }
  }
}

function draw() {
  background(0, 150, 136);

  for (let i = 0; i < cells.length; i++) {
    cell = cells[i];
    cell.move();
    // cells[0].x = mouseX;
    // cells[0].y = mouseY;
    checkCell(cells, cell);
    cell.show();
  }
}

class Cell {
  constructor(red, blue) {
    this.size = round(random(minsize, maxsize));
    this.x = round(random(this.size / 2, width - (this.size / 2)));
    this.y = round(random(this.size / 2, height - (this.size / 2)));
    this.extracted = false;
    this.age = 0;
    this.red = red;
    this.blue = blue;
    this.partner = false;
  }

  extract() {
    this.extracted = true;
    this.partner = false;
  }

  evolve(pell) {
    if (pell.partner) {
      if (!(pell.partner.extracted)) {
        pell.partner.extracted = true;
        this.size += pell.partner.size / 2;
        this.red = (this.red + pell.partner.red) / 2;
        this.blue = (this.blue + pell.partner.blue) / 2;
      }
    }
    this.age = 0;
    this.size += pell.size / 2;
    this.red = (this.red + pell.red) / 2;
    this.blue = (this.blue + pell.blue) / 2;
  }

  move() {
    this.x = round(random(this.x - wiggle, this.x + wiggle));
    this.y = round(random(this.y - wiggle, this.y + wiggle));
    if (this.x < this.size / 2) {
      this.x = this.size / 2;
    }
    if (this.x > width - this.size / 2) {
      this.x = width - this.size / 2;
    }
    if (this.y < this.size / 2) {
      this.y = this.size / 2;
    }
    if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
    }
  }

  intersects(phis) {
    // stroke(255);
    // strokeWeight(0.5);
    // line(this.x, this.y, phis.x, phis.y);
    if (
      this.x <= phis.x + (phis.size / 2) &&
      this.x >= phis.x - (phis.size / 2) &&
      this.y <= phis.y + (phis.size / 2) &&
      this.y >= phis.y - (phis.size / 2)
    ) {
      return true;
    } else {
      return false;
    }
  }

  divide() {
    this.size = this.size / 2;
    for (let i = 0; i <= cells.length; i++) {
      if (cells[i].extracted) {
        if (round(random(1)) == 0) {
          cells[i] = new Cell(255, 0);
          this.red = 0;
          this.blue = 255;
        } else {
          cells[i] = new Cell(0, 255);
          this.blue = 0;
          this.red = 255;
        }
        cells[i].size = this.size;
        cells[i].partner = this;
        break;
      }
    }
  }

  show() {
    if (!(this.extracted)) {
      if (this.partner) {
        if (!(this.partner.extracted)) {
          strokeWeight(1);
          stroke(255);
          line(this.x, this.y, this.partner.x, this.partner.y);
        }
      }

      stroke(this.red, 0, this.blue);
      fill('rgba(255,255,255,' + 0.8 * this.age / maxage + ')');

      strokeWeight(this.size / 24);
      ellipse(this.x, this.y, this.size, this.size);

      strokeWeight(this.size / 8);
      point(this.x, this.y);
    }
  }
}