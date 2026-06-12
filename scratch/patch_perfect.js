const fs = require('fs');

const orig = fs.readFileSync('scratch/repo_clone/game.js', 'utf8');

const startSprites = orig.indexOf('const SPRITES = {');
const endSprites = orig.indexOf('};', startSprites) + 2;

const spritesBlock = orig.substring(startSprites, endSprites);

// We need to cut out the HEXLY block from spritesBlock.
const hexlyStart = spritesBlock.indexOf('HEXLY: {');
const hexlyEnd = spritesBlock.indexOf('WIN: ['); // WIN is the last animation in Hexly
const endOfWin = spritesBlock.indexOf(']', hexlyEnd) + 1; // finds the end of WIN array
const endOfHexlyObj = spritesBlock.indexOf('},', endOfWin) + 2;

const beforeHexly = spritesBlock.substring(0, hexlyStart);
const afterHexly = spritesBlock.substring(endOfHexlyObj);

const finalSprites = beforeHexly + 'HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] },\n' + afterHexly;

let gameCode = fs.readFileSync('game.js', 'utf8');
const gameSpritesStart = gameCode.indexOf('const SPRITES = {');
const gameAudioStart = gameCode.indexOf('// 3. SYNTHESIZED 8-BIT AUDIO ENGINE');

if (gameSpritesStart !== -1 && gameAudioStart !== -1) {
    const finalCode = gameCode.substring(0, gameSpritesStart) + finalSprites + '\n\n// ----------------------------------------------------\n' + gameCode.substring(gameAudioStart);
    fs.writeFileSync('game.js', finalCode);
    console.log('Successfully patched game.js with ALL sprites!');
} else {
    console.log('Error finding markers in game.js');
}
