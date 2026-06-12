const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

lines.forEach((line, index) => {
    if (line.includes('camera.x =') || line.includes('camera.x +=') || line.includes('camera.x') && line.includes('Math.')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
