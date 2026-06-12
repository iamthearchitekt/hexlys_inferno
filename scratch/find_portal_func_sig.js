const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const idx = code.indexOf('Portal Goal check');
if (idx !== -1) {
    console.log(code.substring(idx - 600, idx + 100));
} else {
    console.log('Portal Goal check text not found');
}
