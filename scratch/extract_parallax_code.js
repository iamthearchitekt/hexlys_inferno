const fs = require('fs');
const lines = fs.readFileSync('scratch/all_game_edits.txt', 'utf8').split('\n');

console.log('=== Lines 2380 to 2440 ===');
console.log(lines.slice(2379, 2440).join('\n'));
