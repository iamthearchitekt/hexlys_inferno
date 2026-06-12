const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '..', 'levels.js');
const fileStr = fs.readFileSync(levelsPath, 'utf8');

let outStr = fileStr;
let currentIdx = 0;
let totalReplaced = 0;

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
    
    let replacedInLevel = 0;
    
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < layout[0].length; c++) {
            // Replace ~10% of PLATFORM (2) with BREAKABLE_GREY (17)
            if (layout[r][c] === 2 && Math.random() < 0.10) {
                layout[r][c] = 17;
                replacedInLevel++;
                totalReplaced++;
            } 
            // Replace ~8% of GROUND (1) with BREAKABLE (3)
            else if (layout[r][c] === 1 && Math.random() < 0.08) {
                // Ensure there is solid ground below it (1 or 3) so breaking it doesn't create an instant death hole
                if (r < 11 && (layout[r+1][c] === 1 || layout[r+1][c] === 3)) {
                    layout[r][c] = 3;
                    replacedInLevel++;
                    totalReplaced++;
                }
            }
        }
    }
    
    console.log(`Replaced ${replacedInLevel} unbreakable blocks in level.`);
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync(levelsPath, outStr, 'utf8');
console.log(`Success! Replaced a total of ${totalReplaced} unbreakable blocks with matching breakable variants across all levels.`);
