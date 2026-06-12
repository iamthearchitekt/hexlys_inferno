const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Make engine global
code = code.replace(
    'const engine = new GameEngine();',
    'window.engine = new GameEngine();\n    const engine = window.engine;'
);

// 2. Fix BOULDER reference errors
code = code.replace(
    /if \(levelGrid\[tileY1\]/g,
    'if (engine.levelGrid[tileY1]'
);
code = code.replace(
    /levelGrid\[tileY1\]\[tileX\]/g,
    'engine.levelGrid[tileY1][tileX]'
);
code = code.replace(
    /if \(levelGrid\[tileY2\]/g,
    'if (engine.levelGrid[tileY2]'
);
code = code.replace(
    /levelGrid\[tileY2\]\[tileX\]/g,
    'engine.levelGrid[tileY2][tileX]'
);
code = code.replace(
    /if \(levelGrid\[checkTileY\]\)/g,
    'if (engine.levelGrid[checkTileY])'
);
code = code.replace(
    /const t1 = levelGrid\[checkTileY\]\[checkTileX1\];/g,
    'const t1 = engine.levelGrid[checkTileY][checkTileX1];'
);
code = code.replace(
    /const t2 = levelGrid\[checkTileY\]\[checkTileX2\];/g,
    'const t2 = engine.levelGrid[checkTileY][checkTileX2];'
);

// 3. Fix dev shortcuts engine references just in case
code = code.replace(
    /if \(typeof engine !== 'undefined'\) \{/g,
    `if (window.engine) {`
);
code = code.replace(
    /engine\.godMode/g,
    'window.engine.godMode'
);
code = code.replace(
    /engine\.showToast/g,
    'window.engine.showToast'
);
code = code.replace(
    /engine\.loadLevel/g,
    'window.engine.loadLevel'
);
code = code.replace(
    /engine\.state/g,
    'window.engine.state'
);

fs.writeFileSync('game.js', code);
console.log('Fixed scope issues!');
