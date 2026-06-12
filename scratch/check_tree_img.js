const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

console.log('tree1Img defined:', code.includes('tree1Img'));
console.log('tree2Img defined:', code.includes('tree2Img'));
