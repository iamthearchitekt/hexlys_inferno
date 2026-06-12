const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const searchStr = 'game.js?v=3';
let foundLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
        foundLine = i;
        break;
    }
}

if (foundLine !== -1) {
    console.log('Found game.js?v=3 on line:', foundLine + 1);
    for (let j = Math.max(0, foundLine - 2); j < Math.min(lines.length, foundLine + 3); j++) {
        console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
    }
} else {
    console.log('game.js?v=3 not found!');
}
