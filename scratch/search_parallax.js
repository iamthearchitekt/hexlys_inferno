const fs = require('fs');

const content = fs.readFileSync('game.js', 'utf8');
const idx = content.indexOf('class ParallaxBackground');
if (idx !== -1) {
    console.log('=== ParallaxBackground in game.js ===');
    console.log(content.substring(idx, idx + 1500));
} else {
    console.log('ParallaxBackground not found in game.js');
}

const logPath = 'scratch/all_game_edits.txt';
if (fs.existsSync(logPath)) {
    const logContent = fs.readFileSync(logPath, 'utf8');
    const matches = [];
    const lines = logContent.split('\n');
    lines.forEach((line, i) => {
        if (line.toLowerCase().includes('parallax') || line.toLowerCase().includes('stitch') || line.toLowerCase().includes('seam') || line.toLowerCase().includes('gap')) {
            if (line.length < 150) {
                matches.push(`${i + 1}: ${line.trim()}`);
            }
        }
    });
    console.log('=== Matches in scratch/all_game_edits.txt ===');
    console.log(matches.slice(0, 40).join('\n'));
}
