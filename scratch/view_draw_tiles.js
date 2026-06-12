const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

// Find drawTiles function in game.js
const startIdx = code.indexOf('drawTiles() {');
if (startIdx !== -1) {
    const endIdx = code.indexOf('    }', startIdx + 20); // rough find
    // Let's find matching brace for drawTiles
    let braceCount = 0;
    let currentIdx = startIdx;
    let foundStart = false;
    while (currentIdx < code.length) {
        if (code[currentIdx] === '{') {
            braceCount++;
            foundStart = true;
        } else if (code[currentIdx] === '}') {
            braceCount--;
            if (foundStart && braceCount === 0) {
                break;
            }
        }
        currentIdx++;
    }
    console.log(code.substring(startIdx, currentIdx + 1));
} else {
    console.log('drawTiles not found');
}
