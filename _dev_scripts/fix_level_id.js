const fs = require('fs');

const header = `// ----------------------------------------------------
// HEXLY'S INFERNO ESCAPE - LEVELS
// ----------------------------------------------------
`;

const original = fs.readFileSync('levels.js', 'utf8');
fs.writeFileSync('temp_eval.js', original + '\nmodule.exports = LEVELS;');

const LEVELS = require('./temp_eval.js');

// Change 10 to 15 in Level 2 ONLY
if (LEVELS[1] && LEVELS[1].layout) {
    const layout = LEVELS[1].layout;
    for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
            if (layout[r][c] === 10) {
                layout[r][c] = 15;
            }
        }
    }
}

const newStr = header + 'const LEVELS = ' + JSON.stringify(LEVELS, null, 4) + ';\n';
fs.writeFileSync('levels.js', newStr);

console.log("Fixed tile IDs in levels.js!");
