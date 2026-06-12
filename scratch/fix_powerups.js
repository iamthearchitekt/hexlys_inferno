const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '..', 'levels.js');
const fileStr = fs.readFileSync(levelsPath, 'utf8');

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
    
    let powerupsMoved = 0;
    let powerupsDeleted = 0;
    
    // Scan for 4 (REWARD)
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < layout[0].length; c++) {
            const cell = layout[r][c];
            if (cell === 4) {
                // Check if it can be hit from below
                let rBelow = r + 1;
                const isSolid = (val) => [1, 2, 3, 4, 5, 6, 14].includes(val);
                
                if (rBelow >= 12 || isSolid(layout[rBelow][c])) {
                    // It cannot be hit! Find a suitable spot higher up.
                    let newR = r - 1;
                    let foundSpot = false;
                    while (newR >= 0) {
                        // To place it here, this spot must be empty, AND the spot below it must be empty (or the original spot we are moving from)
                        if (!isSolid(layout[newR][c]) && (newR + 1 === r || !isSolid(layout[newR + 1][c]))) {
                            foundSpot = true;
                            break;
                        }
                        newR--;
                    }
                    
                    layout[r][c] = 0; // Remove from old spot
                    
                    if (foundSpot) {
                        layout[newR][c] = cell;
                        powerupsMoved++;
                    } else {
                        powerupsDeleted++;
                    }
                }
            }
        }
    }
    
    if (powerupsMoved > 0 || powerupsDeleted > 0) {
        console.log(`Processed level: Moved ${powerupsMoved} powerups, Deleted ${powerupsDeleted} powerups.`);
    }
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync(levelsPath, outStr, 'utf8');
console.log('All powerup hit-ability rules applied to all levels!');
