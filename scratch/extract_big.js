const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let bestLength = 0;
let bestStr = null;

for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    try {
        const obj = JSON.parse(lines[i]);
        if (obj.content && obj.content.includes('const SPRITES = {') && !obj.content.includes('node -e')) {
            const content = obj.content;
            if (content.length > bestLength) {
                bestLength = content.length;
                bestStr = content;
            }
        }
    } catch(e) {}
}

if (bestStr) {
    fs.writeFileSync('biggest_sprites.txt', bestStr);
    console.log('Saved biggest match: ' + bestLength + ' characters.');
} else {
    console.log('Not found.');
}
