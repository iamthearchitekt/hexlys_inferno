const fs = require('fs');
const txt = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');

let idx = 0;
while (true) {
    idx = txt.indexOf('playOneUp', idx);
    if (idx === -1) idx = txt.indexOf('1up', idx);
    if (idx === -1) idx = txt.indexOf('ONEUP', idx);
    if (idx === -1) break;
    
    // Print around the match if it looks like javascript code modifying game.js
    const start = Math.max(0, idx - 150);
    const end = idx + 600;
    const chunk = txt.substring(start, end);
    if (chunk.includes('function') || chunk.includes('playOneUp') || chunk.includes('ReplacementContent')) {
        console.log(`--- Match at ${idx} ---`);
        console.log(chunk);
    }
    idx += 20;
}
