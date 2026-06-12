const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('resetGame() {');
if (idx !== -1) {
    console.log('Found resetGame() { at index:', idx);
    console.log(code.substring(idx - 100, idx + 800));
} else {
    console.log('resetGame() { definition not found!');
}
