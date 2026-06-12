const fs = require('fs');

let code = fs.readFileSync('levels.js', 'utf8');

// We need to find the Level 2 object.
// Level 1 name is "Inferno Gate", Level 2 name is "Base Level"
let lvl2Start = code.indexOf('"name": "Base Level"');
if (lvl2Start === -1) {
    console.error("Could not find Level 2!");
    process.exit(1);
}

// Find the layout array within Level 2
let layoutStart = code.indexOf('"layout": [', lvl2Start);
let layoutEnd = code.indexOf(']', layoutStart);
// Wait, layout is an array of arrays! So the end is not the first ']', it's the matching ']'
let bracketCount = 0;
let endIndex = -1;
for (let i = layoutStart + 9; i < code.length; i++) {
    if (code[i] === '[') bracketCount++;
    if (code[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex !== -1) {
    let layoutStr = code.substring(layoutStart + 9, endIndex + 1);
    
    // Parse the layout
    let layout = JSON.parse(layoutStr);
    
    // Remove all 15s
    for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
            if (layout[r][c] === 15) {
                layout[r][c] = 0;
            }
        }
    }
    
    // Add new 15s
    const ghostCols = [80, 110, 140, 170, 200, 230];
    ghostCols.forEach(c => {
        if (layout[6] && c < layout[6].length) {
            layout[6][c] = 15;
        }
    });
    
    // Stringify and replace
    let newLayoutStr = JSON.stringify(layout, null, 4);
    
    // But JSON stringify formats nested arrays nicely? No, it formats them multi-line.
    // Let's compact the inner arrays so it's readable.
    let compactLayoutStr = '[\n' + layout.map(row => '            [' + row.join(', ') + ']').join(',\n') + '\n        ]';
    
    let newCode = code.substring(0, layoutStart + 9) + compactLayoutStr + code.substring(endIndex + 1);
    fs.writeFileSync('levels.js', newCode);
    console.log("Rewrote Level 2 layout successfully!");
} else {
    console.error("Could not find layout end!");
}
