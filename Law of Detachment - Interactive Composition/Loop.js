// Custom Loop class to manage individual audio loops
class Loop {
  constructor(url, i, name, side, category, color) {
    // Create a Tone.js Player for each loop
    this.player = new Tone.Player({
      url: url,
      loop: true,    // Enable looping
      volume: -12    // Set default volume
    }).toDestination();
    
    this.category = category;
    this.color = color;
    
    // Create play/pause button
    this.button = createButton(name);
    this.button.mousePressed(this.toggle.bind(this));
    this.styleButton();
    
    // Create volume slider
    this.volumeSlider = createSlider(0, 1, 0.5, 0.1);
    this.volumeSlider.input(this.updateVolume.bind(this));
    this.styleVolumeSlider();
    
    // Position UI elements
    let xPosition = side === "left" ? 50 : width - 200;
    let yPosition = 100 + i * 70;
    this.button.position(xPosition, yPosition);
    this.volumeSlider.position(xPosition, yPosition + 55);
  }
  
  // Button styling method
  styleButton() {
    this.button.style('width', '150px');
    this.button.style('height', '50px');
    this.button.style('font-size', '16px');
    this.button.style('background-color', 'white');
  }
  
  // Volume slider styling method (not shown in original code)
  styleVolumeSlider() {
    this.volumeSlider.style('width', '150px');
  }
  
  // Toggle play/pause for the loop
  toggle() {
    // Start Tone.js Transport if not already started
    if (Tone.Transport.state !== "started") {
      Tone.start();
      Tone.Transport.start();
    }
    
    // Stop or start the loop
    if (this.player.state === "started") {
      this.scheduleStop();
    } else {
      this.scheduleStart();
    }
  }
  
  // Schedule starting the loop
  scheduleStart() {
    // Stop other active loops in the same category
    if (this.category === "detachment" && activeDetachment) {
      activeDetachment.scheduleStop();
    } else if (this.category === "instrumental" && activeInstrumental) {
      activeInstrumental.scheduleStop();
    }
    
    // Set active loop for the category
    if (this.category === "detachment") {
      activeDetachment = this;
    } else {
      activeInstrumental = this;
    }
    
    this.player.start();
    // Schedule UI update after 2 measures
    Tone.Draw.schedule(() => this.start(), "@2m");
  }
  
  // Schedule stopping the loop
  scheduleStop() {
    this.player.stop();
    // Schedule UI update after 2 measures
    Tone.Draw.schedule(() => this.stop(), "@2m");
    
    // Clear active loop for the category
    if (this.category === "detachment" && activeDetachment === this) {
      activeDetachment = null;
    } else if (this.category === "instrumental" && activeInstrumental === this) {
      activeInstrumental = null;
    }
  }
  
  // UI method to show loop is active
  start() {
    this.button.style('background-color', this.color);
    this.button.style('color', 'white');
  }
  
  // UI method to show loop is stopped
  stop() {
    this.button.style('background-color', 'white');
    this.button.style('color', 'black');
  }
  
  // Update loop volume based on slider
  updateVolume() {
    let volumeValue = Tone.gainToDb(this.volumeSlider.value());
    this.player.volume.rampTo(volumeValue, 0.1);
  }
}