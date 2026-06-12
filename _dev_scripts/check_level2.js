const fs = require('fs');

const code = fs.readFileSync('levels.js', 'utf8');

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
fs.writeFileSync('temp_check.js', fullCode);

const LEVELS = require('./temp_check.js');
const lvl2 = LEVELS[1];

let ghostCount = 0;
let ghostPositions = [];

for (let r = 0; r < lvl2.layout.length; r++) {
    for (let c = 0; c < lvl2.layout[r].length; c++) {
        if (lvl2.layout[r][c] === 15) {
            ghostCount++;
            ghostPositions.push(`(col: ${c}, row: ${r})`);
        }
    }
}

console.log(`Level 2 Layout Size: ${lvl2.layout[0].length} columns x ${lvl2.layout.length} rows`);
console.log(`Found ${ghostCount} ghosts at:`, ghostPositions.join(', '));
