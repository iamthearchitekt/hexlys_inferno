const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

// Find jump logic under update()
const idx = code.indexOf('this.player.jumpBufferTimer > 0');
if (idx !== -1) {
    console.log(code.substring(idx - 100, idx + 400));
} else {
    console.log('Jump logic pattern not found');
}
