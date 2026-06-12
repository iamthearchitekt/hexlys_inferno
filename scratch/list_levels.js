const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');
const matches = code.match(/name:\s*["']([^"']+)["']/g);
console.log(matches);
