const fs = require('fs');
const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');

const regex = /spawn[A-Za-z0-9]+/g;
const matches = txt.match(regex) || [];
const unique = [...new Set(matches)];
console.log("Found spawn methods:", unique);
