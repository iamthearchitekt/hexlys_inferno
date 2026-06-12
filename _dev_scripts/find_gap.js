const fs = require('fs');
const original = fs.readFileSync('levels.js', 'utf8');
fs.writeFileSync('temp_gap.js', original + '\nmodule.exports = LEVELS;');
const LEVELS = require('./temp_gap.js');

const layout = LEVELS[1].layout;
const groundRow = layout[9]; // Row 10 (index 9) is usually the ground

let firstGapCol = -1;
for (let c = 5; c < groundRow.length; c++) {
    if (groundRow[c] === 0 || groundRow[c] === null) {
        firstGapCol = c;
        break;
    }
}
console.log("First gap starts at column:", firstGapCol);
