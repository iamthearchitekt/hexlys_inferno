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
            if (tcStr.includes('isSprinting') || tcStr.includes('runTimer') || tcStr.includes('sprint') || tcStr.includes('acceleration') || tcStr.includes('maxSpeedX')) {
                console.log(`[Line ${lineNum} | Step ${obj.step_index}] Tool: ${tc.name}`);
                // Print the ReplacementContent or CodeContent if small, or show details
                const args = tc.args;
                const codeContent = args.CodeContent || args.ReplacementContent || '';
                if (codeContent) {
                    console.log('--- Code Change ---');
                    console.log(codeContent.substring(0, 1000));
                    console.log('-------------------');
                } else if (args.ReplacementChunks) {
                    console.log('--- Chunks ---');
                    args.ReplacementChunks.forEach(chunk => {
                        console.log(chunk.ReplacementContent.substring(0, 1000));
                    });
                    console.log('--------------');
                }
            }
        });
    } catch (e) {
        // Ignore
    }
});
