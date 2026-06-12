const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('SWAMP_COLORS') || line.includes('BLOOD_COLORS')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('SWAMP_COLORS / BLOOD_COLORS lines:');
console.log(matches.slice(0, 100).join('\n'));
