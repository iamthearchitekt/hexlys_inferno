const fs = require('fs');
const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');

let idx = 0;
while (true) {
    idx = txt.indexOf('tree1', idx);
    if (idx === -1) idx = txt.indexOf('tree2', idx);
    if (idx === -1) break;
    
    console.log(`--- Match at ${idx} ---`);
    console.log(txt.substring(Math.max(0, idx - 150), idx + 600));
    idx += 10;
}
