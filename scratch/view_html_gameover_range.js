const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

lines.forEach((l, i) => {
    if (l.includes('Game Over Screen Overlay') || l.includes('game-over-screen') || l.includes('retry-btn')) {
        console.log(`L${i+1}: ${l}`);
    }
});
