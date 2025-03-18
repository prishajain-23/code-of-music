// Arrays of textphrases for audio loops

let detachment = [
  "detach", 
  "yourself", 
  "from", 
  "yourself"
];

let instrumentals = [
  "going home",
  "be yourself",
  "i swear...",
  "dj's organ chord",
];

// Arrays to store loop objects
let detachmentLoops = [];
let instrumentalLoops = [];

// Create a reverb effect with decay and wet (effect intensity) settings
let reverb = new Tone.Reverb({
  decay: 0.8,  // How long the reverb sound continues
  wet: 0.9,    // How much reverb is applied to the sound
});

// Slider to control reverb wet value
let reverbSlider;

// Flags and tracking variables
let loaded = false;
let activeDetachment = null;  // Tracks the currently active detachment loop
let activeInstrumental = null;  // Tracks the currently active instrumental loop

// Waveform analyzer to visualize audio
let waveform = new Tone.Waveform(1024); // Analyze 1024 samples of audio data

// Color palette for loop tracks
let trackColors = [
  "#FF5733",
  "#33FF57",
  "#5733FF",
  "#FF33A1",
  "#33A1FF",
  "#A1FF33",
  "#FFA133",
  "#33FFA1",
];

function setup() {
  createCanvas(600, 600);
  
  // Create a slider to control reverb effect
  reverbSlider = createSlider(0, 1, 0.5, 0.1);
  reverbSlider.position(width / 2 - 75, 550);  // Position slider at center top
  // reverbSlider.style("width", "150px");
  reverbSlider.input(updateReverb);  // Call updateReverb when slider value changes
  
  loadLoops();  // Initialize audio loops
}

function draw() {
  let reverbWet = reverbSlider.value();
  
  // Create a background that changes color based on reverb intensity
  background(lerpColor(color("#FFFFFF"), color("#E398F8"), reverbWet));
  
  // textAlign(CENTER);
  // textSize(30)
  // noStroke();
  // fill(lerpColor(color("#E398F8"), color("#3F55FF"), reverbWet));
  // text("Law of Detachment", width/2, 50);
  
  // Draw waveform visualizations for detachment and instrumental loops
  drawWaveform(detachmentLoops, width * 0.25, height - 150);
  drawWaveform(instrumentalLoops, width * 0.75, height - 150);
}

// Function to draw audio waveform
function drawWaveform(loopArray, x, y) {
  push();
  translate(x - width / 4, y);
  
  // Iterate through loops to draw active loop waveforms
  for (let i = 0; i < loopArray.length; i++) {
    let activeLoop = loopArray[i];
    
    // Check if loop is currently playing
    if (activeLoop && activeLoop.player.state === "started") {
      let waveformData = waveform.getValue();
      let waveWidth = width / 2;
      let waveHeight = 100;
      
      stroke(activeLoop.color);  // Use loop's unique color
      noFill();
      
      // Create multiple offset lines to create depth in waveform visualization
      for (let offset = -15; offset <= 30; offset += 15) {
        beginShape();
        for (let j = 0; j < waveformData.length; j++) {
          let xPos = map(j, 0, waveformData.length, 0, waveWidth);
          let yPos = map(waveformData[j], -1, 1, -waveHeight / 2, waveHeight / 2) + offset;
          vertex(xPos, yPos);
        }
        endShape();
      }
    }
  }
  pop();
}

// Function to load and initialize audio loops
function loadLoops() {
  Tone.Transport.bpm.value = 88;  // Set global tempo
  
  // Create 4 loops for each category (detachment and instrumental)
  for (let i = 0; i < 4; i++) {
    let detachmentName = detachment[i];
    let instrumentalName = instrumentals[i];
    
    // Create detachment and instrumental loops with unique properties
    detachmentLoops[i] = new Loop(
      "detachment/" + i + ".mp3",  // Audio file path
      i,                            // Index
      detachmentName,               // Display name
      "left",                       // UI position
      "detachment",                 // Category
      trackColors[i]                // Color
    );
    
    instrumentalLoops[i] = new Loop(
      "instrumentals/" + i + ".mp3",
      i,
      instrumentalName,
      "right",
      "instrumental",
      trackColors[i + 4]
    );
    
    // Connect players to waveform and reverb for analysis and effect
    detachmentLoops[i].player.connect(waveform);
    instrumentalLoops[i].player.connect(waveform);
    detachmentLoops[i].player.connect(reverb);
    instrumentalLoops[i].player.connect(reverb);
  }
  
  reverb.toDestination();  // Route reverb to audio output
}

// Update reverb wet value based on slider
function updateReverb() {
  reverb.wet.rampTo(reverbSlider.value());
}

// Confirm audio is loaded
Tone.loaded().then(function () {
  console.log("loaded");
});
