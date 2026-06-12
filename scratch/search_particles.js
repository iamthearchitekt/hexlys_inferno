const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

// Find the Particle class
const startIdx = code.indexOf('class Particle {');
if (startIdx !== -1) {
    // Let's print the draw method of Particle
    const drawIdx = code.indexOf('draw(ctx, cameraX) {', startIdx);
    if (drawIdx !== -1) {
        let braceCount = 0;
        let currentIdx = drawIdx;
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
        console.log(code.substring(drawIdx, currentIdx + 1));
    } else {
        console.log('Particle draw method not found');
    }
} else {
    console.log('Particle class not found');
}
