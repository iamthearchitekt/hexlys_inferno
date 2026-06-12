const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const startIdx = code.indexOf('function drawPixelMatrix(');
if (startIdx !== -1) {
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
    console.log('drawPixelMatrix not found');
}
