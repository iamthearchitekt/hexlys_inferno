const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('if (this.getTile(c, r) === TILES.PORTAL) {');
if (idx !== -1) {
    // Search backwards for the function name
    let searchIdx = idx;
    while (searchIdx > 0) {
        const chunk = code.substring(searchIdx - 50, searchIdx);
        if (chunk.includes('(') && chunk.includes(')')) {
            console.log(code.substring(searchIdx - 200, idx + 100));
            break;
        }
        searchIdx -= 10;
    }
} else {
    console.log('Portal check not found');
}
