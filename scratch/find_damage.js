const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

const searchStr = 'damagePlayer() {';
const searchStrParams = 'damagePlayer(';
let foundLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr) || lines[i].includes(searchStrParams)) {
        if (lines[i].includes('class GameEngine') || lines[i].includes('function') || lines[i].includes('damagePlayer(')) {
            foundLine = i;
            // Let's make sure it's the GameEngine method and not a call
            if (lines[i].trim().startsWith('damagePlayer(')) {
                break;
            }
        }
    }
}

if (foundLine !== -1) {
    console.log('Found damagePlayer on line:', foundLine + 1);
    for (let j = Math.max(0, foundLine - 2); j < Math.min(lines.length, foundLine + 8); j++) {
        console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
    }
} else {
    console.log('damagePlayer not found!');
}
