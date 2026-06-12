const fs = require('fs');
const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    if (lower.includes('gate') || lower.includes('gale') || lower.includes('mire') || lower.includes('treasury') || lower.includes('marshes') || lower.includes('necropolis')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('Matches in scratch/all_game_edits.txt:');
console.log(matches.slice(0, 100).join('\n'));
