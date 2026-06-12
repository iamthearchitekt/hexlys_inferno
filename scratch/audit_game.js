const fs = require('fs');
const code = fs.readFileSync('game.js', 'utf8');

const checks = [
    // Player physics
    'gravity', 'vx', 'vy', 'jump',
    // Collision
    'collision', 'checkCollision', 'solidTile', 'isWall',
    // Death/game over
    'playerDead', 'gameOver', 'showGameOver', 'lives',
    // Level loading
    'loadLevel', 'LEVELS[', 'currentLevel',
    // Key handling  
    'KeyG', 'Digit1', 'Digit2', 'levelWarp', 'godMode',
    // Sprite transparency
    'getSpriteTrimBounds', 'trimBounds', 'drawImage',
    // Wind
    'windForce', 'wind',
    // Enemy
    'Enemy', 'updateEnemies', 'SKULL_BUG', 'FIRE_IMP',
    // Falling platform
    'fallingPlatform', 'FALLING', 'fallDelay',
    // Background
    'ParallaxBackground', 'parallax',
    // Boss
    'SKELETON_OVERLORD', 'boss',
    // Projectile
    'Projectile', 'fireball',
];

console.log('=== game.js AUDIT ===');
console.log('File size:', code.length, 'bytes,', code.split('\n').length, 'lines\n');
checks.forEach(term => {
    const count = (code.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    console.log((count > 0 ? '  OK' : '  MISSING') + ' [' + count + 'x] ' + term);
});
