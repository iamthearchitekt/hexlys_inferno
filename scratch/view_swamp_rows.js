const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');

const levelRe = /name: "The Filth Mire"[\s\S]*?layout: (\[[\s\S]*?\])\s*\}/g;
const m = levelRe.exec(code);
if (m) {
    const layout = JSON.parse(m[1]);
    console.log('Level 3 bottom rows (9, 10, 11):');
    for (let r = 8; r < 12; r++) {
        console.log(`Row ${r}:`, layout[r].slice(0, 100).join(','));
    }
} else {
    console.log('Level 3 layout not found!');
}
