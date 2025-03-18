// Sound Class
class Sound {
  constructor(instrument, bhol, row) {
    this.instrument = instrument;
    this.bhol = bhol;
    this.x = 50;
    this.y = row * 40 + height / 2;
    this.size = 20;
  }

  display() {
    fill(0, 200, 100);
    rect(this.x, this.y, this.size, this.size);
  }

  play() {
    if (!loaded) {
      console.log("Waiting for Tone.js to load...");
      return;
    }
    // Check if the instrument supports the "has" method
    if (typeof this.instrument.has === "function") {
      if (this.instrument.has(this.bhol)) {
        this.instrument.player(this.bhol).start();
      } else {
        console.log("Sound", this.bhol, "not found in instrument");
      }
    } else {
      // Assume it's a Tone.Player; simply start it
      this.instrument.start();
    }
  }
}
