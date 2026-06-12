const fs = require('fs');
let data = fs.readFileSync('levels.js', 'utf8');

// The file exports `const LEVELS = [...]`
// Let's find the start of Level 2 layout:
const level2Start = data.indexOf('"name": "Base Level"');
const layoutStart = data.indexOf('layout: [', level2Start);
let openBrackets = 0;
let layoutEnd = -1;

for (let i = layoutStart + 8; i < data.length; i++) {
    if (data[i] === '[') openBrackets++;
    else if (data[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            layoutEnd = i + 1;
            break;
        }
    }
}

const layoutStr = data.substring(layoutStart + 8, layoutEnd);
const layout = eval(layoutStr);

// Add ghosts to Level 2 (Row 6)
const ghostCols = [30, 60, 90, 120, 150, 180, 210, 240];
ghostCols.forEach(c => {
    if (layout[6] && c < layout[6].length && layout[6][c] === 0) {
        layout[6][c] = 10;
    }
});

// Format back to string
let newLayoutStr = '[\n';
layout.forEach((row, r) => {
    newLayoutStr += '            [\n';
    row.forEach((cell, c) => {
        newLayoutStr += `                ${cell}${c < row.length - 1 ? ',' : ''}\n`;
    });
    newLayoutStr += `            ]${r < layout.length - 1 ? ',' : ''}\n`;
});
newLayoutStr += '        ]';

const newData = data.substring(0, layoutStart + 8) + newLayoutStr + data.substring(layoutEnd);
fs.writeFileSync('levels.js', newData);
console.log("Injected ghosts into Level 2!");
