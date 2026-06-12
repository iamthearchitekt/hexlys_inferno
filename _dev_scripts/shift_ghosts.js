const fs = require('fs');

const code = fs.readFileSync('levels.js', 'utf8');

// Level 2 starts after: "name": "Inferno Gate",
// We can just find all `15,` in the file. Since Ghosts are ONLY in Level 2, we can just remove all 15s.
// Wait! `windSpeed` might be -0.15. We must be careful!
// Let's just find `15` surrounded by commas or spaces.
// Or we can just evaluate the levels array using a safe wrapper!

const wrapper = `
const TILES = {
    EMPTY: 0,
    GROUND: 1,
    PLATFORM: 2,
    LAVA: 3,
    SPIKES: 4,
    CHAIN: 5,
    SKULL_BUG: 8,
    FLYING_SKULL: 9,
    FIRE_IMP: 11,
    BREAKABLE: 12,
    FIREBALL_SPAWNER: 14,
    GHOST: 15
};
const LEVELS = 
`;
const fullCode = wrapper + code.substring(code.indexOf('['), code.indexOf('];') + 1) + '; module.exports = LEVELS;';
fs.writeFileSync('temp_shift.js', fullCode);

const LEVELS = require('./temp_shift.js');
const lvl2 = LEVELS[1];

// Remove all 15s
for (let r = 0; r < lvl2.layout.length; r++) {
    for (let c = 0; c < lvl2.layout[r].length; c++) {
        if (lvl2.layout[r][c] === 15) {
            lvl2.layout[r][c] = 0;
        }
    }
}

// Inject new 15s starting from column 80
// They float, so row 6 is a good height.
const ghostCols = [80, 110, 140, 180, 220, 260, 300, 340, 380, 420];
ghostCols.forEach(c => {
    if (lvl2.layout[6] && c < lvl2.layout[6].length) {
        lvl2.layout[6][c] = 15;
    }
});

// Since levels.js is not pure JSON, we stringify and replace the layout part for Level 2 ONLY.
let layoutStr = JSON.stringify(lvl2.layout, null, 4);

// Replace the layout in levels.js using a regex or split
const parts = code.split('"name": "Base Level",');
const p1 = parts[0];
const p2 = parts[1];

// p1 contains Level 2's layout. We need to replace everything after `"layout": [` until the matching `],`
const layoutStart = p1.lastIndexOf('"layout":');
const beforeLayout = p1.substring(0, layoutStart + 9);
const afterLayout = p1.substring(p1.indexOf(']', layoutStart) + 2); // wait, it's an array of arrays!
// So it ends at `    ]` right before `}`

const layoutRegex = /"layout":\s*\[[\s\S]*?\n\s{4}\]/;
const newP1 = p1.replace(layoutRegex, '"layout": ' + layoutStr);

fs.writeFileSync('levels.js', newP1 + '"name": "Base Level",' + p2);
console.log("Shifted ghosts to start at column 80!");
