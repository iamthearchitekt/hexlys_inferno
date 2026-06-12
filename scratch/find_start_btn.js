const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('start-btn');
if (idx !== -1) {
    console.log(code.substring(idx - 150, idx + 400));
} else {
    console.log('start-btn not found in game.js');
}
