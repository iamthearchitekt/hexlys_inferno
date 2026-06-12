const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    if (!line.trim()) return;
    try {
        const obj = JSON.parse(line);
        const text = JSON.stringify(obj).toLowerCase();
        if (text.includes('run') || text.includes('speed') || text.includes('accel') || text.includes('hold') || text.includes('direction')) {
            if (obj.content && obj.content.includes('Step')) {
                console.log(`[Line ${lineNum} | Step ${obj.step_index}] source=${obj.source}`);
                console.log(`  Summary: ${obj.content.substring(0, 300).replace(/\n/g, ' ')}`);
            }
        }
    } catch (e) {
        // Ignore
    }
});
