const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.includes('SWAMP_COLORS') || line.includes('BLOOD_COLORS')) {
        matches.push(`${i + 1}: ${line.trim()}`);
    }
});
console.log('HTML occurrences of SWAMP_COLORS / BLOOD_COLORS:');
console.log(matches.join('\n'));
