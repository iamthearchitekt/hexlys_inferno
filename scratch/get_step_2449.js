const fs = require('fs');
const txt = fs.readFileSync('scratch/extracted_code.txt', 'utf8');
const idx = txt.indexOf('STEP 2449:');
if (idx !== -1) {
    const end = txt.indexOf('================================================================================', idx + 10);
    console.log(txt.substring(idx, end === -1 ? txt.length : end));
} else {
    console.log("STEP 2449 not found");
}
