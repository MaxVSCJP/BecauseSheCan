const { createCanvas } = require('canvas');

// Ethiopian skin tone palette (light caramel to dark chocolate)
const SKIN_TONES = [
  '#D4A574', // Light caramel
  '#C68642', // Medium caramel
  '#B87333', // Copper
  '#A0522D', // Sienna
  '#8B4513', // Saddle brown
  '#6F4E37', // Dark brown
  '#5C4033', // Deep brown
  '#4A3728'  // Dark chocolate
];

// Hair colors
const HAIR_COLORS = [
  '#000000', // Black
  '#1C1C1C', // Very dark
  '#2C1608', // Dark brown
  '#3D2314'  // Brown
];

// Eye colors
const EYE_COLORS = [
  '#1C0D07', // Dark brown
  '#2E1A0F', // Brown
  '#3D2314', // Light brown
  '#000000'  // Black
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateAvatar() {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Random colors
  const skinTone = getRandomElement(SKIN_TONES);
  const hairColor = getRandomElement(HAIR_COLORS);
  const eyeColor = getRandomElement(EYE_COLORS);

  // Background
  ctx.fillStyle = '#F5F5F5';
  ctx.fillRect(0, 0, 200, 200);

  // Head (circle)
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(100, 110, 60, 0, Math.PI * 2);
  ctx.fill();

  // Hair (top arc)
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.arc(100, 90, 65, 0, Math.PI, true);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(85, 105, 8, 0, Math.PI * 2);
  ctx.arc(115, 105, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(85, 105, 5, 0, Math.PI * 2);
  ctx.arc(115, 105, 5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(100, 115, 20, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Nose
  ctx.beginPath();
  ctx.moveTo(100, 110);
  ctx.lineTo(105, 120);
  ctx.stroke();

  // Convert to base64
  return canvas.toDataURL('image/png');
}

module.exports = { generateAvatar };
