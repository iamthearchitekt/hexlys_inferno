const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// Remove all injected God Mode logic inside EnemyFireball or elsewhere
code = code.replace(/\/\/ G Key: God Mode Toggle[\s\S]*?return;\n            }/g, '');
code = code.replace(/\/\/ N Key: Next level[\s\S]*?return;\n            }/g, '');

// Re-add into handleKeyDown
code = code.replace(
    /if \(code === 'KeyP'\) this\.pausePressed = true;/,
    `if (code === 'KeyP') this.pausePressed = true;
        
        // God Mode & Level Jumps (Dev Shortcuts)
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
        }`
);

fs.writeFileSync('game.js', code);
console.log('Fixed dev shortcuts!');
