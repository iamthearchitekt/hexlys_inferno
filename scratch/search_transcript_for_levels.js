const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';

if (!fs.existsSync(logPath)) {
    console.error('Log file does not exist at:', logPath);
    process.exit(1);
}

const readline = require('readline');
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
        const text = JSON.stringify(obj);
        if (text.includes('The Black Gale') || text.includes('The Filth Mire') || text.includes('The Infernal Treasury')) {
            console.log(`[Line ${lineNum} | Step ${obj.step_index}] type=${obj.type} source=${obj.source}`);
            // Check if it's a write or replace tool call
            if (obj.tool_calls) {
                obj.tool_calls.forEach(tc => {
                    if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                        console.log(`  Tool Call: ${tc.name}`);
                        if (tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('levels')) {
                            console.log(`    Args:`, tc.args);
                        }
                    }
                });
            }
            if (obj.content && obj.content.length < 2000) {
                console.log(`  Content: ${obj.content.substring(0, 500).replace(/\n/g, ' ')}`);
            }
        }
    } catch (e) {
        // Ignore JSON parse errors
    }
});

rl.on('close', () => {
    console.log('Search complete.');
});
