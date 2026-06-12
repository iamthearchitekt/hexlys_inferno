const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

const searchStr = 'class ParallaxBackground';
let foundLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
        foundLine = i;
        break;
    }
}

if (foundLine !== -1) {
    console.log('Found class ParallaxBackground on line:', foundLine + 1);
    for (let j = Math.max(0, foundLine - 2); j < Math.min(lines.length, foundLine + 40); j++) {
        console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
    }
} else {
    console.log('class ParallaxBackground not found!');
}
