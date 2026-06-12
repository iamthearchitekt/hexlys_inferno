const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('SWAMP')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('SWAMP lines:');
console.log(matches.slice(0, 100).join('\n'));
