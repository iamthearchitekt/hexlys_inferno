const fs = require('fs');

const fileStr = fs.readFileSync('levels.js', 'utf8');

// The file format is `const LEVELS = [ { name: "...", layout: [...] }, ... ]; if (...) module.exports = ...`
// To safely parse and stringify without breaking the formatting completely,
// we can execute the file to get the object, modify the arrays, and rewrite.

// But require() will give us the object, how do we write it back with the same exact layout spacing?
// We can just iterate through the text or use JSON.stringify but that ruins the 2D array formatting.
// Let's parse it manually.

let outStr = fileStr;

// Find all `layout: [` arrays and process them.
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
    
    // Process the layout!
    let impsMoved = 0;
    let impsDeleted = 0;
    
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 320; c++) {
            if (layout[r][c] === 9) { // 9 is IM (Flying Imp)
                // Check if there is solid ground below it
                let hasGroundBelow = false;
                for (let rBelow = r + 1; rBelow < 12; rBelow++) {
                    const t = layout[rBelow][c];
                    if (t === 1 || t === 3) { // 1 is GR, 3 is BK
                        hasGroundBelow = true;
                        break;
                    }
                }
                
                if (hasGroundBelow) {
                    // Try to shift it left or right to a valid column
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
                                layout[r][c] = 0;
                                layout[r][c - offset] = 9;
                                shifted = true;
                                impsMoved++;
                                break;
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
                                layout[r][c] = 0;
                                layout[r][c + offset] = 9;
                                shifted = true;
                                impsMoved++;
                                break;
                            }
                        }
                    }
                    
                    // If we couldn't shift it within 15 blocks, delete it
                    if (!shifted) {
                        layout[r][c] = 0;
                        impsDeleted++;
                    }
                }
            }
        }
    }
    
    if (impsMoved > 0 || impsDeleted > 0) {
        console.log(`Processed level at index ${currentIdx}: Moved ${impsMoved} imps, Deleted ${impsDeleted} imps.`);
    }
    
    const newLayoutStr = '[\n' + layout.map(row => '            [' + row.join(',') + ']').join(',\n') + '\n        ]';
    outStr = outStr.slice(0, layoutArrStart) + newLayoutStr + outStr.slice(layoutArrEnd);
    
    // Advance index
    currentIdx = layoutStart + 'layout: '.length + newLayoutStr.length;
}

fs.writeFileSync('levels.js', outStr, 'utf8');
console.log('Imp logic rule applied to all levels!');
