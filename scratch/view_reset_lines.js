const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

const searchStr = 'resetGame() {';
let foundLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
        foundLine = i;
        break;
    }
}

if (foundLine !== -1) {
    console.log('Found resetGame() { on line:', foundLine + 1);
    for (let j = Math.max(0, foundLine - 15); j < Math.min(lines.length, foundLine + 25); j++) {
        console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
    }
} else {
    console.log('resetGame() { not found!');
}
