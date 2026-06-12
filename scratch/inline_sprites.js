const fs = require('fs');
const path = require('path');

let gameCode = fs.readFileSync('game.js', 'utf8');

const imageAssets = [
    { name: 'hexlyImg', src: 'hexly.png' },
    { name: 'hexlyWalk2Img', src: 'hexly_walk2.png' },
    { name: 'hexlyJumpImg', src: 'hexly_jump.png' },
    { name: 'hexlyCrouchImg', src: 'hexly_crouch.png' },
    { name: 'skeletonImg', src: 'skeleton.png' },
    { name: 'flameImg', src: 'flame.png' },
    { name: 'portalImg', src: 'portal.png' },
    { name: 'bossImg1', src: 'boss_frame1.png' },
    { name: 'bossImg2', src: 'boss_frame2.png' },
    { name: 'fireballImg', src: 'fireball.png' },
    { name: 'enemyFireballImg', src: 'enemy_fireball.png' },
    { name: 'powerupImg', src: 'powerup.png' },
    { name: 'flyingSkeletonImg', src: 'flying_skeleton.png' },
    { name: 'flyingSkeleton2Img', src: 'flying_skeleton2.png' },
    { name: 'skeletonWalk1Img', src: 'skeleton_walk1.png' },
    { name: 'skeletonWalk2Img', src: 'skeleton_walk2.png' },
    { name: 'soulShardImg', src: 'soul_shard.png' }
];

imageAssets.forEach(asset => {
    if (fs.existsSync(asset.src)) {
        console.log(`Inlining ${asset.src}...`);
        const base64 = fs.readFileSync(asset.src).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;
        
        // Find: assetName.src = 'filename.png';
        const targetRegex = new RegExp(`${asset.name}\\.src\\s*=\\s*['\"]${asset.src}['\"]\\s*;`, 'g');
        gameCode = gameCode.replace(targetRegex, `${asset.name}.src = '${dataUrl}';`);
    } else {
        console.warn(`File not found: ${asset.src}`);
    }
});

fs.writeFileSync('game.js', gameCode);
console.log('✓ Successfully inlined all game sprites as Base64 URLs!');
