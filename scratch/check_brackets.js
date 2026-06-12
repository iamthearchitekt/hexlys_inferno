const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

let depth = 0;
let lastOpen = -1;
let lineNum = 1;

for (let i = 0; i < code.length; i++) {
    if (code[i] === '\n') lineNum++;
    if (code[i] === '{') {
        depth++;
        lastOpen = lineNum;
    }
    if (code[i] === '}') {
        depth--;
    }
}

console.log('Final depth:', depth);
if (depth > 0) {
    console.log('Unclosed brace! Last open brace was around line:', lastOpen);
} else if (depth < 0) {
    console.log('Too many closing braces!');
}
