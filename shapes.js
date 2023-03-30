function getRandomInt(min, max, seed) {
  const x = Math.sin(seed++) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

function generateShape(seed) {
  const numPoints = 4;
  const points = [];
  const minCoord = 100;
  const maxCoord = 300;

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: getRandomInt(minCoord, maxCoord, seed + i),
      y: getRandomInt(minCoord, maxCoord, seed + numPoints + i),
    });
  }

  return points;
}

function generateShapePair(seed) {
  return {
    start: generateShape(seed),
    target: generateShape(seed + 1000),
  };
}

function getTodayPuzzle() {
  const today = new Date();
  const seed = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
  return generateShapePair(seed);
}

const dailyPuzzle = getTodayPuzzle();

