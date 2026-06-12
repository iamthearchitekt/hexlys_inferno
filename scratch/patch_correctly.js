const fs = require('fs');

const origLines = fs.readFileSync('scratch/repo_clone/game.js', 'utf8').split('\n');
let insideSprites = false;
let insideHexly = false;
const spriteLines = [];

for (let i = 0; i < origLines.length; i++) {
    const line = origLines[i];
    
    if (line.includes('const SPRITES = {')) {
        insideSprites = true;
        spriteLines.push(line);
        spriteLines.push('    HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] },');
        continue;
    }
    
    if (insideSprites) {
        if (line.includes('HEXLY: {') && !line.includes('IDLE:')) {
            insideHexly = true;
            continue;
        }
        
        if (insideHexly) {
            if (line.includes('FLOWER: [')) {
                insideHexly = false; // Hexly is over, Flower is starting
                spriteLines.push(line);
            }
            continue;
        }
        
        spriteLines.push(line);
        
        if (line.startsWith('};') && !insideHexly) {
            break; // End of sprites
        }
    }
}

const extractedSprites = spriteLines.join('\n');
console.log('Extracted lines:', spriteLines.length);

// Patch game.js
let currentCode = fs.readFileSync('game.js', 'utf8');
const startIdx = currentCode.indexOf('const SPRITES = {');
const endMarker = '// 3. SYNTHESIZED 8-BIT AUDIO ENGINE';
const endIdx = currentCode.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    // Strip trailing newlines correctly
    const finalCode = currentCode.substring(0, startIdx) + extractedSprites + '\n\n// ----------------------------------------------------\n' + currentCode.substring(endIdx);
    fs.writeFileSync('game.js', finalCode);
    console.log('Patched game.js successfully.');
} else {
    console.log('Error patching game.js');
}
