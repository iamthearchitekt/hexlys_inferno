const fs = require('fs');
const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');

let idx = 0;
while (true) {
    idx = txt.indexOf('spawnOneUpEmber', idx);
    if (idx === -1) break;
    console.log(`--- Match at ${idx} ---`);
    console.log(txt.substring(Math.max(0, idx - 100), idx + 800));
    idx += 15;
}
