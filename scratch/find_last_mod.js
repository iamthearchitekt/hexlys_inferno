const fs = require('fs');
const t = fs.readFileSync('C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = t.split('\n');
let lastMod = -1;
lines.forEach(l => {
    try {
        if (!l) return;
        const j = JSON.parse(l);
        if (j.tool_calls) {
            j.tool_calls.forEach(tc => {
                if (tc.function.name.includes('replace_file_content') && tc.function.arguments.includes('"TargetFile":"C:\\\\Users\\\\archi\\\\.gemini\\\\antigravity\\\\scratch\\\\hexlys_inferno\\\\game.js"')) {
                    lastMod = j.step_index;
                }
            });
        }
    } catch(e) {}
});
console.log('Last replace_file_content on game.js at step: ' + lastMod);
