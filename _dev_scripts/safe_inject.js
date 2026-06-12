const fs = require('fs');

const header = `// ----------------------------------------------------
// HEXLY'S INFERNO ESCAPE - LEVELS
// ----------------------------------------------------
`;

const original = fs.readFileSync('levels.js', 'utf8');
fs.writeFileSync('temp_eval.js', original + '\nmodule.exports = LEVELS;');

const LEVELS = require('./temp_eval.js');

// Add ghosts to Level 2 (Row 6)
if (LEVELS[1] && LEVELS[1].layout) {
    const layout = LEVELS[1].layout;
    const ghostCols = [30, 60, 90, 120, 150, 180, 210, 240];
    ghostCols.forEach(c => {
        if (layout[6] && c < layout[6].length && layout[6][c] === 0) {
            layout[6][c] = 10;
        }
    });
}

const newStr = header + 'const LEVELS = ' + JSON.stringify(LEVELS, null, 4) + ';\n';
fs.writeFileSync('levels.js', newStr);

console.log("Safe injection completed!");
