const fs = require('fs');
const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');
const idx = txt.indexOf('STEP 1919:');
if (idx !== -1) {
    const start = txt.indexOf('"[', idx);
    const end = txt.indexOf('--- Content End ---', start);
    const content = txt.substring(idx, end);
    console.log(content);
} else {
    console.log("STEP 1919 not found");
}
