const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('hexly') || line.includes('Img') || line.includes('.src')) {
        if (line.length < 150) {
            matches.push(`${i + 1}: ${line.trim()}`);
        }
    }
});
console.log('Hexly/image loading lines:');
console.log(matches.slice(0, 100).join('\n'));
