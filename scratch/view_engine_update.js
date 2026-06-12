const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const engineIdx = code.indexOf('class GameEngine {');
if (engineIdx !== -1) {
    const updateIdx = code.indexOf('update() {', engineIdx);
    if (updateIdx !== -1) {
        let braceCount = 0;
        let currentIdx = updateIdx;
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
        const funcStr = code.substring(updateIdx, currentIdx + 1);
        const lines = funcStr.split('\n');
        console.log(`Total lines in GameEngine.update: ${lines.length}`);
        
        // Print lines that mention Lava, Portal, SWAMP
        lines.forEach((l, i) => {
            if (l.includes('Lava') || l.includes('Portal') || l.includes('hazard') || l.includes('SWAMP') || l.includes('LAVA')) {
                console.log(`Line ${i + 1}: ${l.trim()}`);
            }
        });
        
        console.log("\n--- Preview of first 100 lines ---");
        console.log(lines.slice(0, 100).join('\n'));
        console.log("\n--- Preview of last 60 lines ---");
        console.log(lines.slice(-60).join('\n'));
    } else {
        console.log('GameEngine update method not found');
    }
} else {
    console.log('GameEngine class not found');
}
