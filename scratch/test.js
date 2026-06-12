const fs = require('fs');
let content = fs.readFileSync('./levels.js', 'utf8');
content = content.replace('const LEVELS', 'var LEVELS');

try {
    // Just evaluate it to see if it throws an error
    eval(content);
    console.log("levels.js evaluates successfully. LEVELS length:", LEVELS.length);
    
    for (let i=0; i<LEVELS.length; i++) {
        let l = LEVELS[i].layout;
        let c5 = 0;
        for (let r=0; r<l.length; r++) {
            for (let c=0; c<l[r].length; c++) {
                if (l[r][c] === 5) c5++;
            }
        }
        console.log(`Level ${i} has ${c5} lava blocks.`);
    }
    
    // Also check if any level has weird layout sizes
    for (let i=0; i<LEVELS.length; i++) {
        let l = LEVELS[i].layout;
        if (l.length !== 12) {
            console.log(`Level ${i} has ${l.length} rows instead of 12!`);
        }
        let badCols = false;
        for (let r=0; r<l.length; r++) {
            if (l[r].length !== 320 && l[r].length !== 150) { // some levels might be 150 or 320
                console.log(`Level ${i} row ${r} has ${l[r].length} cols!`);
                badCols = true;
            }
        }
    }
} catch (e) {
    console.error("Error evaluating levels.js:", e);
}
