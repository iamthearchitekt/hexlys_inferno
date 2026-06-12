const fs = require('fs');

const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

let found = false;
lines.forEach((line, index) => {
    if (line.includes('currentMaxSpeed') || line.includes('physics.friction')) {
        console.log(`Found on line ${index + 1}: ${line.trim()}`);
        if (!found) {
            found = true;
            console.log('--- Context ---');
            for (let i = Math.max(0, index - 40); i <= Math.min(lines.length - 1, index + 40); i++) {
                console.log(`${i + 1}: ${lines[i]}`);
            }
        }
    }
});
