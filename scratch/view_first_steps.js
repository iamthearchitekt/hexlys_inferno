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
    if (lineNum > 40) {
        rl.close();
        return;
    }
    try {
        const obj = JSON.parse(line);
        console.log(`[Line ${lineNum}] type=${obj.type} source=${obj.source}`);
        if (obj.content) {
            console.log(`  Content: ${obj.content.substring(0, 300)}`);
        }
        if (obj.tool_calls) {
            console.log(`  Tools: ${JSON.stringify(obj.tool_calls)}`);
        }
    } catch (e) {
        console.log(`[Line ${lineNum}] error parsing`);
    }
});
