const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const idx = code.indexOf('handleKeyDown(e) {');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 1000));
} else {
    console.log('handleKeyDown not found!');
}
