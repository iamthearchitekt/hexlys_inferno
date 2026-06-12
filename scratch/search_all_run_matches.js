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
        if (obj.source !== 'MODEL' || !obj.tool_calls) return;

        obj.tool_calls.forEach(tc => {
            const tcStr = JSON.stringify(tc);
            // Specifically target the physics/acceleration/sprint changes
            if (tcStr.includes('isSprinting') && (tcStr.includes('acceleration') || tcStr.includes('currentMaxSpeed'))) {
                console.log(`[Line ${lineNum} | Step ${obj.step_index}] Tool: ${tc.name}`);
                const args = tc.args;
                const codeContent = args.CodeContent || args.ReplacementContent || '';
                if (codeContent) {
                    console.log('--- Code Change ---');
                    console.log(codeContent);
                    console.log('-------------------');
                } else if (args.ReplacementChunks) {
                    console.log('--- Chunks ---');
                    args.ReplacementChunks.forEach(chunk => {
                        console.log(chunk.ReplacementContent);
                    });
                    console.log('--------------');
                }
            }
        });
    } catch (e) {
        // Ignore
    }
});
