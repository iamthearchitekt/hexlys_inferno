const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Add currentLevelIndex initialization
code = code.replace(
    'this.timeRemaining = this.timeLimit;',
    'this.timeRemaining = this.timeLimit;\n        this.currentLevelIndex = 0;'
);

// 2. Change initializeMap to use LEVELS
code = code.replace(
    /const LEVEL_DATA = \[\s+\[[\s\S]*?\];\s+\/\/\s*12-Row Map Data is now dynamically loaded from levels\.js!/g,
    '// 12-Row Map Data is now dynamically loaded from levels.js!'
);

code = code.replace(
    /this\.levelGrid\.push\(new Array\(LEVEL_DATA\[0\]\.length\)\.fill\(0\)\);/g,
    `const currentLayout = typeof LEVELS !== 'undefined' && LEVELS[this.currentLevelIndex] ? LEVELS[this.currentLevelIndex].layout : LEVEL_DATA;
        this.levelGrid.push(new Array(currentLayout[0].length).fill(0));`
);

code = code.replace(
    /for \(let r = 0; r < LEVEL_DATA\.length; r\+\+\) \{/g,
    `for (let r = 0; r < currentLayout.length; r++) {`
);

code = code.replace(
    /for \(let c = 0; c < LEVEL_DATA\[r\]\.length; c\+\+\) \{/g,
    `for (let c = 0; c < currentLayout[r].length; c++) {`
);

code = code.replace(
    /const cell = LEVEL_DATA\[r\]\[c\];/g,
    `const cell = currentLayout[r][c];`
);

// 3. Add loadLevel method
const resetGameIdx = code.indexOf('resetGame() {');
if (resetGameIdx !== -1) {
    code = code.substring(0, resetGameIdx) + 
`loadLevel(index) {
        if (typeof LEVELS === 'undefined' || index >= LEVELS.length) {
            this.triggerVictory();
            return;
        }
        this.currentLevelIndex = index;
        
        // Reset player state for new level
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.grounded = false;
        this.player.x = 80;
        this.player.y = 300;
        
        // Ensure no invul carryover unless it's a specific powerup design
        this.player.invulTimer = 60; // short protection
        
        this.camera.x = 0;
        this.camera.targetX = 0;
        this.camera.floatX = 0;
        
        this.initializeMap();
        this.showToast("LEVEL " + (index + 1));
    }

    ` + code.substring(resetGameIdx);
}

// 4. Update Portal Logic to jump to next level instead of Victory
code = code.replace(
    `if (this.getTile(c, r) === TILES.PORTAL) {
                    this.triggerVictory();
                    return;
                }`,
    `if (this.getTile(c, r) === TILES.PORTAL) {
                    this.loadLevel(this.currentLevelIndex + 1);
                    return;
                }`
);

fs.writeFileSync('game.js', code);
console.log('Levels integrated!');
