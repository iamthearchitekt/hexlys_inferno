const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const matches = [];
const re = /new\s+GameEngine/gi;
let m;
while ((m = re.exec(code)) !== null) {
    const idx = m.index;
    matches.push(code.substring(idx - 100, idx + 100));
}
console.log('new GameEngine matches:', matches);

const globals = [];
const lines = code.split('\n');
lines.forEach((line, i) => {
    if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
        if (line.includes('GameEngine') || line.includes('engine') || line.includes('game')) {
            if (line.length < 150) {
                globals.push(`${i + 1}: ${line.trim()}`);
            }
        }
    }
});
console.log('Variables relating to engine/game:', globals.slice(0, 30));
