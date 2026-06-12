const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const startIdx = code.indexOf('update() {');
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
    const func = code.substring(startIdx, currentIdx + 1);
    const lines = func.split('\n');
    console.log(`Total lines: ${lines.length}`);
    // Print lines containing lava or portal
    lines.forEach((l, i) => {
        if (l.includes('Lava') || l.includes('Portal') || l.includes('hazard') || l.includes('SWAMP')) {
            console.log(`Line ${i + 1}: ${l.trim()}`);
        }
    });
    // Print the whole thing if it's short, or a summary.
    console.log("\n--- Preview ---");
    console.log(lines.slice(0, 100).join('\n'));
    console.log("...");
    console.log(lines.slice(-60).join('\n'));
} else {
    console.log('update not found');
}
