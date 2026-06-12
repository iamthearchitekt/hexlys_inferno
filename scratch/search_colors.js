const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    const idx = line.toLowerCase().indexOf('colors');
    if (idx !== -1) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('Colors matches:');
console.log(matches.join('\n'));
