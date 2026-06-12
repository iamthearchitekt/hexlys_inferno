const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '..', 'levels.js');
let outStr = fs.readFileSync(levelsPath, 'utf8');
let currentIdx = 0;
let totalFixed = 0;

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
    
    // Apply gravity to all LAVA (5)
    for (let c = 0; c < layout[0].length; c++) {
        for (let r = 10; r >= 0; r--) {
            if (layout[r][c] === 5) {
                let curR = r;
                while (curR + 1 < 12 && layout[curR + 1][c] === 0) {
                    layout[curR + 1][c] = 5;
                    layout[curR][c] = 0;
                    curR++;
                    totalFixed++;
                }
            }
        }
    }
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync(levelsPath, outStr, 'utf8');
console.log(`Pushed ${totalFixed} floating lava block movements back down!`);
