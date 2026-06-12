const fs = require('fs');

if (fs.existsSync('game.js')) {
    const code = fs.readFileSync('game.js', 'utf8');
    console.log('game.js features:');
    console.log(' - GROUND2 exists:', code.includes('GROUND2'));
    console.log(' - GROUND3 exists:', code.includes('GROUND3'));
    console.log(' - anyPressed exists:', code.includes('anyPressed'));
    console.log(' - spawnSlideDust exists:', code.includes('spawnSlideDust'));
    console.log(' - SWAMP_COLORS exists:', code.includes('SWAMP_COLORS'));
    console.log(' - BLOOD_COLORS exists:', code.includes('BLOOD_COLORS'));
    console.log(' - spawnSwampGas exists:', code.includes('spawnSwampGas'));
    console.log(' - trees drawing exists:', code.includes('DRAW DECORATIVE TREES'));
    console.log(' - Level 3 compositeOperation exists:', code.includes('Level 3 — sickly green'));
} else {
    console.log('game.js does not exist');
}

if (fs.existsSync('game_recovered.js')) {
    const code = fs.readFileSync('game_recovered.js', 'utf8');
    console.log('game_recovered.js features:');
    console.log(' - GROUND2 exists:', code.includes('GROUND2'));
    console.log(' - GROUND3 exists:', code.includes('GROUND3'));
    console.log(' - anyPressed exists:', code.includes('anyPressed'));
    console.log(' - spawnSlideDust exists:', code.includes('spawnSlideDust'));
    console.log(' - SWAMP_COLORS exists:', code.includes('SWAMP_COLORS'));
    console.log(' - BLOOD_COLORS exists:', code.includes('BLOOD_COLORS'));
    console.log(' - spawnSwampGas exists:', code.includes('spawnSwampGas'));
    console.log(' - trees drawing exists:', code.includes('DRAW DECORATIVE TREES'));
} else {
    console.log('game_recovered.js does not exist or is empty');
}
