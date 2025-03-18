let loaded = false;
let img; // for the image
let transportStarted = false; // flag to start the Transport once
let started = 0;
let drumSelect = 0; //1 = tabla, 2 = mruthangam
let countBeats = 0; //counting squares

// Dynamic grid configuration:
const numRows = 14; // change this value to alter the number of rows
const numCols = 16; // change this value to alter the number of columns

// Define instruments with their sound mappings and connect them to destination.
const tabla = new Tone.Players({
  num: "Tabla/NUM.wav",
  ta: "Tabla/TA.wav",
  tha: "Tabla/THA.wav",
  tham: "Tabla/THAM.wav",
  thi: "Tabla/THI.wav",
  thom: "Tabla/THOM.wav",
}).toDestination();

const mruthangam = new Tone.Players({
  num: "Mruthangam/NUM.wav",
  ta: "Mruthangam/TA.wav",
  tha: "Mruthangam/THA.wav",
  thi: "Mruthangam/THI.wav",
  thom: "Mruthangam/THOM.wav",
}).toDestination();

console.log(tabla);
console.log(mruthangam);

const beep = new Tone.Player("beep-beep.mp3").toDestination();
const dholak = new Tone.Player("dholak bass.wav").toDestination();
const mathan = new Tone.Player("mathan_drum.wav").toDestination();
const singing = new Tone.Player("singinghindi.mp3").toDestination();
const trinkets = new Tone.Player("trinkets.wav").toDestination();
const udu = new Tone.Player("udu.wav").toDestination();
const kartal = new Tone.Player("High Plains Drums.mp3").toDestination();
const sitar = new Tone.Player("sitar.wav").toDestination();




let waveform = new Tone.Waveform(1024); // Analyze 1024 samples of audio data


// Hardcoded labels for each row (length should match numRows).
const labels = [
  "drum num",
  "drum ta",
  "drum tha",
  "drum tham",
  "drum thi",
  "drum thom",
  "beep .",
  "dholak .",
  "mathan .",
  "hindi .",
  "golisu .",
  "udu .",
  "kartal",
  "sitar",
];

let buttons = []; // 2D array for grid buttons

// Set BPM and adjust time signature so that the number of beats equals numCols.
// (If you want each column to be a beat, set the beats per measure to numCols.)
Tone.Transport.bpm.value = 120;
Tone.Transport.timeSignature = [16, 4];

function preload() {
  img = loadImage("india-outline.jpg");
}

function setup() {
  
  createCanvas(1050, 600);
  

  // Define grid parameters: the grid occupies the left 2/3 of the canvas.
  let gridX = 0;
  let gridY = 0;
  let gridW = (2 / 3) * width;
  let gridH = height;

  // Calculate cell dimensions based on dynamic rows/cols.
  let cellW = gridW / numCols;
  let cellH = gridH / numRows;

  // Create grid buttons.
  for (let r = 0; r < numRows; r++) {
    buttons[r] = [];
    for (let c = 0; c < numCols; c++) {
      buttons[r][c] = new Button(
        gridX + c * cellW +2.5*cellW,
        gridY + r * cellH,
        cellW,
        cellH,
        r, // row index
        c, // column index
        labels[r] // label for that row (e.g., "tabla num")
      );
    }
  }

  // Schedule the repeating loop.
  // We trigger playBeat every quarter note ("4n").
  Tone.Transport.scheduleRepeat(playBeat, "8n");

  // Create Clear button.
  let clearIt = createButton("Clear", "0");
  clearIt.position(width - 50, 10);
  clearIt.mousePressed(clearInstruments);
  
 
    // Buttons to select instruments
  let tablaSelect = createButton("Tabla");
  tablaSelect.position(0, height);
  tablaSelect.mousePressed(() => chooseInstrument(1)); // Pass 1 for Tabla

  let mruthSelect = createButton("Mruthangam");
  mruthSelect.position(60, height);
  mruthSelect.mousePressed(() => chooseInstrument(2)); // Pass 2 for Mruthangam
}

function draw() {

  background(240);

  // Define grid parameters (must match setup).
  let gridX = 0;
  let gridY = 0;
  let gridW = (2 / 3) * width;
  let gridH = height;
  let cellW = gridW / numCols;
  let cellH = gridH / numRows;

  // Draw grid buttons.
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      buttons[r][c].display();
    }
  }
  
   // Draw the image in the right 1/3 of the canvas.
  let imgX = (2 / 3) * width;
  let imgW = width - imgX;
  image(img, imgX + 2.5*cellW, 0, imgW+2.5*cellW, height);

  // Draw vertical segmentation lines (every 4 columns, if applicable).
  push();
  strokeWeight(2);
  stroke(10, 0, 100);
  for (let i = 1; i < numCols; i++) {
    if (i % 4 === 0) {
      line(gridX + i * cellW+2.5*cellW, gridY, gridX + i * cellW+2.5*cellW, gridY + gridH);
    }
  }
  pop();

  // Highlight current step.
    if (started ==1){
  blendMode(ADD);
  push();
  noStroke();
  fill(255, 30);
  // Get the current beat from Tone.Transport.position.
  // Tone.Transport.position is in "bars:beats:sixteenths" format.
  let posParts = Tone.Transport.position.split(":");
  // Use the "beats" part and take modulo numCols in case the measure has rolled over.
  let beatIndex = parseInt(posParts[1]) % numCols;
  rect(beatIndex * cellW+2.5*cellW, gridY, cellW, gridH);
circle(imgX+ imgX/4+ 2.5*cellW, height/2,countBeats*beatIndex);
//}
  pop();
    }
  // Draw the hardcoded labels along the left side of the grid.
  blendMode(BLEND);
  push();
  noStroke();
  fill(0);
  for (let r = 0; r < numRows; r++) {
    text(labels[r], 5, gridY + r * cellH + cellH / 2);
  }
  pop();

 
  
  //Draw Circle
  push();
  fill(countBeats*4, countBeats*6, countBeats*6,80);
  noStroke();
  console.log(countBeats);
  circle(imgX+ imgX/4+ 2.5*cellW, height/2,countBeats*7);
//}
  pop();
}


//////////
function mousePressed() {
  // Start the Transport on the first mouse press.
  
  if (!transportStarted) {
    Tone.start();
    Tone.Transport.start();
    transportStarted = true;
    console.log("Transport started");
    started = 1;
  }
  // Check for clicks on grid buttons.
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      buttons[r][c].click(mouseX, mouseY);
      started = 1;
      
    }
  }
}

function clearInstruments() {
  // Reset all buttons.
  started = 0;
  countBeats = 0;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      buttons[r][c].on = false;
    }
  }
}

// Returns the instrument corresponding to a given row.
function getInstrumentForRow(row) {
  console.log("ROW",row);
  if (row < 6  && drumSelect ==1 ) {
    console.log("tabla");
    return tabla;
  } 
  else if (row < 6 && drumSelect == 2 ) {
    console.log("m");
    return mruthangam;
  } 
  
   else if (row === 6) {
    console.log("kar");
    return beep;
  } 
   else if (row === 7) {
    console.log("kar");
    return dholak;
  } 
   else if (row === 8) {
    console.log("kar");
    return mathan;
  } 
  else if (row === 9) {
    console.log("kar");
    return singing;
  } 
   else if (row === 10) {
    return trinkets;
  } 
  else if (row === 11) {
    return udu;
  }
   else if (row === 12) {
    return kartal;
  }
   else if (row === 13) {
    return sitar;
  }
  else
  {console.log("KAT");
   return tabla;}
}

// The playBeat function is called every quarter note ("4n").
// It extracts the beat index from Tone.Transport.position and
// only plays sounds for cells in that column.
function playBeat(time) {
  // Get the current beat index (modulo numCols).
  let posParts = Tone.Transport.position.split(":");
  let beatIndex = parseInt(posParts[1]) % numCols;

  // For each row, check the cell at column beatIndex.
  for (let r = 0; r < numRows; r++) {
    let cell = buttons[r][beatIndex];
    if (cell.on) {
    
      let instrument = getInstrumentForRow(r);
      console.log("Instrument for row " + r + ":", instrument);
      console.log(instrument);
      // For Tone.Players, extract the key (the second word of the label).
      
      if (typeof instrument.has === "function") {
        console.log("!!!!!!!");
        let parts = labels[r].split(" ");
        console.log("PARTS", parts);
        let key = parts[1]; // e.g., "num" from "tabla num"
        if (instrument.has(key)) {
          instrument.player(key).start(time);
        }
      } else {
        console.log("YESSSS");
        // For single-sample instruments.
        instrument.start(time);
      }
    }
  }
}


Tone.loaded().then(function () {
  loaded = true;
  console.log("loaded!");
});

function chooseInstrument(instrumentType){
// append(selectedInstruments, this.value());
  drumSelect = instrumentType;
  console.log(drumSelect);
  
  }
