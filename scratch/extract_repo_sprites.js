const fs = require('fs');
const code = fs.readFileSync('scratch/repo_clone/game.js', 'utf8');

const hexlyStart = code.indexOf('HEXLY:');
const hexlyEnd = code.indexOf('    FLOWER: [', hexlyStart);

if (hexlyEnd !== -1) {
    const startIdx = code.indexOf('const SPRITES = {');
    const endIdx = code.indexOf('// 3. SYNTHESIZED 8-BIT AUDIO ENGINE');
    
    const beforeHexly = code.substring(startIdx, hexlyStart);
    const afterHexly = code.substring(hexlyEnd, endIdx);
    
    const combined = beforeHexly + 'HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] },\n' + afterHexly;
    fs.writeFileSync('scratch/extracted_sprites.js', combined);
    console.log('Saved to scratch/extracted_sprites.js');
} else {
    console.log('Error finding hexly boundaries');
}
