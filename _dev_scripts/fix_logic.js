const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const updateInsert = `
        for (const key in this.platformTimers) {
            this.platformTimers[key]--;
            if (this.platformTimers[key] <= 0) {
                const [c, r] = key.split(',').map(Number);
                this.levelGrid[r][c] = TILES.EMPTY;
                this.fallingPlatforms.push(new FallingPlatformEntity(c, r));
                delete this.platformTimers[key];
            }
        }
        for (let i = this.fallingPlatforms.length - 1; i >= 0; i--) {
            const p = this.fallingPlatforms[i];
            p.update();
            if (p.dead) this.fallingPlatforms.splice(i, 1);
        }
        for (let i = this.bosses.length - 1; i >= 0; i--) {
            const b = this.bosses[i];
            b.update(this);
            if (b.dead) this.bosses.splice(i, 1);
        }
`;

code = code.replace('        this.flowers.forEach(flower => flower.update());', '        this.flowers.forEach(flower => flower.update());\n' + updateInsert);

const collisionInsert = `
                        if (t === TILES.FALLING_PLATFORM && !this.platformTimers[\`\${c},\${r}\`]) {
                            this.platformTimers[\`\${c},\${r}\`] = 120; // 2 seconds
                        }
`;

code = code.replace(/this\.player\.grounded = true;\s*if \(t !== TILES\.LAVA && t !== TILES\.PLATFORM\) \{/, 'this.player.grounded = true;\n' + collisionInsert + '\n                        if (t !== TILES.LAVA && t !== TILES.PLATFORM && t !== TILES.FALLING_PLATFORM) {');

const drawInsert = `
        this.fallingPlatforms.forEach(p => p.draw(this.ctx));
        this.bosses.forEach(b => b.draw(this.ctx, this.camera.x));
`;

code = code.replace('        this.flowers.forEach(f => f.draw(this.ctx, this.frameCounter));', '        this.flowers.forEach(f => f.draw(this.ctx, this.frameCounter));\n' + drawInsert);

const drawTilesInsert = `
                } else if (cell === TILES.FALLING_PLATFORM) {
                    let dx = x;
                    let dy = y;
                    const timer = this.platformTimers[\`\${c},\${r}\`];
                    if (timer && timer < 60) {
                        dx += (Math.random() - 0.5) * 4;
                        dy += (Math.random() - 0.5) * 4;
                    }
                    drawPixelMatrix(this.ctx, dx, dy, SPRITES.TILES.PLATFORM, false, 4.5);
                }
`;

code = code.replace(/if \(cell === TILES\.PLATFORM\) \{\s*drawPixelMatrix\(this\.ctx, x, y, SPRITES\.TILES\.PLATFORM, false, 4\.5\);\s*\}/, 'if (cell === TILES.PLATFORM) {\n                    drawPixelMatrix(this.ctx, x, y, SPRITES.TILES.PLATFORM, false, 4.5);\n' + drawTilesInsert);

// Add boss collision with player
const playerInteractionInsert = `
        this.bosses.forEach(boss => {
            if (!boss.dead && !this.player.poweredUp) {
                const hitX = px < boss.x + boss.width - 20 && px + pw > boss.x + 20;
                const hitY = py < boss.y + boss.height - 20 && py + ph > boss.y + 20;
                if (hitX && hitY) {
                    this.damagePlayer();
                }
            }
        });
`;
code = code.replace('        // 2. Lava Flower collections (Fire Suit Power-up)', playerInteractionInsert + '\n        // 2. Lava Flower collections (Fire Suit Power-up)');

fs.writeFileSync('game.js', code);
console.log('Done');
