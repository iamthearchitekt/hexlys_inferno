const fs = require('fs');
const lines = fs.readFileSync('scratch/all_game_edits.txt', 'utf8').split('\n');

console.log('=== Lines 2250 to 2320 ===');
console.log(lines.slice(2249, 2320).join('\n'));

console.log('\n=== Lines 2500 to 2580 ===');
console.log(lines.slice(2499, 2580).join('\n'));
