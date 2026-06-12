const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const text = fs.readFileSync(logPath, 'utf8');

const startStr = 'const SPRITES = {';
const endStr = '// 3. SYNTHESIZED 8-BIT AUDIO ENGINE';

let startIdx = 0;
let bestBlock = null;

while ((startIdx = text.indexOf(startStr, startIdx)) !== -1) {
    const endIdx = text.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        let block = text.substring(startIdx, endIdx);
        // Clean JSON escaping safely
        block = block.replace(/\\\\n/g, '\\n').replace(/\\\\"/g, '\\"');
        block = block.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        
        // We want the block that actually contains LAVA_A pixel data (lots of strings)
        if (block.includes('LAVA_A:') && block.includes('WINGED_SKULL:') && block.includes('........')) {
            const hexlyStart = block.indexOf('HEXLY:');
            if (hexlyStart !== -1) {
                block = block.substring(0, hexlyStart) + 'HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] }\n};\n';
            }
            bestBlock = block;
            break;
        }
    }
    startIdx += 17;
}

if (bestBlock) {
    fs.writeFileSync('original_sprites.js', bestBlock);
    console.log('SUCCESS');
} else {
    console.log('FAILED');
}
