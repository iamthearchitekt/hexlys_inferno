const fs = require('fs');

// Read the original Github file
const originalCode = fs.readFileSync('scratch/repo_clone/game.js', 'utf8');

// Find the start and end of the original SPRITES object
const startIdx = originalCode.indexOf('const SPRITES = {');
let spritesBlock = '';

if (startIdx !== -1) {
    const hexlyStart = originalCode.indexOf('HEXLY:', startIdx);
    if (hexlyStart !== -1) {
        // Grab everything up to HEXLY
        spritesBlock = originalCode.substring(startIdx, hexlyStart);
        // Add a dummy HEXLY back to prevent the 1MB file size issue
        spritesBlock += 'HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] }\n};\n';
        console.log('Successfully extracted original SPRITES (without Hexly blob).');
    } else {
        console.log('Error: Could not find HEXLY: in original code.');
        process.exit(1);
    }
} else {
    console.log('Error: Could not find const SPRITES = { in original code.');
    process.exit(1);
}

// Now read our current game.js
let currentCode = fs.readFileSync('game.js', 'utf8');

// Replace the handcrafted SPRITES with the extracted one
const currentStartIdx = currentCode.indexOf('const SPRITES = {');
const currentEndIdx = currentCode.indexOf('// 3. SYNTHESIZED 8-BIT AUDIO ENGINE');

if (currentStartIdx !== -1 && currentEndIdx !== -1) {
    currentCode = currentCode.substring(0, currentStartIdx) + spritesBlock + '\n// ----------------------------------------------------\n' + currentCode.substring(currentEndIdx);
    fs.writeFileSync('game.js', currentCode);
    console.log('Successfully patched game.js with the original github graphics!');
} else {
    console.log('Error: Could not find markers in current game.js.');
}
