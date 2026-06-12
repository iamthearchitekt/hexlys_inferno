const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// Fix Dev Shortcuts in InputHandler
code = code.replace(
    `// God Mode & Level Jumps (Dev Shortcuts)
        if (code === 'KeyG') {
            this.godMode = !this.godMode;
            this.showToast(this.godMode ? "GOD MODE: ON" : "GOD MODE: OFF");
            e.preventDefault();
        }
        if (code.startsWith('Digit')) {
            const num = parseInt(code.replace('Digit', ''));
            if (num >= 1 && num <= LEVELS.length) {
                this.loadLevel(num - 1);
                e.preventDefault();
            }
        }`,
    `// God Mode & Level Jumps (Dev Shortcuts)
        if (typeof engine !== 'undefined') {
            if (code === 'KeyG') {
                engine.godMode = !engine.godMode;
                engine.showToast(engine.godMode ? "GOD MODE: ON" : "GOD MODE: OFF");
                e.preventDefault();
            }
            if (code.startsWith('Digit')) {
                const num = parseInt(code.replace('Digit', ''));
                if (num >= 1 && num <= LEVELS.length) {
                    engine.loadLevel(num - 1);
                    e.preventDefault();
                }
            }
            // ANY KEY TO RESTART on Game Over / Victory
            if (engine.state === 'GAMEOVER' || engine.state === 'VICTORY') {
                this.restartPressed = true;
            }
        }`
);

// Fix GameEngine loadLevel missing title screen dismissals
code = code.replace(
    'this.initializeMap();\n        this.showToast("LEVEL " + (index + 1));',
    `this.initializeMap();
        this.state = 'PLAYING';
        this.screens.title.classList.add('hidden');
        this.screens.gameover.classList.add('hidden');
        this.screens.victory.classList.add('hidden');
        this.screens.pause.classList.add('hidden');
        this.screens.hud.classList.remove('hidden');
        this.showToast("LEVEL " + (index + 1));`
);

fs.writeFileSync('game.js', code);
console.log('Fixed InputHandler bugs and screen dismissals!');
