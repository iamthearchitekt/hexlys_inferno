const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const fileData = fs.readFileSync(logPath, 'utf8');
const lines = fileData.split('\n');

for (let line of lines) {
    if (!line) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.step_index === 2035) {
            console.log("Keys in step 2035:", Object.keys(obj));
            console.log("Type:", obj.type);
            console.log("Status:", obj.status);
            if (obj.tool_calls) {
                console.log("Tool calls count:", obj.tool_calls.length);
                obj.tool_calls.forEach((tc, idx) => {
                    console.log(`Tool ${idx} name:`, tc.name);
                    console.log(`Tool ${idx} args keys:`, Object.keys(tc.args));
                    const tcStr = JSON.stringify(tc.args);
                    console.log(`Length of args JSON:`, tcStr.length);
                    console.log(`Is it truncated?`, tcStr.includes('truncated'));
                    // Print end of args to see if it was cut off
                    console.log(`End of args:`, tcStr.substring(tcStr.length - 200));
                });
            }
        }
    } catch (e) {
        // ignore
    }
}
