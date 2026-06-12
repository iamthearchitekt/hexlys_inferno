const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// Find the target to fix the missing bracket
const badChunk = `    }
    ctx.restore();
// 2. 16-BIT RETRO GRAPHICS MATRIX SPRITE SHEETS`;

const goodChunk = `    }
    ctx.restore();
}

// 2. 16-BIT RETRO GRAPHICS MATRIX SPRITE SHEETS`;

code = code.replace(badChunk, goodChunk);

// Double check the other bad chunk from the failed AI edit!
// The AI edit might have left multiple "// 2. 16-BIT RETRO" lines or something weird.
fs.writeFileSync('game.js', code);
console.log('Patch complete.');
