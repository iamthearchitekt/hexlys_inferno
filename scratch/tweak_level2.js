const fs = require('fs');
const fileStr = fs.readFileSync('levels.js', 'utf8');

// Find Level 2 layout
const lvl2Str = 'name: "The Black Gale",';
const idx = fileStr.indexOf(lvl2Str);
if (idx === -1) { console.log('Could not find Level 2'); process.exit(1); }

const layoutStart = fileStr.indexOf('layout: [', idx);
const layoutArrStart = layoutStart + 'layout: '.length;

let open = 0, layoutArrEnd = -1;
for (let i = layoutArrStart; i < fileStr.length; i++) {
    if (fileStr[i] === '[') open++;
    else if (fileStr[i] === ']') {
        open--;
        if (open === 0) {
            layoutArrEnd = i + 1;
            break;
        }
    }
}

let layoutJson = fileStr.slice(layoutArrStart, layoutArrEnd);
let layout = JSON.parse(layoutJson);

// Level 2 is mostly empty space with falling platforms and wind.
// Let's find some solid ground (1) chunks and add stairs (1) on top of them.
for (let r = 2; r < 11; r++) {
    for (let c = 10; c < 300; c++) {
        // Find a solid ground platform
        if (layout[r][c] === 1 && layout[r][c-1] === 0 && layout[r-1][c] === 0) {
            // Found left edge of a platform. Add a stair!
            if (layout[r][c+1] === 1 && layout[r][c+2] === 1) {
                layout[r-1][c] = 1; // stair
            }
        }
        
        // Find right edge of a platform. Add a stair!
        if (layout[r][c] === 1 && layout[r][c+1] === 0 && layout[r-1][c] === 0) {
            if (layout[r][c-1] === 1 && layout[r][c-2] === 1) {
                layout[r-1][c] = 1; // stair
            }
        }
    }
}

// Write back
const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
const newFileStr = fileStr.slice(0, layoutArrStart) + newLayoutStr + fileStr.slice(layoutArrEnd);

fs.writeFileSync('levels.js', newFileStr, 'utf8');
console.log('Level 2 tweaked with stairs and width!');
