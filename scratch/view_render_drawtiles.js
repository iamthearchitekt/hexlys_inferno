const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('this.drawTiles();');
if (idx !== -1) {
    console.log(code.substring(idx - 400, idx + 200));
} else {
    console.log('this.drawTiles() not found');
}
