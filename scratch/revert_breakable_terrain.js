const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '..', 'levels.js');
let fileStr = fs.readFileSync(levelsPath, 'utf8');

// The simplest way to revert 17 to 2 and 3 to 1 in the layout arrays:
// We parse the arrays, change them, and serialize them back.

let outStr = fileStr;
let currentIdx = 0;

while (true) {
    const layoutStart = outStr.indexOf('layout: [', currentIdx);
    if (layoutStart === -1) break;
    
    const layoutArrStart = layoutStart + 'layout: '.length;
    let open = 0, layoutArrEnd = -1;
    for (let i = layoutArrStart; i < outStr.length; i++) {
        if (outStr[i] === '[') open++;
        else if (outStr[i] === ']') {
            open--;
            if (open === 0) {
                layoutArrEnd = i + 1;
                break;
            }
        }
    }
    
    let layoutJson = outStr.slice(layoutArrStart, layoutArrEnd);
    let layout = JSON.parse(layoutJson);
    
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < layout[0].length; c++) {
            if (layout[r][c] === 17) {
                layout[r][c] = 2; // Revert BREAKABLE_GREY back to PLATFORM
            } 
            else if (layout[r][c] === 3) {
                layout[r][c] = 1; // Revert BREAKABLE back to GROUND
            }
        }
    }
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync(levelsPath, outStr, 'utf8');
console.log('Reverted all 17s and 3s back to original states in levels.js.');
