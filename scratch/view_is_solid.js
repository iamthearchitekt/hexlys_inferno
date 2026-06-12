const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const startIdx = code.indexOf('isSolid(tile) {');
if (startIdx !== -1) {
    console.log(code.substring(startIdx, code.indexOf('}', startIdx) + 2));
} else {
    console.log('isSolid definition not found');
}
