const { execSync } = require('child_process');
const code = execSync('git show HEAD:game.js', { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
const lines = code.split('\n');

const matches = [];
lines.forEach((line, i) => {
    if (line.includes('LEVELS =') || line.includes('const LEVELS =') || (line.includes('name:') && line.includes('background:'))) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('Matches in committed game.js:');
console.log(matches.slice(0, 50).join('\n'));
