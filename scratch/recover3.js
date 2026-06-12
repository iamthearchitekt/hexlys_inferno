const fs = require('fs');
const logPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/.system_generated/logs/transcript.jsonl';
const text = fs.readFileSync(logPath, 'utf8');

let startIdx = 0;
while ((startIdx = text.indexOf('const SPRITES = {', startIdx)) !== -1) {
    let endIdx = text.indexOf('HEXLY:', startIdx);
    if (endIdx !== -1) {
        let snippet = text.substring(startIdx, endIdx);
        // Ensure it contains actual sprite definitions with '.'
        if (snippet.includes('GROUND:') && snippet.includes('........')) {
            snippet = snippet.replace(/\\\\n/g, '\\n').replace(/\\\\"/g, '\\"');
            snippet = snippet.replace(/\\n/g, '\n').replace(/\\"/g, '"');
            fs.writeFileSync('sprites_found.js', snippet + '    HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] }\n};\n');
            console.log('Found it!');
            process.exit(0);
        }
    }
    startIdx += 17;
}
console.log('Not found.');
