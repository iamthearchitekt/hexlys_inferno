const fs = require('fs');

const path = 'levels.js';
let content = fs.readFileSync(path, 'utf8');

// The file format is `const LEVELS = [\n { ... }, \n { ... } \n];`
// We want to modify the SECOND level object.
const dataStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const levels = eval(dataStr);

const lvl2 = levels[1];
const layout = lvl2.layout;

// Clear existing ghosts (15)
for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
        if (layout[r][c] === 15) {
            layout[r][c] = 0; // replace with empty space
        }
    }
}

// Scatter 25 ghosts!
const width = layout[0].length;
let ghostsAdded = 0;
while(ghostsAdded < 25) {
    const c = Math.floor(Math.random() * (width - 60)) + 30; // Random col between 30 and width-30
    const r = Math.floor(Math.random() * 6) + 2; // Random row in upper air (2 to 7)
    
    if (layout[r][c] === 0) {
        layout[r][c] = 15;
        ghostsAdded++;
    }
}

// Convert back to string
const newLayoutStr = JSON.stringify(levels, null, 4);

// The file format expects `const LEVELS = [\n    ... \n];` but JSON stringify outputs double quotes.
// Since the engine is fine with double quotes, this is perfectly fine.
fs.writeFileSync(path, 'const LEVELS = ' + newLayoutStr + ';\n', 'utf8');
console.log('Successfully scattered 25 ghosts across Level 2!');
