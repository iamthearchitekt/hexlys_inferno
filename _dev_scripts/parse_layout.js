const fs = require('fs');

const data = fs.readFileSync('levels.js', 'utf8');

// The file exports `const LEVELS = [...]`
// Let's just find the first `layout: [` and the next `]`
const startIdx = data.indexOf('layout: [');
let endIdx = -1;
let openBrackets = 0;
for (let i = startIdx + 8; i < data.length; i++) {
    if (data[i] === '[') openBrackets++;
    else if (data[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            endIdx = i + 1;
            break;
        }
    }
}

const layoutStr = data.substring(startIdx + 8, endIdx);
const layout = eval(layoutStr);

console.log("COLUMNS 150 to 256:");
let header = '     ';
for(let c=150; c<256; c++) header += Math.floor(c/10).toString().slice(-1);
console.log(header);
header = '     ';
for(let c=150; c<256; c++) header += (c%10).toString();
console.log(header);

for (let r = 7; r <= 10; r++) {
    let rowStr = `R${r.toString().padStart(2, ' ')}: `;
    for (let c = 150; c < 256; c++) {
        let val = layout[r][c];
        if (val === 0) rowStr += '.';
        else if (val === 1) rowStr += '1';
        else if (val === 5) rowStr += 'L'; // Lava
        else if (val === 13) rowStr += 'B'; // Boss
        else rowStr += val.toString();
    }
    console.log(rowStr);
}
