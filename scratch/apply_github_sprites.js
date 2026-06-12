const fs = require('fs');

const spritesBlock = fs.readFileSync('scratch/extracted_sprites.js', 'utf8');
let currentCode = fs.readFileSync('game.js', 'utf8');

const startIdx = currentCode.indexOf('const SPRITES = {');
const endIdx = currentCode.indexOf('// 3. SYNTHESIZED 8-BIT AUDIO ENGINE');

if (startIdx !== -1 && endIdx !== -1) {
    currentCode = currentCode.substring(0, startIdx) + spritesBlock + '\n// ----------------------------------------------------\n' + currentCode.substring(endIdx);
    fs.writeFileSync('game.js', currentCode);
    console.log('Successfully patched game.js with ALL non-Hexly GitHub sprites!');
} else {
    console.log('Could not find markers in game.js');
}
