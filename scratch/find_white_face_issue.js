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
        if (text.includes('white') || text.includes('face') || text.includes('trim') || text.includes('outline') || text.includes('halo')) {
            console.log(`[Line ${lineNum} | Step ${obj.step_index}] source=${obj.source}`);
            if (obj.content) {
                console.log(`  Content: ${obj.content.substring(0, 300).replace(/\n/g, ' ')}`);
            }
        }
    } catch (e) {
        // Ignore
    }
});
