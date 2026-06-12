const { execSync } = require('child_process');
const code = execSync('git show HEAD:game.js', { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
const idx = code.indexOf('class InputHandler');
if (idx !== -1) {
    console.log(code.substring(idx, idx + 800));
} else {
    console.log('class InputHandler not found in HEAD!');
}
