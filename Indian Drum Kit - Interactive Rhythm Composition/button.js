// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com
//https://editor.p5js.org/yining/sketches/ByLFGX5R

// Exercise 9-8: Write a Button class (see Example 5-5 for a non-object-oriented button). The button
// class should register when a mouse is pressed over the button and change color.  Create button objects
// of different sizes and locations using an array. Before writing the main program, sketch out the
// Button class. Assume the button is off  when it first appears.


// Button class.
class Button {
  constructor(x, y, w, h, row, col, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.row = row;
    this.col = col;
    this.bhol = label; // e.g., "tabla num" or "kartal"
    this.on = false;
  }

  click(mx, my) {
    if (
      mx > this.x &&
      mx < this.x + this.w &&
      my > this.y &&
      my < this.y + this.h
    ) {
      this.on = !this.on;
      if (this.on == true){ countBeats ++;}
      console.log(countBeats);
      if (this.on == false){ countBeats --;}
      console.log(countBeats);
    }
  }

  display() {
    stroke(10);
    fill(this.on ? color(0, 0, 140, 100) : color(220, 220, 220));
    rect(this.x, this.y, this.w, this.h);
  }
}

