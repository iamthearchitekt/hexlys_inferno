const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Add boulder image
code = code.replace(
    'const skeletonImg = new Image();',
    `const boulderImg = new Image();
let boulderImgLoaded = false;
boulderImg.onload = () => { boulderImgLoaded = true; };
boulderImg.src = 'boulder.png';

const skeletonImg = new Image();`
);

// 2. Add tile constant
code = code.replace(
    'SWAMP: 16',
    'SWAMP: 16,\n    BOULDER: 18'
);

// 3. Add to initializeMap
code = code.replace(
    `this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'HORNED_BLOB'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;`,
    `this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'HORNED_BLOB'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 18) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'BOULDER'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;`
);

// 4. Update constructor
code = code.replace(
    `this.vx = type === 'SKULL_BUG' ? 0.9 : type === 'HORNED_BLOB' ? 0.5 : 0;`,
    `this.vx = type === 'SKULL_BUG' ? 0.9 : type === 'HORNED_BLOB' ? 0.5 : type === 'BOULDER' ? 4.0 : 0;`
);

code = code.replace(
    `this.height = 86;
        }`,
    `this.height = 86;
        } else if (type === 'BOULDER') {
            this.width = 90;
            this.height = 90;
        }`
);

// 5. Update Physics
code = code.replace(
    `this.animFrame = 1 - this.animFrame; // toggle 0 <-> 1
        }`,
    `this.animFrame = 1 - this.animFrame; // toggle 0 <-> 1
        }
        else if (this.type === 'BOULDER') {
            this.vy += 0.8;
            this.x += this.vx * this.direction;
            const checkX = this.direction === 1 ? this.x + this.width : this.x;
            const tileX = Math.floor(checkX / TILE_SIZE);
            const tileY1 = Math.floor(this.y / TILE_SIZE);
            const tileY2 = Math.floor((this.y + this.height - 2) / TILE_SIZE);
            let hitWall = false;
            if (levelGrid[tileY1] && levelGrid[tileY1][tileX] && levelGrid[tileY1][tileX] !== TILES.EMPTY && levelGrid[tileY1][tileX] !== TILES.LAVA) hitWall = true;
            if (levelGrid[tileY2] && levelGrid[tileY2][tileX] && levelGrid[tileY2][tileX] !== TILES.EMPTY && levelGrid[tileY2][tileX] !== TILES.LAVA) hitWall = true;
            if (hitWall) this.direction *= -1;
            this.y += this.vy;
            const checkTileY = Math.floor((this.y + this.height) / TILE_SIZE);
            const checkTileX1 = Math.floor(this.x / TILE_SIZE);
            const checkTileX2 = Math.floor((this.x + this.width - 1) / TILE_SIZE);
            if (levelGrid[checkTileY]) {
                const t1 = levelGrid[checkTileY][checkTileX1];
                const t2 = levelGrid[checkTileY][checkTileX2];
                if ((t1 && t1 !== TILES.EMPTY && t1 !== TILES.LAVA) || (t2 && t2 !== TILES.EMPTY && t2 !== TILES.LAVA)) {
                    this.y = checkTileY * TILE_SIZE - this.height;
                    this.vy = 0;
                }
            }
            for (const other of engine.enemies) {
                if (other !== this && !other.dead && other.type !== 'BOULDER') {
                    const overlapX = this.x < other.x + other.width && this.x + this.width > other.x;
                    const overlapY = this.y < other.y + other.height && this.y + this.height > other.y;
                    if (overlapX && overlapY) {
                        other.dead = true;
                        synth.playCrunch();
                        for (let i = 0; i < 5; i++) particles.spawnEmber(other.x + other.width/2, other.y + other.height/2);
                    }
                }
            }
        }`
);

// 6. Update Drawing (replace ONLY the first instance in Enemy.draw)
// Since we can't reliably find it without parsing, we look for the exact draw method signature.
const drawIdx = code.indexOf('draw(ctx, cameraX, player = null) {');
if (drawIdx !== -1) {
    const fireImpIdx = code.indexOf("if (this.type === 'FIRE_IMP') {", drawIdx);
    if (fireImpIdx !== -1) {
        code = code.substring(0, fireImpIdx) + 
            `if (this.type === 'BOULDER') {
            if (boulderImgLoaded) {
                ctx.save();
                ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
                ctx.rotate((this.x * 0.05) * this.direction);
                ctx.drawImage(boulderImg, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        } else ` + code.substring(fireImpIdx);
    }
}

// 7. Re-add God Mode
code = code.replace(
    '// N Key: Next level',
    `// G Key: God Mode Toggle
            if (code === 'KeyG') {
                this.godMode = !this.godMode;
                this.showToast(this.godMode ? "GOD MODE: ON" : "GOD MODE: OFF");
                e.preventDefault();
                return;
            }
            
            // N Key: Next level`
);

code = code.replace(
    'damagePlayer(instantKill = false) {',
    `damagePlayer(instantKill = false) {
        if (this.godMode && !instantKill) return;`
);

fs.writeFileSync('game.js', code);
console.log('Patched game.js');
