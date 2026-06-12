const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('const SWAMP_COLORS');
if (idx !== -1) {
    console.log(code.substring(idx - 100, idx + 400));
} else {
    console.log('SWAMP_COLORS not found');
}
