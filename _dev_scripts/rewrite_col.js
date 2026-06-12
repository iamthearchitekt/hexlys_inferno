const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const regex = /    resolveCollisions\(\) \{[\s\S]*?\}\n\n    getTile\(col, row\) \{/m;

const replacement = `    resolveCollisions() {
        const px = this.player.x;
        const py = this.player.y;
        const pw = this.player.width;
        const ph = this.player.height;

        // 1. Coin collections
        this.coins.forEach(coin => {
            if (coin.collected) return;
            const cx = coin.x + coin.width / 2;
            const cy = coin.y + coin.height / 2;
            const hitX = px < cx + 10 && px + pw > cx - 10;
            const hitY = py < cy + 10 && py + ph > cy - 10;

            if (hitX && hitY) {
                coin.collected = true;
                this.player.coins++;
                this.player.score += 10;
                synth.playCollect();
                this.updateHUD();
                
                // Increase time slightly to encourage exploration
                this.timeLimit += 2;
            }
        });

        // 2. Lava Flower collections (Fire Suit Power-up)
        this.flowers.forEach(flower => {
            if (flower.collected) return;
            // AABB overlapping
            const hitX = px < flower.x + 30 && px + pw > flower.x;
            const hitY = py < flower.y + 30 && py + ph > flower.y;
            if (hitX && hitY) {
                flower.collected = true;
                this.player.poweredUp = true;
                this.player.score += 500;
                synth.playVictory(); // Epic chime chords
                this.updateHUD();
                this.showToast("FIRE HEXLY MORPHED!");
                
                // Spawn sparkling embers
                for (let i = 0; i < 15; i++) {
                    particles.spawnEmber(flower.x + 15, flower.y + 15);
                }
            }
        });
        
        this.bosses.forEach(boss => {
            if (!boss.dead && !this.player.poweredUp) {
                const hitX = px < boss.x + boss.width - 20 && px + pw > boss.x + 20;
                const hitY = py < boss.y + boss.height - 20 && py + ph > boss.y + 20;
                if (hitX && hitY) {
                    this.damagePlayer();
                }
            }
        });

        // 3. Enemy stomping checking
        this.enemies.forEach(enemy => {
            if (enemy.dead || this.state !== 'PLAYING') return;

            const hitX = px < enemy.x + enemy.width && px + pw > enemy.x;
            const hitY = py < enemy.y + enemy.height && py + ph > enemy.y;

            if (hitX && hitY) {
                const falling = this.player.vy > 0;
                const hitTop = (py + ph - this.player.vy) <= (enemy.y + 10);
                
                if (falling && hitTop) {
                    enemy.dead = true;
                    this.player.vy = -7.5;
                    this.player.score += 150;
                    synth.playStomp();
                    this.updateHUD();
                    particles.spawnStompExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                } else {
                    this.damagePlayer();
                }
            }
        });

        // 4. Portal Goal check
        const bounds = this.getTileBounds(px, py, pw, ph);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.PORTAL) {
                    this.triggerVictory();
                    return;
                }
            }
        }

        // 5. Lava Hazard intersection checks
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.LAVA) {
                    this.damagePlayer();
                    return;
                }
            }
        }
    }

    getTile(col, row) {`;

code = code.replace(regex, replacement);
fs.writeFileSync('game.js', code);
console.log('Fixed resolveCollisions');
