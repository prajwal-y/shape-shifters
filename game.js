const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const shareButton = document.getElementById("share");
shareButton.disabled = true;

let currentShape = dailyPuzzle.start;
let targetShape = dailyPuzzle.target;
let moves = 0;

function drawShape(shape, color) {
  ctx.beginPath();
  ctx.moveTo(shape[0].x, shape[0].y);

  for (let i = 1; i < shape.length; i++) {
    ctx.lineTo(shape[i].x, shape[i].y);
  }

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawShape(currentShape, "blue");
  drawShape(targetShape, "rgba(255, 0, 0, 0.5)");

  document.getElementById("moves").textContent = moves;
}

draw();

function checkPuzzleSolved() {
  const tolerance = 1; // You can adjust this value to set the allowed error margin

  for (let i = 0; i < currentShape.length; i++) {
    if (
      Math.abs(currentShape[i].x - targetShape[i].x) > tolerance ||
      Math.abs(currentShape[i].y - targetShape[i].y) > tolerance
    ) {
      return false;
    }
  }

  return true;
}

function update() {
  draw();
  const isSolved = checkPuzzleSolved();
  document.getElementById("share").disabled = !isSolved;

  if (isSolved) {
    alert("Congratulations! You have completed the puzzle.");
  }
}

function rotate(degrees) {
  const radians = (degrees * Math.PI) / 180;
  const centerX = (currentShape[0].x + currentShape[2].x) / 2;
  const centerY = (currentShape[0].y + currentShape[2].y) / 2;

  return currentShape.map((point) => {
    const x = point.x - centerX;
    const y = point.y - centerY;

    return {
      x: x * Math.cos(radians) - y * Math.sin(radians) + centerX,
      y: x * Math.sin(radians) + y * Math.cos(radians) + centerY,
    };
  });
}

function scale(factor) {
  const centerX = (currentShape[0].x + currentShape[2].x) / 2;
  const centerY = (currentShape[0].y + currentShape[2].y) / 2;

  return currentShape.map((point) => ({
    x: centerX + (point.x - centerX) * factor,
    y: centerY + (point.y - centerY) * factor,
  }));
}

function reflect(axis) {
  const centerX = (currentShape[0].x + currentShape[2].x) / 2;
  const centerY = (currentShape[0].y + currentShape[2].y) / 2;

  return currentShape.map((point) => {
    if (axis === "x") {
      return { x: 2 * centerX - point.x, y: point.y };
    } else {
      return { x: point.x, y: 2 * centerY - point.y };
    }
  });
}

function shear(amount) {
  return currentShape.map((point, index) => {
    if (index % 2 === 0) {
      return { x: point.x + amount, y: point.y };
    } else {
      return point;
    }
  });
}

function isPuzzleSolved() {
  return shapeAlmostEqual(currentShape, targetShape);
}


document.getElementById("rotate").addEventListener("click", () => {
  currentShape = rotate(90);
  moves++;
  update();
});

document.getElementById("scale").addEventListener("click", () => {
  currentShape = scale(1.1);
  moves++;
  update();
});

document.getElementById("reflect").addEventListener("click", () => {
  currentShape = reflect("x");
  moves++;
  update();
});

document.getElementById("shear").addEventListener("click", () => {
  currentShape = shear(10);
  moves++;
  update();
});

document.getElementById("reset").addEventListener("click", () => {
  currentShape = dailyPuzzle.start;
  moves = 0;
  update();
});

document.getElementById("share").addEventListener("click", () => {
  if (isPuzzleSolved()) {
    const text = `I completed today's ShapeShifters puzzle in ${moves} moves! Can you beat my score? Check it out at https://yourwebsite.com`;
    const url = encodeURIComponent(text);
    const shareURL = `https://twitter.com/intent/tweet?text=${url}`;

    window.open(shareURL, "_blank");
  } else {
    alert("You can only share your score when the puzzle is solved.");
  }
});

