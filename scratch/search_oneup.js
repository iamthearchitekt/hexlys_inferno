const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

let idx = 0;
while (true) {
    idx = code.indexOf('TILES.ONEUP', idx);
    if (idx === -1) break;
    console.log(`--- Match at ${idx} ---`);
    console.log(code.substring(Math.max(0, idx - 150), idx + 250));
    idx += 11;
}
