const fs = require('fs');
let code = fs.readFileSync('levels.js', 'utf8');

const startIdx = code.indexOf('layout: [');
const endIdx = code.indexOf('        ]', startIdx) + 9;
const layoutStr = code.substring(startIdx + 8, endIdx);
let rows = eval(layoutStr);

const colsToAdd = 12;
for (let i = 0; i < rows.length; i++) {
    const tile = (i >= 8) ? 1 : 0;
    const prepend = Array(colsToAdd).fill(tile);
    rows[i] = prepend.concat(rows[i]);
}

let newRowsStr = 'layout: [\n' + rows.map(r => '            [' + r.join(',') + ']').join(',\n') + '\n        ]';
code = code.substring(0, startIdx) + newRowsStr + code.substring(endIdx);
code = code.replace('startX: 200,', 'startX: 740,'); // 200 + 12 * 45 = 740
fs.writeFileSync('levels.js', code);
console.log('Successfully extended level 1!');
