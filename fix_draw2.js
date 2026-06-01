const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const restored = `
    getTile(col, row) {
        if (col < 0 || col >= this.levelGrid[0].length || row < 0 || row >= 12) return TILES.EMPTY;
        return this.levelGrid[row][col];
    }

    isSolid(tile) {
        return tile === TILES.GROUND || 
               tile === TILES.PLATFORM || 
               tile === TILES.FALLING_PLATFORM ||
               tile === TILES.BREAKABLE || 
               tile === TILES.REWARD || 
               tile === TILES.SPENT_REWARD;
    }

    getTileBounds(x, y, w, h) {
        return {
            minX: Math.floor(x / TILE_SIZE),
            maxX: Math.floor((x + w - 0.01) / TILE_SIZE),
            minY: Math.floor(y / TILE_SIZE),
            maxY: Math.floor((y + h - 0.01) / TILE_SIZE)
        };
    }

    // ----------------------------------------------------
    // 12. CANVAS DRAW RENDER PIPELINE
    // ----------------------------------------------------
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2-Layer Wasteland Background scrolling
        this.background.draw(this.ctx, Math.round(this.camera.x));

        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), 0);

        // Draw physical grid blocks (Scale 4.5x = 45px grids!)
        this.drawTiles();

        this.coins.forEach(coin => {
            if (!coin.collected) coin.draw(this.ctx, this.camera.x);
        });

        this.flowers.forEach(flower => {
            if (!flower.collected) flower.draw(this.ctx, this.camera.x);
        });

        this.fireballs.forEach(fb => fb.draw(this.ctx, this.camera.x));
        this.enemyFireballs.forEach(ef => ef.draw(this.ctx));
        this.fallingPlatforms.forEach(p => p.draw(this.ctx));
        this.bosses.forEach(b => b.draw(this.ctx, this.camera.x));

        this.enemies.forEach(enemy => {
            if (!enemy.dead) enemy.draw(this.ctx, this.camera.x, this.player);
        });

        particles.draw(this.ctx, 0);

        this.drawHexly();

        this.ctx.restore();
    }

    drawTiles() {
        const startCol = Math.floor(this.camera.x / TILE_SIZE);
        const endCol = Math.ceil((this.camera.x + this.width) / TILE_SIZE);
        
        for (let r = 0; r < 12; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const tile = this.getTile(c, r);
                if (tile !== TILES.EMPTY) {
                    this.drawSingleTile(c * TILE_SIZE, r * TILE_SIZE, tile);
                }
            }
        }
    }

    drawSingleTile(x, y, type) {
        let matrix = null;
        if (type === TILES.GROUND) matrix = SPRITES.TILES.GROUND;
        else if (type === TILES.PLATFORM) matrix = SPRITES.TILES.PLATFORM;
        else if (type === TILES.FALLING_PLATFORM) {
            let dx = x;
            let dy = y;
            const c = Math.round(x / TILE_SIZE);
            const r = Math.round(y / TILE_SIZE);
            const timer = this.platformTimers[\`\${c},\${r}\`];
            if (timer && timer < 60) {
                dx += (Math.random() - 0.5) * 4;
                dy += (Math.random() - 0.5) * 4;
            }
            drawPixelMatrix(this.ctx, dx, dy, SPRITES.TILES.PLATFORM, false, 4.5);
            return;
        }
        else if (type === TILES.BREAKABLE) matrix = SPRITES.TILES.BREAKABLE;
        else if (type === TILES.REWARD) {
            // Draw the ground-brown base tile first
            drawPixelMatrix(this.ctx, x, y, SPRITES.TILES.REWARD, false, 4.5);
`;

code = code.replace("            const pulse = (Math.sin(this.frameCounter * 0.12) + 1) / 2; // 0..1 oscillation", restored + '\n            const pulse = (Math.sin(this.frameCounter * 0.12) + 1) / 2; // 0..1 oscillation');
fs.writeFileSync('game.js', code);
console.log('Fixed');
