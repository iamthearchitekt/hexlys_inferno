const fs = require('fs');
const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('SWAMP_COLORS')) {
        matches.push(`${i + 1}: ${line.trim()}`);
    }
});
console.log('SWAMP_COLORS lines:');
console.log(matches.slice(0, 100).join('\n'));
