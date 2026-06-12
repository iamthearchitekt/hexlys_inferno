const fs = require('fs');

const E = 0; // Empty
const GR = 1; // Ground
const PR = 6; // Portal

// Create a basic 12x320 layout: Empty air, solid floor at bottom, and a portal at the end.
const grid = Array.from({length: 12}, () => Array(320).fill(E));
for (let c = 0; c < 320; c++) {
    grid[10][c] = GR;
    grid[11][c] = GR;
}
grid[9][312] = PR; // Portal at the end

// Read levels.js
let fileStr = fs.readFileSync('levels.js', 'utf8');

// We need to inject this layout into Level 7, 8, and 9.
// They currently have: layout: [\n            []\n        ]
const basicLayoutStr = '[\n' + grid.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';

fileStr = fileStr.replace(/name: "Level 7",[\s\S]*?layout:\s*\[[\s\S]*?\]/, 'name: "Level 7",\n        background: "background.jpg",\n        startX: 80,\n        startY: 300,\n        layout: ' + basicLayoutStr);
fileStr = fileStr.replace(/name: "Level 8",[\s\S]*?layout:\s*\[[\s\S]*?\]/, 'name: "Level 8",\n        background: "background.jpg",\n        startX: 80,\n        startY: 300,\n        layout: ' + basicLayoutStr);
fileStr = fileStr.replace(/name: "Level 9",[\s\S]*?layout:\s*\[[\s\S]*?\]/, 'name: "Level 9",\n        background: "background.jpg",\n        startX: 80,\n        startY: 300,\n        layout: ' + basicLayoutStr);

fs.writeFileSync('levels.js', fileStr, 'utf8');
console.log('✓ Placeholders filled with basic layouts');
