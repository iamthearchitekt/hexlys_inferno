const fs = require('fs');
const LEVELS = require('./temp_shift.js');

const lvl2 = LEVELS[1];

// 1. Remove all old ghosts from Level 2
for (let r = 0; r < lvl2.layout.length; r++) {
    for (let c = 0; c < lvl2.layout[r].length; c++) {
        if (lvl2.layout[r][c] === 15) {
            lvl2.layout[r][c] = 0;
        }
    }
}

// 2. Add new ghosts to Level 2 starting deep (column 80+)
// Row 6 is an empty floating space which works well for ghosts
const ghostCols = [80, 110, 140, 180, 220, 240];
ghostCols.forEach(c => {
    if (lvl2.layout[6] && c < lvl2.layout[6].length) {
        lvl2.layout[6][c] = 15;
    }
});

let newCode = `// Level Design Configuration
const LEVELS = ${JSON.stringify(LEVELS, null, 4)};
`;

fs.writeFileSync('levels.js', newCode);
console.log("Restored levels.js and injected ghosts properly!");
