const fs = require('fs');

if (fs.existsSync('game_recovered.js')) {
    const code = fs.readFileSync('game_recovered.js', 'utf8');
    const lines = code.split('\n');
    let found = false;
    lines.forEach((line, index) => {
        if (line.includes('currentMaxSpeed') || line.includes('physics.friction') || line.includes('accel') || line.includes('run') || line.includes('sprint')) {
            if (line.includes('const') || line.includes('let') || line.includes('if') || line.includes('p.vx') || line.includes('input.')) {
                console.log(`Found on line ${index + 1}: ${line.trim()}`);
                if (!found && (line.includes('currentMaxSpeed') || line.includes('vx'))) {
                    found = true;
                    console.log('--- Context ---');
                    for (let i = Math.max(0, index - 25); i <= Math.min(lines.length - 1, index + 25); i++) {
                        console.log(`${i + 1}: ${lines[i]}`);
                    }
                }
            }
        }
    });
} else {
    console.log('game_recovered.js does not exist');
}
