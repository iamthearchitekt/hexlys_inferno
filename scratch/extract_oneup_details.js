const fs = require('fs');

const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');
const blocks = txt.split('================================================================================');

let output = '';
blocks.forEach(b => {
    if (b.toLowerCase().includes('oneup') || b.toLowerCase().includes('1up') || b.toLowerCase().includes('pentagram')) {
        output += '================================================================================\n' + b;
    }
});

fs.writeFileSync('scratch/oneup_details.txt', output, 'utf8');
console.log('Wrote search details to scratch/oneup_details.txt');
