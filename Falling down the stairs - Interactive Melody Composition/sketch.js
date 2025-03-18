// Create a Synth instrument from Tone.js and connect it to the audio output
const synth = new Tone.Synth();
synth.toDestination();

// Define the scales (using note strings; later the base octave will be applied)
const pentatonicScale = ["C4", "D4", "E4", "G4", "A4"]; // 5 notes => 5 stairs
const minorScale = ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"]; // 8 notes => 8 stairs
const majorScale = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]; // 8 notes => 8 stairs

let currentScene = "pentatonic"; // Default scene
let ball;
let stairs = [];
let octaveSlider;  // Global slider for base octave

// Helper: Given a note letter, stair index, scale length, and base octave,
// returns the full note string. For 8-note scales, the last note is one octave higher.
function getFullNote(noteLetter, index, scaleLength, baseOctave) {
  let octave = baseOctave;
  if (scaleLength === 8 && index === scaleLength - 1) {
    octave = baseOctave + 1;
  }
  return noteLetter + octave;
}

function setup() {
  createCanvas(800, 600);
  
  // Inject custom CSS for the slider to give it a cyberpunk style.
  let styleElem = createElement('style', `
    input[type=range] {
      -webkit-appearance: none;
      appearance: none;
      background: #000;
      height: 8px;
      border: 2px solid #0ff;
      border-radius: 5px;
      box-shadow: 0 0 10px #0ff;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #0ff;
      border: 2px solid #000;
      border-radius: 50%;
      box-shadow: 0 0 10px #0ff;
      cursor: pointer;
    }
    input[type=range]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #0ff;
      border: 2px solid #000;
      border-radius: 50%;
      box-shadow: 0 0 10px #0ff;
      cursor: pointer;
    }
  `);
  styleElem.parent(document.head);
  
  // Create a navigation container for scene buttons.
  let nav = createDiv('');
  nav.position(10, 10);
  nav.style('padding', '10px');
  nav.style('background-color', 'rgba(0, 0, 0, 0.5)');
  nav.style('border', '2px solid #0ff');
  nav.style('box-shadow', '0 0 10px #0ff');
  nav.style('font-family', 'monospace');

  // Create and style the Pentatonic button.
  let pentButton = createButton("Pentatonic");
  pentButton.parent(nav);
  pentButton.style('margin-right', '10px');
  styleCyberpunkButton(pentButton);
  pentButton.mousePressed(() => switchScene("pentatonic"));
  
  // Create and style the Minor button.
  let minorButton = createButton("Minor");
  minorButton.parent(nav);
  minorButton.style('margin-right', '10px');
  styleCyberpunkButton(minorButton);
  minorButton.mousePressed(() => switchScene("minor"));
  
  // Create and style the Major button.
  let majorButton = createButton("Major");
  majorButton.parent(nav);
  styleCyberpunkButton(majorButton);
  majorButton.mousePressed(() => switchScene("major"));
  
  // Create a vertical slider for octave selection at the top right.
  // Slider range: 2 to 6 with a default value of 4.
  octaveSlider = createSlider(2, 6, 4, 1);
  // Rotate the slider so it appears vertical and adjust its width.
  octaveSlider.style('transform', 'rotate(-90deg)');
  octaveSlider.style('width', '100px');
  // Move the slider 50 pixels down from its previous position.
  octaveSlider.position(width - 120, 70);
  
  // Enable a neon glow effect for drawing.
  drawingContext.shadowColor = color(0, 255, 255);
  drawingContext.shadowBlur = 20;
  
  // Initialize ball properties.
  ball = {
    x: width * 0.15,
    y: height * 0.1,
    vx: 2,
    vy: 0,
    radius: 15,
    currentStair: null
  };

  // Initialize stairs based on the default scene.
  updateStairs();
}

function styleCyberpunkButton(btn) {
  btn.style('background-color', '#000');
  btn.style('border', '2px solid #0ff');
  btn.style('color', '#0ff');
  btn.style('padding', '8px 16px');
  btn.style('font-family', 'monospace');
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '0 0 10px #0ff');
  btn.style('transition', 'background-color 0.3s, color 0.3s');
  btn.mouseOver(() => {
    btn.style('background-color', '#0ff');
    btn.style('color', '#000');
  });
  btn.mouseOut(() => {
    btn.style('background-color', '#000');
    btn.style('color', '#0ff');
  });
}

function updateStairs() {
  stairs = [];
  let scale;
  if (currentScene === "pentatonic") {
    scale = pentatonicScale;
  } else if (currentScene === "minor") {
    scale = minorScale;
  } else if (currentScene === "major") {
    scale = majorScale;
  }
  let numStairs = scale.length;
  let startX = width * 0.125;
  let startY = width * 0.125;
  let stairWidth = width * 0.1;
  let stairHeight = width * 0.025;
  let verticalGap = width * 0.0625;
  
  // For each note in the scale, store the note letter (without the octave)
  for (let i = 0; i < numStairs; i++) {
    let noteLetter = scale[i].replace(/[0-9]/g, '');
    stairs.push({
      x: startX + i * stairWidth,
      y: startY + i * verticalGap,
      w: stairWidth,
      h: stairHeight,
      noteLetter: noteLetter,
      index: i,
      scaleLength: numStairs
    });
  }
}

function switchScene(scene) {
  currentScene = scene;
  updateStairs();
}

function draw() {
  background(10, 10, 20);
  
  // Draw a neon grid as a futuristic backdrop.
  stroke(50, 200, 255, 50);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
  
  // Draw stairs with a glowing neon cyan outline.
  noFill();
  stroke(0, 255, 200);
  strokeWeight(4);
  for (let stair of stairs) {
    rect(stair.x, stair.y, stair.w, stair.h);
  }
  
  // Draw labels for each stair showing the note (with the octave from the slider) and its frequency.
  textAlign(CENTER, TOP);
  textSize(12);
  fill(255);
  noStroke();
  let baseOctave = octaveSlider.value();
  for (let stair of stairs) {
    let fullNote = getFullNote(stair.noteLetter, stair.index, stair.scaleLength, baseOctave);
    let freq = Tone.Frequency(fullNote).toFrequency();
    text(fullNote + ": " + freq.toFixed(2) + " Hz", stair.x + stair.w / 2, stair.y + stair.h + 5);
  }
  
  // Display the current base octave below the slider.
  push();
  resetMatrix();
  fill(255);
  textAlign(CENTER, TOP);
  // The slider is positioned at (width - 120, 70) with a width of 100px,
  // so its center is at (width - 70). We place the label 50 pixels below the slider.
  text("BASE OCTAVE: " + baseOctave, width - 70, 150);
  pop();
  
  // Draw the neon pink ball.
  noStroke();
  fill(255, 50, 150);
  ellipse(ball.x, ball.y, ball.radius * 2);
  
  // Update ball physics.
  ball.vy += 0.5;
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Check for collision with stairs (only when falling).
  let collisionOccurred = false;
  for (let i = 0; i < stairs.length; i++) {
    let stair = stairs[i];
    if (ball.vy > 0 &&
        ball.x > stair.x && ball.x < stair.x + stair.w &&
        ball.y + ball.radius > stair.y && ball.y - ball.radius < stair.y + stair.h) {
      
      collisionOccurred = true;
      ball.y = stair.y - ball.radius;
      ball.vy *= -0.7;
      ball.vx *= 0.98;
      
      if (ball.currentStair !== i) {
        ball.currentStair = i;
        let fullNote = getFullNote(stair.noteLetter, i, stair.scaleLength, baseOctave);
        synth.triggerAttackRelease(fullNote, "8n");
      }
      break;
    }
  }
  
  if (!collisionOccurred) {
    ball.currentStair = null;
  }
}

function mousePressed() {
  Tone.start(); // Ensure Tone.js audio context is running
  ball.x = mouseX;
  ball.y = mouseY;
  ball.vx = 2;
  ball.vy = 0;
}
