const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

let depth = 0;
for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') depth--;
}
console.log('Total depth difference:', depth);
