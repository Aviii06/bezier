let backgroundColor = 250;
let numberOfPointsPerCurve;
let numberOfPoints;

let u = 0.0;
let rad = 30;
let x = [];
let y = [];
let scale = 100;

let state = -1;
let refresh = 0;

function setup() {
  // cnv = document.getElementById("bezier-canvas");
  // width = cnv.offsetWidth;
  // height = cnv.offsetHeight;
  myCanvas = createCanvas(800, 800);
  myCanvas.parent("bezier-canvas");

  getValueFromUI();
  background(backgroundColor);
  for (let i = 0; i < numberOfPoints; i++) {
    x[i] = initializeX();
    y[i] = initializeY();
    state = -1;
  }
}

function draw() {
  if (refresh == 1) {
    background(backgroundColor);
    refresh = 0;
  }

  getValueFromUI();

  if (mouseIsPressed) {
    if (state == -1) {
      for (i in x[0]) {
        if (collision(x[0][i], y[0][i])) { state = i; break; }
      }
    }

    if (state != -1) {
      x[0][state] = mouseX;
      y[0][state] = mouseY;
    }

    background(backgroundColor);
    u = 0;
  } else {
    state = -1;
  }

  renderBezier(x, y);

  fill(255);
  strokeWeight(5);
  for (i in x[0]) {
    ellipse(x[0][i], y[0][i], 10, 10);
  }

  line(x[0][0], y[0][0], x[0][1], y[0][1]);
  line(x[0][numberOfPoints - 2], y[0][numberOfPoints - 2], x[0][numberOfPoints - 1], y[0][numberOfPoints - 1]);
}

function collision(x, y) {
  if (abs(x - mouseX) < rad && abs(y - mouseY) < rad) {
    return true;
  }
  return false;
}

function initializeX() {
  let arr = [];
  for (let i = 0; i < numberOfPoints; i++) {
    arr[i] = width/2 + (i - numberOfPoints /2) * scale;
  }
  return arr;
}

function initializeY() {
  let arr = [];
  for (let i = 0; i < numberOfPoints; i++) {
    arr[i] = height/2 + abs(i - numberOfPoints /2) * scale;
  }
  return arr;
}

function getValueFromUI() {
  numberOfPointsPerCurve = document.getElementById("numberOfPointsPerCurve").value;
  prevN = numberOfPoints;
  numberOfPoints = document.getElementById("numPoints").value; 
}

function renderBezier(x, y) {
  for (let i = 0; i < numberOfPointsPerCurve; i++) {
    u += 1.0 / numberOfPointsPerCurve;
    if (u > 1.0) u = 0.0;

    for (let j = 1; j < numberOfPoints; j++) {
      for (let k = 0; k < numberOfPoints - j; k++) {
        x[j][k] = x[j - 1][k] * (1 - u) + x[j - 1][k + 1] * u;
        y[j][k] = y[j - 1][k] * (1 - u) + y[j - 1][k + 1] * u;
      }
    }  
  
    fill(0);
    strokeWeight(0);
    ellipse(x[numberOfPoints - 1][0], y[numberOfPoints - 1][0], 10, 10);
  }
}


function addPoint() {
  numberOfPoints = parseInt(document.getElementById("numPoints").value) + 1;
  updatePoints(numberOfPoints);
}

function removePoint() {
  numberOfPoints = parseInt(document.getElementById("numPoints").value) - 1;
  updatePoints(numberOfPoints);
}

function updatePoints(n) {
  document.getElementById("numPoints").value = n;
  refresh = 1;
  for (let i = 0; i < n; i++) {
    if (x[i] == undefined || y[i] == undefined) {
      x[i] = initializeX();
      y[i] = initializeY();
    }

    if (prevN < n) {
      x[i].push(width/2 + (i - n /2) * scale);
      y[i].push(height/2 + abs(i - n /2) * scale);
    } else if (prevN > n) {
      x[i].pop();
      y[i].pop();
    }
  }
}