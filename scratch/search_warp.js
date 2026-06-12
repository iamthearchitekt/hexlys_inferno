const fs = require('fs');

const files = ['scratch/extracted_code.txt', 'scratch/all_game_edits.txt', 'scratch/details.txt'];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    const matches = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const lower = line.toLowerCase();
        if (lower.includes('warp') || lower.includes('digit1') || lower.includes('keyg') || lower.includes('skip') || lower.includes('cheat')) {
            if (line.length < 200) {
                matches.push(`${i + 1}: ${line.trim()}`);
            }
        }
    });
    console.log(`=== Matches in ${f} (count: ${matches.length}) ===`);
    console.log(matches.slice(0, 40).join('\n'));
    console.log();
});
