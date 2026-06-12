const fs = require('fs');
const readline = require('readline');

const editsPath = 'scratch/all_game_edits.txt';

const rl = readline.createInterface({
    input: fs.createReadStream(editsPath),
    crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    const lower = line.toLowerCase();
    if (lower.includes('run') || lower.includes('speed') || lower.includes('accel') || lower.includes('hold') || lower.includes('direction')) {
        console.log(`[Line ${lineNum}] ${line.substring(0, 180)}`);
    }
});
