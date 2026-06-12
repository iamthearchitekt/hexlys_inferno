const fs = require('fs');

const content = fs.readFileSync('levels.js', 'utf8');
const levelsStr = content.substring(content.indexOf('const LEVELS = '));
// Make it globally accessible for the script
eval(levelsStr.replace('const LEVELS = ', 'global.LEVELS = '));

const lvl1Width = global.LEVELS[0].layout[0].length;
console.log(`Level 1 width: ${lvl1Width}`);

const lvl2Width = global.LEVELS[1].layout[0].length;
console.log(`Level 2 width: ${lvl2Width}`);

if (lvl2Width > lvl1Width) {
    for(let r=0; r<global.LEVELS[1].layout.length; r++) {
        global.LEVELS[1].layout[r] = global.LEVELS[1].layout[r].slice(0, lvl1Width);
    }
    
    let portalReadded = false;
    for(let r=global.LEVELS[1].layout.length - 1; r > 0; r--) {
        if (global.LEVELS[1].layout[r][lvl1Width - 2] === 1) { 
            global.LEVELS[1].layout[r - 1][lvl1Width - 2] = 6; 
            portalReadded = true;
            break;
        }
    }
    
    if (!portalReadded) {
        global.LEVELS[1].layout[11][lvl1Width - 2] = 6;
        global.LEVELS[1].layout[12][lvl1Width - 2] = 1;
        global.LEVELS[1].layout[12][lvl1Width - 3] = 1;
        global.LEVELS[1].layout[12][lvl1Width - 4] = 1;
    }

    const newStr = 'const LEVELS = ' + JSON.stringify(global.LEVELS, null, 4) + ';\n';
    fs.writeFileSync('levels.js', content.substring(0, content.indexOf('const LEVELS = ')) + newStr);
    console.log('Truncated Level 2 and saved to levels.js');
} else {
    console.log('Level 2 is already equal or smaller');
}
