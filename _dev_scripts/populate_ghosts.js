const fs = require('fs');

const path = 'levels.js';
let content = fs.readFileSync(path, 'utf8');

// Level 2 is the SECOND element in the LEVELS array.
// I can parse it by finding "name": "The Ashen Wastes"
const lvl2Start = content.indexOf('"name": "The Ashen Wastes"');
if (lvl2Start === -1) {
    console.error("Could not find Level 2!");
    process.exit(1);
}

const layoutStart = content.indexOf('layout: [', lvl2Start);
const layoutEnd = content.indexOf('],', layoutStart);
const layoutStr = content.substring(layoutStart, layoutEnd + 1);

// Parse the array
let layout = eval('(' + layoutStr.replace('layout: ', '') + ')');

// Clear existing ghosts (15)
for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
        if (layout[r][c] === 15) {
            layout[r][c] = 0; // replace with empty space
        }
    }
}

// Add way more ghosts! Let's scatter 25 ghosts!
const width = layout[0].length;
let ghostsAdded = 0;
while(ghostsAdded < 25) {
    // Pick a random column between 30 and width-20
    const c = Math.floor(Math.random() * (width - 50)) + 30;
    // Pick a random row in the upper empty space (rows 2 to 6)
    const r = Math.floor(Math.random() * 5) + 2;
    
    if (layout[r][c] === 0) {
        layout[r][c] = 15;
        ghostsAdded++;
    }
}

// Convert back to string
const newLayoutStr = 'layout: [\n' + layout.map(row => '        [' + row.join(',') + ']').join(',\n') + '\n    ]';
content = content.substring(0, layoutStart) + newLayoutStr + content.substring(layoutEnd + 1);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully scattered 25 ghosts across Level 2!');
