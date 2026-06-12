const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const fileData = fs.readFileSync(logPath, 'utf8');
const lines = fileData.split('\n');

for (let line of lines) {
    if (!line) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.step_index === 2035) {
            const tc = obj.tool_calls[0];
            console.log("ReplacementChunks count:", tc.args.ReplacementChunks.length);
            tc.args.ReplacementChunks.forEach((chunk, i) => {
                console.log(`Chunk ${i} StartLine:`, chunk.StartLine);
                console.log(`Chunk ${i} EndLine:`, chunk.EndLine);
                console.log(`Chunk ${i} TargetContent length:`, chunk.TargetContent.length);
                console.log(`Chunk ${i} ReplacementContent length:`, chunk.ReplacementContent.length);
                console.log(`Chunk ${i} ReplacementContent:`, chunk.ReplacementContent);
            });
        }
    } catch (e) {
        // ignore
    }
}
