const fs = require('fs');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const fileData = fs.readFileSync(logPath, 'utf8');
const lines = fileData.split('\n');

let output = '';

lines.forEach((line, index) => {
    if (!line) return;
    try {
        const obj = JSON.parse(line);
        if (obj.source !== 'MODEL' || !obj.tool_calls) return;

        obj.tool_calls.forEach(tc => {
            const tcStr = JSON.stringify(tc);
            if (tcStr.includes('ONEUP') || tcStr.includes('playOneUp') || tcStr.includes('1up')) {
                output += `================================================================================\n`;
                output += `STEP ${obj.step_index}: Tool: ${tc.name}\n`;
                output += `Arguments:\n${JSON.stringify(tc.args, null, 2)}\n`;
            }
        });
    } catch (e) {
        // ignore
    }
});

fs.writeFileSync('scratch/oneup_code.txt', output, 'utf8');
console.log('Successfully wrote to scratch/oneup_code.txt');
