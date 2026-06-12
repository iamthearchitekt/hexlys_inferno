const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('getTile(col, row) {');
if (idx !== -1) {
    console.log(code.substring(idx - 600, idx));
} else {
    console.log('getTile not found');
}
