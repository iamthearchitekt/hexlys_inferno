const { execSync } = require('child_process');
const html = execSync('git show HEAD:index.html', { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
const lines = html.split('\n');

const matches = [];
lines.forEach((line, i) => {
    if (line.includes('LEVELS') || line.includes('layout') || line.includes('PLACEHOLDER')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('Matches in committed index.html:');
console.log(matches.slice(0, 50).join('\n'));
