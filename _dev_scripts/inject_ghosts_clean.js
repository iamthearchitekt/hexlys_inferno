const fs = require('fs');
let data = fs.readFileSync('levels.js', 'utf8');

// Level 2 layout starts right after "name": "Base Level"
let startIdx = data.indexOf('"name": "Base Level"');
if (startIdx !== -1) {
    // Find the second row of the layout (which is row 1)
    // Actually, let's just replace a specific pattern in Level 2.
    // Let's insert at columns around 30, 60, 90, 120 in row 6 of Level 2.
    // The matrix is formatted with each number on its own line:
    //                 0,
    //                 0,
    // So we can't easily do it by regex.
    
    // Let's just append `module.exports = LEVELS;` dynamically and require it!
    const tempFile = 'levels_temp2.js';
    fs.writeFileSync(tempFile, data + '\nmodule.exports = LEVELS;');
    
    const LEVELS = require('./' + tempFile);
    const layout = LEVELS[1].layout;
    
    const ghostCols = [30, 60, 90, 120, 150, 180, 210, 240];
    ghostCols.forEach(c => {
        if (layout[6] && c < layout[6].length && layout[6][c] === 0) {
            layout[6][c] = 10;
        }
    });
    
    // Re-stringify JUST Level 2 layout
    let newLayoutStr = '[\n';
    layout.forEach((row, r) => {
        newLayoutStr += '            [\n';
        row.forEach((cell, c) => {
            newLayoutStr += `                ${cell}${c < row.length - 1 ? ',' : ''}\n`;
        });
        newLayoutStr += `            ]${r < layout.length - 1 ? ',' : ''}\n`;
    });
    newLayoutStr += '        ]';
    
    // Replace the old layout string
    const layoutStart = data.indexOf('layout: [', startIdx);
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
    
    const newData = data.substring(0, layoutStart + 8) + newLayoutStr + data.substring(layoutEnd);
    fs.writeFileSync('levels.js', newData);
    console.log("Injected ghosts cleanly!");
}
