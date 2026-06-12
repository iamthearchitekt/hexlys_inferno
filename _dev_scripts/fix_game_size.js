const fs = require('fs');
let gameJs = fs.readFileSync('game.js', 'utf8');

// Find the start of the SPRITES object
const spritesStart = gameJs.indexOf('const SPRITES = {');

// We know the end is before '// 3. SYNTHESIZED 8-BIT AUDIO ENGINE'
// Let's find exactly where class AudioSynth starts
const audioStart = gameJs.indexOf('// 3. SYNTHESIZED 8-BIT AUDIO ENGINE');

if (spritesStart !== -1 && audioStart !== -1) {
    let newGameJs = gameJs.substring(0, spritesStart) + gameJs.substring(audioStart);
    fs.writeFileSync('game.js', newGameJs, 'utf8');
    console.log('Removed SPRITES block. New size: ' + newGameJs.length);
} else {
    console.log('Could not find SPRITES block or AUDIO section. spritesStart=' + spritesStart + ' audioStart=' + audioStart);
}
