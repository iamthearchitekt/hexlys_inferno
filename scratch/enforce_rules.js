const fs = require('fs');

const fileStr = fs.readFileSync('levels.js', 'utf8');

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
    
    let impsMoved = 0;
    let impsDeleted = 0;
    let stackedImpsDeleted = 0;
    let stackedSkeletonsDeleted = 0;
    
    // Rule 1: No Imps over solid ground
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 320; c++) {
            if (layout[r][c] === 9) {
                let hasGroundBelow = false;
                for (let rBelow = r + 1; rBelow < 12; rBelow++) {
                    const t = layout[rBelow][c];
                    if (t === 1 || t === 3) { hasGroundBelow = true; break; }
                }
                
                if (hasGroundBelow) {
                    const isSolid = (val) => [1, 2, 3, 4, 5, 6, 14, 15, 16].includes(val);
                    let shifted = false;
                    for (let offset = 1; offset <= 15; offset++) {
                        // Check left
                        if (c - offset >= 0 && layout[r][c - offset] === 0) {
                            let groundLeft = false;
                            for (let rB = r + 1; rB < 12; rB++) {
                                if (layout[rB][c - offset] === 1 || layout[rB][c - offset] === 3) {
                                    groundLeft = true; break;
                                }
                            }
                            if (!groundLeft) {
                                layout[r][c] = 0; layout[r][c - offset] = 9; shifted = true; impsMoved++; break;
                            }
                        }
                        // Check right
                        if (c + offset < 320 && layout[r][c + offset] === 0) {
                            let groundRight = false;
                            for (let rB = r + 1; rB < 12; rB++) {
                                if (layout[rB][c + offset] === 1 || layout[rB][c + offset] === 3) {
                                    groundRight = true; break;
                                }
                            }
                            if (!groundRight) {
                                layout[r][c] = 0; layout[r][c + offset] = 9; shifted = true; impsMoved++; break;
                            }
                        }
                    }
                    if (!shifted) { layout[r][c] = 0; impsDeleted++; }
                }
            }
        }
    }
    
    // Rule 2 & 3: Never put 2 imps or 2 skeletons on top of each other (same column)
    for (let c = 0; c < 320; c++) {
        let foundImp = false;
        let foundSkeleton = false;
        
        // Scan from top to bottom
        for (let r = 0; r < 12; r++) {
            if (layout[r][c] === 9) { // Imp
                if (foundImp) {
                    layout[r][c] = 0;
                    stackedImpsDeleted++;
                } else {
                    foundImp = true;
                }
            }
            if (layout[r][c] === 8) { // Skeleton
                if (foundSkeleton) {
                    layout[r][c] = 0;
                    stackedSkeletonsDeleted++;
                } else {
                    foundSkeleton = true;
                }
            }
        }
    }
    
    if (impsMoved > 0 || impsDeleted > 0 || stackedImpsDeleted > 0 || stackedSkeletonsDeleted > 0) {
        console.log(`Processed level at index ${currentIdx}: Moved ${impsMoved} imps, Deleted ${impsDeleted} ground-imps, Deleted ${stackedImpsDeleted} stacked-imps, Deleted ${stackedSkeletonsDeleted} stacked-skeletons.`);
    }
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync('levels.js', outStr, 'utf8');
console.log('All enemy stacking rules applied to all levels!');
