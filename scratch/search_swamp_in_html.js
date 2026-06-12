const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.includes('SWAMP') || line.includes('ONEUP') || line.includes('15') || line.includes('11') || line.includes('18')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('HTML occurrences of SWAMP / ONEUP / 15 / 11 / 18:');
console.log(matches.slice(0, 100).join('\n'));
