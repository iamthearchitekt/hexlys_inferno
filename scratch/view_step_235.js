const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    if (!line.trim()) return;
    try {
        const obj = JSON.parse(line);
        if (obj.step_index === 235) {
            console.log(JSON.stringify(obj, null, 2));
            rl.close();
        }
    } catch (e) {
        // Ignore
    }
});
