const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const startIdx = code.indexOf('resolveCollisions() {');
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
    const funcStr = code.substring(startIdx, currentIdx + 1);
    const lines = funcStr.split('\n');
    console.log(lines.slice(-25).join('\n'));
} else {
    console.log('resolveCollisions not found');
}
