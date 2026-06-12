const fs = require('fs');

const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');
const lines = content.split('\n');

console.log('--- Printing lines 2420 to 2520 ---');
for (let i = 2420; i <= 2520; i++) {
    if (lines[i]) {
        console.log(`${i}: ${lines[i]}`);
    }
}
