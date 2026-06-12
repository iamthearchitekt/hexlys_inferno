const fs = require('fs');
const txt = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');

// Search for ONEUP matrix or sprite
let idx = 0;
while (true) {
    idx = txt.indexOf('ONEUP', idx);
    if (idx === -1) break;
    console.log(`--- Match at ${idx} ---`);
    console.log(txt.substring(Math.max(0, idx - 100), idx + 800));
    idx += 5;
}
