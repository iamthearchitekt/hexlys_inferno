const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('function drawPixelMatrix');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 800));
} else {
    console.log('drawPixelMatrix not found!');
}
