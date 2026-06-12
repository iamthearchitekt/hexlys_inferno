const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');

// Count non-zero tiles in each level's layout to detect placeholders
const LEVELS_re = /name: "([^"]+)"[\s\S]*?layout: (\[[\s\S]*?\])\s*\}/g;
let match;
let i = 0;
while ((match = LEVELS_re.exec(code)) !== null) {
    const name = match[1];
    try {
        const layout = JSON.parse(match[2]);
        const nonZero = layout.reduce((acc, row) => acc + row.filter(t => t !== 0).length, 0);
        const rows = layout.length;
        const cols = layout[0] ? layout[0].length : 0;
        const isPlaceholder = nonZero <= 2 * cols; // only floor rows = placeholder
        console.log(`Level ${i + 1}: "${name}" — ${rows}x${cols}, non-zero tiles: ${nonZero} ${isPlaceholder ? '*** PLACEHOLDER ***' : '✓'}`);
    } catch(e) {
        console.log(`Level ${i + 1}: "${name}" — parse error: ${e.message}`);
    }
    i++;
}
