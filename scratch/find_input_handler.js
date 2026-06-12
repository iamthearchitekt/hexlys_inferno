const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const idx = code.indexOf('class InputHandler');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 800));
} else {
    console.log('class InputHandler not found!');
}
