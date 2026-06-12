const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const text = fs.readFileSync(logPath, 'utf8');

// Find all occurrences of "const SPRITES = {"
let startIdx = 0;
let bestSnippet = null;

while ((startIdx = text.indexOf('const SPRITES = {', startIdx)) !== -1) {
    let endIdx = text.indexOf('HEXLY:', startIdx);
    if (endIdx !== -1 && (endIdx - startIdx) > 5000) { // The real block is huge
        bestSnippet = text.substring(startIdx, endIdx);
    }
    startIdx += 17;
}

if (bestSnippet) {
    let snippet = bestSnippet.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    let block = snippet + '    HEXLY: { IDLE: [[0]], HURT: [[0]], WIN: [[0]], JUMP: [[0]], RUN_A: [[0]], RUN_B: [[0]] }\n};\n';
    fs.writeFileSync('sprites_recovered.js', block);
    console.log('SUCCESS! Recovered big block.');
} else {
    console.log('NO HUGE BLOCK FOUND');
}
