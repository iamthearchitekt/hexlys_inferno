const fs = require('fs');
let code = fs.readFileSync('levels.js', 'utf8');

const marker = '];\n';
const idx = code.indexOf('];');

if (idx !== -1) {
    let newCode = code.substring(0, idx + 2) + '\n';
    fs.writeFileSync('levels.js', newCode);
    console.log("Success: Truncated file at ];");
} else {
    console.log("Marker not found");
}
