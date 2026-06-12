const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

let depth = 0;
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let open = (line.match(/{/g) || []).length;
    let close = (line.match(/}/g) || []).length;
    depth += open - close;
    
    // Check if it's a class definition or method
    if (line.includes('class ') || line.includes('function ')) {
        // console.log(`Line ${i+1}: ${line.trim()} (Depth: ${depth})`);
    }
    
    if (depth < 0) {
        console.log('Negative depth at line', i + 1, line);
        break;
    }
}
console.log('Final depth:', depth);
if (depth > 0) {
    // print last 100 lines with their depth
    console.log('Last 20 lines:');
    for (let i = Math.max(0, lines.length - 20); i < lines.length; i++) {
        let open = (lines[i].match(/{/g) || []).length;
        let close = (lines[i].match(/}/g) || []).length;
        console.log(`${i+1}: ${lines[i]}`);
    }
}
