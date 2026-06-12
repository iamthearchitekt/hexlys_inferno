const fs = require('fs');

const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.toLowerCase().includes('sprint') || line.toLowerCase().includes('run')) {
        // Log the surrounding lines if it looks like code
        if (line.includes('const') || line.includes('let') || line.includes('if') || line.includes('p.vx') || line.includes('input.')) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
        }
    }
});
