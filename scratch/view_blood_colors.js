const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('const BLOOD_COLORS');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 250));
} else {
    console.log('BLOOD_COLORS not found');
}
