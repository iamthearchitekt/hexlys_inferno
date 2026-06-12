const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const idx = css.indexOf('.game-over-box');
if (idx !== -1) {
    console.log(css.substring(idx, idx + 800));
} else {
    console.log('.game-over-box styling not found');
}
