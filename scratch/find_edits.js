const fs = require('fs');
const t = fs.readFileSync('C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = t.split('\n');
lines.forEach(l => {
    try {
        if (!l) return;
        const j = JSON.parse(l);
        if (j.tool_calls) {
            j.tool_calls.forEach(tc => {
                const args = tc.function.arguments;
                if (args && (args.includes('game.js') || args.includes('levels.js'))) {
                    if (tc.function.name === 'default_api:replace_file_content' || 
                        tc.function.name === 'default_api:multi_replace_file_content' ||
                        tc.function.name === 'default_api:write_to_file') {
                        console.log(`Step ${j.step_index}: ${tc.function.name} to ${args.substring(0, 100).replace(/\n/g, ' ')}`);
                    }
                    if (tc.function.name === 'default_api:run_command' && args.includes('fs.write')) {
                        console.log(`Step ${j.step_index}: run_command fs.write ${args.substring(0, 100).replace(/\n/g, ' ')}`);
                    }
                }
            });
        }
    } catch(e) {}
});
