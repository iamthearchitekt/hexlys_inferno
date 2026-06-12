const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

for (let j = 460; j < 480; j++) {
    console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
}
