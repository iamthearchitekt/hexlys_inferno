const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    try {
        const entry = JSON.parse(lines[i]);
        if (entry.content && typeof entry.content === 'string') {
            const content = entry.content;
            // It must contain the specific strings from the real SPRITES definition
            if (content.includes('const SPRITES = {') && 
                content.includes('TILES: {') && 
                content.includes('LAVA_A: [') &&
                content.includes('................') && 
                !content.includes('node -e')) {
                
                const start = content.indexOf('const SPRITES = {');
                const end = content.indexOf('HEXLY:', start);
                if (end > start) {
                    let block = content.substring(start, end) + 'HEXLY: { IDLE: [[0]], HURT: [[0]], WIN: [[0]], JUMP: [[0]], RUN_A: [[0]], RUN_B: [[0]] }\n};\n';
                    fs.writeFileSync('sprites_recovered.js', block);
                    console.log('SUCCESS! Found the real sprites block.');
                    process.exit(0);
                }
            }
        }
    } catch(e) {}
}
console.log('FAILED to find real sprites.');
