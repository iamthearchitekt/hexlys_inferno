const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Add currentLevelIndex to constructor
const ctorMatch = `        this.height = 540;
        this.timeLimit = 300;
        
        // Apply level-specific settings
        const lvl = LEVELS[this.currentLevelIndex];`;

const ctorReplace = `        this.height = 540;
        this.timeLimit = 300;
        
        this.currentLevelIndex = 0;
        
        // Apply level-specific settings
        const lvl = LEVELS[this.currentLevelIndex];`;

code = code.replace(ctorMatch, ctorReplace);

// 2. Replace LEVEL_DATA with activeLevel in initializeMap
const initMapMatch = `    initializeMap() {
        this.levelGrid = [];`;

const initMapReplace = `    initializeMap() {
        const activeLevel = LEVELS[this.currentLevelIndex].layout;
        this.levelGrid = [];`;

code = code.replace(initMapMatch, initMapReplace);
code = code.replaceAll('LEVEL_DATA', 'activeLevel');

// 3. Setup nextLevel function and portal collision
const resetGameMatch = `    resetGame() {
        this.state = 'PLAYING';`;

const resetGameReplace = `    nextLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= LEVELS.length) {
            this.state = 'VICTORY';
            this.screens.victory.classList.remove('hidden');
            synth.playVictory();
            return;
        }
        
        const lvl = LEVELS[this.currentLevelIndex];
        this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
        if (lvl.background) {
            document.getElementById('game-container').style.backgroundImage = 'url(' + lvl.background + ')';
        }
        
        this.resetGame();
    }

    resetGame() {
        this.state = 'PLAYING';`;

code = code.replace(resetGameMatch, resetGameReplace);

// 4. Find portal collision and call nextLevel
const portalMatch = `                        if (this.state !== 'VICTORY') {
                            this.state = 'VICTORY';
                            this.screens.victory.classList.remove('hidden');
                            synth.playVictory();
                        }`;

const portalReplace = `                        if (this.state !== 'VICTORY') {
                            synth.playVictory();
                            setTimeout(() => this.nextLevel(), 1000);
                        }`;

code = code.replace(portalMatch, portalReplace);

fs.writeFileSync('game.js', code);
console.log('Successfully patched multi-level support.');
