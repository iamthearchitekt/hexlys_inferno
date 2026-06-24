const fs = require('fs');
let c = fs.readFileSync('C:/Users/archi/.gemini/antigravity/scratch/hexlys_inferno/levels.js', 'utf8')
    .replace('export default LEVELS;', '')
    .replace('const LEVELS =', 'global.LEVELS =');
eval(c);

// Compare level 2 and level 3 layouts
const l2 = global.LEVELS.find(l => l.id === 2);
const l3 = global.LEVELS.find(l => l.id === 3);

console.log('Level 2:', l2.name, '| rows:', l2.layout.length, '| cols:', l2.layout[0].length);
console.log('Level 3:', l3.name, '| rows:', l3.layout.length, '| cols:', l3.layout[0].length);

// Are the layouts identical?
const l2str = JSON.stringify(l2.layout);
const l3str = JSON.stringify(l3.layout);
console.log('\nLayouts identical?', l2str === l3str);

// Also compare with level_saves
const save2 = JSON.parse(fs.readFileSync('level_saves/level2_export.json', 'utf8'));
const save3 = JSON.parse(fs.readFileSync('level_saves/level3_export.json', 'utf8'));
console.log('\nLevel 2 in levels.js matches level2_export?', l2str === JSON.stringify(save2));
console.log('Level 2 in levels.js matches level3_export?', l2str === JSON.stringify(save3));
console.log('Level 3 in levels.js matches level3_export?', l3str === JSON.stringify(save3));
console.log('Level 3 in levels.js matches level2_export?', l3str === JSON.stringify(save2));
