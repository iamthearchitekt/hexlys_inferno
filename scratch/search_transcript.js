const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
    console.error("Log file does not exist at:", logPath);
    process.exit(1);
}

const keywords = ['swamp', 'toxic', 'brick', 'game over', 'game-over', 'control', 'friction', 'inertia'];
const fileData = fs.readFileSync(logPath, 'utf8');
const lines = fileData.split('\n');

console.log(`Total lines in transcript: ${lines.length}`);

const matches = [];
lines.forEach((line, index) => {
    if (!line) return;
    try {
        const obj = JSON.parse(line);
        const contentStr = JSON.stringify(obj);
        const matchedKeywords = keywords.filter(kw => contentStr.toLowerCase().includes(kw.toLowerCase()));
        if (matchedKeywords.length > 0) {
            matches.push({
                lineNum: index + 1,
                stepIndex: obj.step_index,
                source: obj.source,
                type: obj.type,
                keywords: matchedKeywords,
                summary: (obj.content || '').substring(0, 150).replace(/\n/g, ' '),
                toolCalls: obj.tool_calls ? obj.tool_calls.map(tc => tc.name).join(', ') : ''
            });
        }
    } catch (e) {
        // ignore JSON parse errors
    }
});

console.log(`Found ${matches.length} matching steps.`);
matches.slice(-50).forEach(m => {
    console.log(`Step ${m.stepIndex} (${m.source} | ${m.type}): matched [${m.keywords.join(', ')}] | Tools: ${m.toolCalls} | Summary: ${m.summary}`);
});
