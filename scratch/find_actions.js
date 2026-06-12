const fs = require('fs');
const t = fs.readFileSync('C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = t.split('\n');
lines.forEach(l => {
    try {
        if (!l) return;
        const j = JSON.parse(l);
        if (j.content && j.content.includes('game.js') && j.type === 'CODE_ACTION') {
            console.log(`Step ${j.step_index}: CODE_ACTION on game.js. Content length: ${j.content.length}`);
        }
        if (j.content && j.content.includes('levels.js') && j.type === 'CODE_ACTION') {
            console.log(`Step ${j.step_index}: CODE_ACTION on levels.js. Content length: ${j.content.length}`);
        }
    } catch(e) {}
});
