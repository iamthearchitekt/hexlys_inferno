const fs = require('fs');
const readline = require('readline');

const path = 'scratch/extracted_code.txt';
if (fs.existsSync(path)) {
    const rl = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: Infinity
    });

    let lineNum = 0;
    rl.on('line', (line) => {
        lineNum++;
        const lower = line.toLowerCase();
        if (lower.includes('sprint') || lower.includes('run') || lower.includes('accel')) {
            if (line.includes('const') || line.includes('let') || line.includes('if') || line.includes('p.vx') || line.includes('input.')) {
                console.log(`[Line ${lineNum}] ${line.trim()}`);
            }
        }
    });
} else {
    console.log('extracted_code.txt does not exist');
}
