const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');
const re = /name: "([^"]+)"[^}]*?startX: (\d+),\s*startY: (\d+)/g;
let m;
while ((m = re.exec(code)) !== null) {
    console.log('Level: ' + m[1] + '  startX:' + m[2] + '  startY:' + m[3]);
}
