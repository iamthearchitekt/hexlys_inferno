const fs = require('fs');

const content = fs.readFileSync('levels.js', 'utf8');
const levelsStr = content.substring(content.indexOf('const LEVELS = '));
eval(levelsStr.replace('const LEVELS = ', 'global.LEVELS = '));

const lvl1Width = global.LEVELS[0].layout[0].length;
const lvl2Width = global.LEVELS[1].layout[0].length;

console.log(`Lvl1 width: ${lvl1Width}, Lvl2 width: ${lvl2Width}`);

// Let's copy the last 30 columns from Level 1 to Level 2
const bossAreaWidth = 30;

for (let r = 0; r < global.LEVELS[0].layout.length; r++) {
    for (let c = lvl1Width - bossAreaWidth; c < lvl1Width; c++) {
        global.LEVELS[1].layout[r][c] = global.LEVELS[0].layout[r][c];
    }
}

// Add the windDelay to Level 2
global.LEVELS[1].windDelay = 180;

const newStr = 'const LEVELS = ' + JSON.stringify(global.LEVELS, null, 4) + ';\n';
fs.writeFileSync('levels.js', content.substring(0, content.indexOf('const LEVELS = ')) + newStr);
console.log('Successfully copied the boss area to Level 2 and set windDelay!');
