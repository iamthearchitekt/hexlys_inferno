const fs = require('fs');
const files = fs.readdirSync('scratch');

const generators = files.filter(f => f.includes('generate') || f.includes('layout') || f.includes('level'));
console.log('Found generator/layout files in scratch:', generators);

// Let's also read regenerate_all.js and compare which files it runs
const regen = fs.readFileSync('scratch/regenerate_all.js', 'utf8');
console.log('\nFiles called inside regenerate_all.js:');
const regenLines = regen.split('\n').filter(l => l.includes('execSync'));
console.log(regenLines.join('\n'));
