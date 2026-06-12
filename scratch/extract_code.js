const fs = require('fs');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
    console.error("Log file does not exist at:", logPath);
    process.exit(1);
}

const keywords = ['swamp', 'toxic', 'brick', 'game-over', 'game over', 'friction', 'inertia'];
const fileData = fs.readFileSync(logPath, 'utf8');
const lines = fileData.split('\n');

let output = `Searching code changes in transcript (${lines.length} lines)...\n`;

lines.forEach((line, index) => {
    if (!line) return;
    try {
        const obj = JSON.parse(line);
        // We only care about model steps making tool calls
        if (obj.source !== 'MODEL' || !obj.tool_calls) return;

        obj.tool_calls.forEach(tc => {
            if (['write_to_file', 'replace_file_content', 'multi_replace_file_content'].includes(tc.name)) {
                const tcStr = JSON.stringify(tc);
                const matched = keywords.filter(kw => tcStr.toLowerCase().includes(kw.toLowerCase()));
                if (matched.length > 0) {
                    output += `\n================================================================================\n`;
                    output += `STEP ${obj.step_index}: Tool: ${tc.name} | Matched: [${matched.join(', ')}]\n`;
                    output += `Arguments:\n`;
                    output += JSON.stringify({
                        TargetFile: tc.args.TargetFile || tc.args.TargetFile,
                        Description: tc.args.Description,
                        Instruction: tc.args.Instruction,
                        StartLine: tc.args.StartLine,
                        EndLine: tc.args.EndLine,
                    }, null, 2) + `\n`;
                    
                    // Print parts of the content
                    let content = tc.args.CodeContent || tc.args.ReplacementContent || '';
                    if (tc.name === 'multi_replace_file_content' && tc.args.ReplacementChunks) {
                        content = JSON.stringify(tc.args.ReplacementChunks, null, 2);
                    }
                    
                    if (content) {
                        const linesCount = content.split('\n').length;
                        output += `Content size: ${content.length} characters, ${linesCount} lines.\n`;
                        if (linesCount < 150) {
                            output += `--- Content Start ---\n`;
                            output += content + `\n`;
                            output += `--- Content End ---\n`;
                        } else {
                            output += `--- Content Preview (First 60 lines) ---\n`;
                            output += content.split('\n').slice(0, 60).join('\n') + `\n`;
                            output += `... truncated ${linesCount - 120} lines ...\n`;
                            output += `--- Content Preview (Last 60 lines) ---\n`;
                            output += content.split('\n').slice(-60).join('\n') + `\n`;
                        }
                    }
                }
            }
        });
    } catch (e) {
        // ignore parse error
    }
});

fs.writeFileSync('scratch/extracted_code.txt', output, 'utf8');
console.log("Successfully wrote output to scratch/extracted_code.txt");
