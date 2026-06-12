const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

for (let j = 1150; j < 1170; j++) {
    console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
}
