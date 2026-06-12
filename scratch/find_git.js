const fs = require('fs');
const t = fs.readFileSync('C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = t.split('\n');
lines.forEach(l => {
    try {
        if (!l) return;
        const j = JSON.parse(l);
        if (j.tool_calls) {
            j.tool_calls.forEach(tc => {
                if (tc.function.name === 'default_api:run_command' && tc.function.arguments.includes('git')) {
                    console.log('Step ' + j.step_index + ': ' + tc.function.arguments.substring(0, 150).replace(/\n/g, ' '));
                }
            });
        }
    } catch(e) {}
});
