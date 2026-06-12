const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('TILES') || line.includes('ONEUP') || line.includes('15')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('TILES / ONEUP / 15 lines:');
console.log(matches.slice(0, 100).join('\n'));
