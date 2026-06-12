const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="game-over-screen"');
if (idx !== -1) {
    console.log(html.substring(idx - 100, idx + 600));
} else {
    console.log('game-over-screen not found');
}
