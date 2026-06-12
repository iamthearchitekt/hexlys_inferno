const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');
const lines = code.split('\n');

const findFunc = (name) => {
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`function ${name}`)) {
            start = i;
            break;
        }
    }
    if (start !== -1) {
        console.log(`=== ${name} ===`);
        for (let j = start; j < start + 50; j++) {
            if (lines[j] === undefined) break;
            console.log(`${j + 1}: ${lines[j].replace('\r', '')}`);
            if (lines[j].trim() === '}') {
                // Peek next line to see if it's the end of function
                break;
            }
        }
    }
};

findFunc('getSpriteTrimBounds');
findFunc('drawSpriteAutoTrimmed');
