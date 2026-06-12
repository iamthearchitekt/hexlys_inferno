const fs = require('fs');

const extract = (path, startLine, linesCount) => {
    if (!fs.existsSync(path)) return;
    const lines = fs.readFileSync(path, 'utf8').split('\n');
    console.log(`=== ${path} lines ${startLine} to ${startLine + linesCount} ===`);
    console.log(lines.slice(startLine - 1, startLine + linesCount).join('\n'));
};

extract('scratch/all_game_edits.txt', 2300, 30);
extract('scratch/extracted_code.txt', 1210, 30);
