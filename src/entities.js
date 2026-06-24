// 7. FIREBALL & LAVA FLOWER ENTITIES (Power-up Core)
// ----------------------------------------------------
class LavaFlower {
    constructor(x, y) {
        this.x = x + TILE_SIZE / 2 - 15;
        this.y = y;
        this.startY = y;
        this.collected = false;
        this.vy = -1.5; // Pop up slowly
        this.floatingTimer = 0;
    }

    update() {
        // Pop out of block then float in place
        if (this.y > this.startY - 35) {
            this.y += this.vy;
        } else {
            this.floatingTimer += 0.08;
            this.y = (this.startY - 35) + Math.sin(this.floatingTimer) * 3;
        }
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        if (powerupImgLoaded) {
            // Draw with a gentle bob glow effect
            ctx.save();
            ctx.shadowColor = '#ff6a00';
            ctx.shadowBlur = 14;
            ctx.drawImage(powerupImg, drawX - 5, drawY - 5, 40, 40);
            ctx.restore();
        } else if (flameImgLoaded) {
            ctx.drawImage(flameImg, drawX, drawY, 30, 30);
        }
    }
}

class Fireball {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 8;
        this.height = 8;
        this.bounces = 0;
        this.dead = false;
    }

    update(engine) {
        const levelGrid = engine.levelGrid;
        const enemies = engine.enemies;
        const player = engine.player;

        this.vy += 0.45; // Snappy fireball gravity
        
        // Spawn realistic flame particle trail (molten embers and rising volcanic smoke!)
        if (Math.random() < 0.65) {
            const colors = ['#f95700', '#f7be00', '#e61e29', '#544e47']; 
            const trailColor = colors[Math.floor(Math.random() * colors.length)];
            const px = this.x + this.width / 2 + (Math.random() - 0.5) * 4;
            const py = this.y + this.height / 2 + (Math.random() - 0.5) * 4;
            particles.add(new Particle(
                px, py, 
                -this.vx * 0.2 + (Math.random() - 0.5) * 0.5, 
                (Math.random() - 0.5) * 0.5, 
                trailColor, 
                Math.random() * 3 + 1, 
                Math.random() * 15 + 10, 
                'ember'
            ));
        }
        
        // Solve Horizontal (shrink vertical check bounds by 2px to prevent false positive wall hits with the floor when sliding/bouncing!)
        this.x += this.vx;
        let bounds = this.getTileBounds(this.x, this.y + 2, this.width, this.height - 4);
        if (this.isHitSolid(bounds, levelGrid)) {
            this.dead = true;
            // Spawn explosion sparks
            for (let i = 0; i < 6; i++) {
                particles.spawnEmber(this.x + this.width/2, this.y + this.height/2);
            }
            return;
        }

        // Solve Vertical
        this.y += this.vy;
        bounds = this.getTileBounds(this.x, this.y, this.width, this.height);
        
        for (let row = bounds.minY; row <= bounds.maxY; row++) {
            for (let col = bounds.minX; col <= bounds.maxX; col++) {
                const tile = this.getTile(col, row, levelGrid);
                
                // Extinguish immediately upon touching liquid hazards
                if (tile === TILES.LAVA || tile === TILES.SWAMP) {
                    this.dead = true;
                    // Spawn a little splash effect
                    for (let i = 0; i < 3; i++) {
                        if (tile === TILES.LAVA) particles.spawnEmber(this.x + this.width/2, this.y + this.height);
                        if (tile === TILES.SWAMP) particles.spawnHaze(this.x + this.width/2, this.y + this.height);
                    }
                    return;
                }

                if (tile === TILES.GROUND || tile === TILES.PLATFORM || tile === TILES.BREAKABLE || tile === TILES.REWARD || tile === TILES.SPENT_REWARD || tile === TILES.FALLING_PLATFORM) {
                    if (this.vy > 0) {
                        // Falling, bounce up
                        this.y = row * TILE_SIZE - this.height;
                        this.vy = -4.5; // Snappy bouncy!
                        this.bounces++;
                        if (this.bounces > 4) {
                            this.dead = true;
                        }
                    } else if (this.vy < 0) {
                        this.dead = true;
                    }
                }
            }
        }

        // Check enemy collisions
        enemies.forEach(enemy => {
            if (enemy.dead || this.dead) return;
            const hitX = this.x < enemy.x + enemy.width && this.x + this.width > enemy.x;
            const hitY = this.y < enemy.y + enemy.height && this.y + this.height > enemy.y;
            
            if (hitX && hitY) {
                // Destroy Skeleton Enemy!
                enemy.dead = true;
                this.dead = true;
                player.score += 150;
                if (typeof window !== 'undefined' && window.synth && window.synth.playStomp) window.synth.playStomp();
                for (let i = 0; i < 15; i++) {
                    particles.spawnEmber(enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height);
                }
                engine.updateHUD();
            }
        });

        // Boundary checks
        if (this.y > 540 || this.x < 0 || this.x > levelGrid[0].length * TILE_SIZE) {
            this.dead = true;
        }
    }

    draw(ctx, cameraX) {
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        if (fireballImgLoaded) {
            ctx.save();
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 16;
            // Draw centered on the fireball hitbox
            ctx.drawImage(fireballImg, drawX - 6, drawY - 6, 20, 20);
            ctx.restore();
        }
    }

    getTile(col, row, levelGrid) {
        if (col < 0 || col >= levelGrid[0].length || row < 0 || row >= 12) return TILES.EMPTY;
        return levelGrid[row][col];
    }

    getTileBounds(x, y, w, h) {
        return {
            minX: Math.floor(x / TILE_SIZE),
            maxX: Math.floor((x + w - 0.01) / TILE_SIZE),
            minY: Math.floor(y / TILE_SIZE),
            maxY: Math.floor((y + h - 0.01) / TILE_SIZE)
        };
    }

    isHitSolid(bounds, levelGrid) {
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r, levelGrid);
                if (t === TILES.GROUND || t === TILES.PLATFORM || t === TILES.BREAKABLE || t === TILES.REWARD || t === TILES.SPENT_REWARD || t === TILES.FALLING_PLATFORM) {
                    return true;
                }
            }
        }
        return false;
    }
}

class EjectedSoulCoin {
    constructor(x, y) {
        this.x = x + TILE_SIZE / 2;
        this.y = y;
        this.vy = -8; // Pops upwards
        this.dead = false;
    }

    update() {
        this.y += this.vy;
        this.vy += 0.5; // Gravity
        if (this.vy > 8) this.dead = true; // Dies when it falls back down
    }

    draw(ctx, cameraX) {
        if (this.dead) return;
        const dw = 22;
        const dh = 40;
        const dx = this.x - dw / 2;
        const dy = this.y - dh / 2;
        
        if (typeof soulShardImgLoaded !== 'undefined' && soulShardImgLoaded) {
            ctx.save();
            ctx.shadowColor = '#6600ff';
            ctx.shadowBlur = 18;
            ctx.drawImage(soulShardImg, 0, 0, soulShardImg.width, soulShardImg.height, dx, dy, dw, dh);
            ctx.restore();
        }
    }
}

// ----------------------------------------------------
// 7b. ENEMY FIREBALL â€” straight left flight, phases through tiles, only hits Hexly
// ----------------------------------------------------
class EnemyFireball {
    constructor(x, y, speed) {
        this.x      = x;
        this.y      = y;
        this.vx     = -speed;   // constant leftward — no gravity, no bouncing
        this.width  = 56;
        this.height = 40;
        this.dead   = false;
    }

    update(engine) {
        if (this.dead) return;
        const player = engine.player;

        // Straight left — no physics, no tile checks
        this.x += this.vx;

        // Ember trail off the right edge
        if (Math.random() < 0.6) {
            const colors = ['#ff4400', '#ff8800', '#ffcc00', '#ff2200'];
            particles.add(new Particle(
                this.x + this.width + Math.random() * 6,
                this.y + this.height / 2 + (Math.random() - 0.5) * 10,
                Math.random() * 1.5 + 0.3,
                (Math.random() - 0.5) * 0.6,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 4 + 2,
                Math.random() * 16 + 8,
                'ember'
            ));
        }

        // Player hit check only
        if (player.invulTimer <= 0) {
            const hitX = this.x < player.x + player.width  && this.x + this.width  > player.x;
            const hitY = this.y < player.y + player.height && this.y + this.height > player.y;
            if (hitX && hitY) {
                this.dead = true;
                this.spawnExplosion();
                engine.damagePlayer();
                return;
            }
        }

        // Despawn off left edge
        if (this.x + this.width < engine.camera.x - 60) {
            this.dead = true;
        }
    }

    spawnExplosion() {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd   = Math.random() * 3.5 + 1;
            particles.add(new Particle(
                this.x + this.width  / 2,
                this.y + this.height / 2,
                Math.cos(angle) * spd,
                Math.sin(angle) * spd,
                ['#ff4400', '#ff8800', '#ffdd00', '#ffffff'][Math.floor(Math.random() * 4)],
                Math.random() * 5 + 3,
                Math.random() * 25 + 12,
                'debris'
            ));
        }
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.save();
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur  = 18;
        if (enemyFireballImgLoaded) {
            ctx.drawImage(enemyFireballImg, Math.round(this.x), Math.round(this.y), this.width, this.height);
        } else {
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}


// ----------------------------------------------------

// 8. TILE-COLLECTABLES AND SKELETON ENEMIES
// ----------------------------------------------------
class SoulCoin {
    constructor(x, y) {
        this.x = x + TILE_SIZE / 2;
        this.y = y + TILE_SIZE / 2;
        this.baseY = this.y;
        this.collected = false;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(frame) {
        this.y = this.baseY + Math.sin(frame * 0.08 + this.bobOffset) * 4;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        
        // Draw the soul shard crystal beautifully auto-trimmed and scaled
        const dw = 22;
        const dh = 40;
        const dx = this.x - dw / 2;
        const dy = this.y - dh / 2;
        
        if (soulShardImgLoaded) {
            ctx.save();
            // #6600ff (deep blue-purple) stays purple on level 3's yellow-green background
            ctx.shadowColor = '#6600ff';
            ctx.shadowBlur = 18;
            ctx.drawImage(soulShardImg, dx, dy, dw, dh);
            ctx.restore();
        } else {
            // Fallback to original retro coin if image hasn't loaded yet
            const drawX = Math.round(this.x - 15);
            const drawY = Math.round(this.y - 15);
            drawPixelMatrix(ctx, drawX, drawY, SPRITES.COIN, false, 3.0);
        }
    }
}

class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;   // Smaller physical hitbox (was 81)
        this.height = 75;  // Smaller physical hitbox (was 102)
        this.visualWidth = 108; // Bigger visual sprite (was 81)
        this.visualHeight = 136; // Bigger visual sprite (was 102)
        this.vx = 0;
        this.vy = 0;
        this.speed = 0.08; // Snail's pace acceleration
        this.maxSpeed = 1.8; // Snail's pace max speed
        this.dead = false;
        this.facingRight = false;
        this.isMoving = false;
    }

    update(engine) {
        if (this.dead) return;

        const dx = engine.player.x - this.x;
        
        let targetY = engine.player.y;
        const c = Math.floor((this.x + this.width / 2) / TILE_SIZE);
        let floorY = 600;
        if (c >= 0 && c < engine.levelGrid[0].length) {
            for (let r = Math.max(0, Math.floor(this.y / TILE_SIZE)); r < 12; r++) {
                const t = engine.getTile(c, r);
                if (t !== TILES.EMPTY && t !== TILES.FIREBALL_SPAWNER && t !== TILES.GHOST) {
                    floorY = r * TILE_SIZE;
                    break;
                }
            }
        }
        const minHeightY = floorY - this.height - 30; // Float 30px above ground
        if (targetY > minHeightY) {
            targetY = minHeightY;
        }
        const dy = targetY - this.y;
        
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Boo logic: Only move if the player is NOT looking at the ghost
        // Player looking right (1) and ghost is to the right -> Looking AT ghost
        // Player looking left (-1) and ghost is to the left -> Looking AT ghost
        const playerFacingRight = engine.player.direction === 1;
        const ghostIsToRight = this.x > engine.player.x;
        
        const playerLookingAtGhost = (playerFacingRight && ghostIsToRight) || (!playerFacingRight && !ghostIsToRight);

        // Check if player is actively moving
        const playerMoving = Math.abs(engine.player.vx) > 0.1 || Math.abs(engine.player.vy) > 0.1;

        // The ghost only tracks if the player is NOT looking at it, AND is within 600px
        if (!playerLookingAtGhost && dist < 600) {
            // Track the player with gentle acceleration
            if (dist > 0) {
                this.vx += (dx / dist) * this.speed;
                this.vy += (dy / dist) * this.speed;
            }

            // Cap the maximum velocity (much slower now)
            const speedMag = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speedMag > this.maxSpeed) {
                this.vx = (this.vx / speedMag) * this.maxSpeed;
                this.vy = (this.vy / speedMag) * this.maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Ghost faces the player
            if (dx > 0) this.facingRight = true;
            else if (dx < 0) this.facingRight = false;

            this.isMoving = true;
        } else {
            // Player is looking! Stop tracking, apply strong friction to halt
            this.vx *= 0.4;
            this.vy *= 0.4;
            this.x += this.vx;
            this.y += this.vy;

            if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
                this.isMoving = false;
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.dead) return;

        const screenX = this.x - cameraX;
        // Cull if way off screen (canvas is 960px wide, so cull at > 1200)
        if (screenX < -this.visualWidth * 2 || screenX > 1200) return;

        // DEBUG: Draw a bright red box where the ghost is supposed to be
        // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        // ctx.fillRect(this.x, this.y, this.width, this.height);

        const img = this.isMoving ? ghostMoveImg : ghostIdleImg;
        if (img && img.complete && img.naturalWidth > 0) {
            // Apply a subtle hovering effect visually without moving actual physics box
            // Center the larger visual sprite over the smaller collision hitbox
            const vx = this.x + (this.width / 2) - (this.visualWidth / 2);
            const vy = this.y + (this.height / 2) - (this.visualHeight / 2);
            const hoverY = vy + Math.sin(Date.now() / 200) * 4;
            
            ctx.save();
            if (this.facingRight) {
                ctx.translate(vx + this.visualWidth, hoverY);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, this.visualWidth, this.visualHeight);
            } else {
                ctx.drawImage(img, vx, hoverY, this.visualWidth, this.visualHeight);
            }
            ctx.restore();
        }
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = type === 'SKULL_BUG' ? 0.9 : type === 'HORNED_BLOB' ? 0.5 : type === 'BOG_ZOMBIE' ? 0.9 : 0;
        this.vy = 0;
        this.direction = 1;
        this.dead = false;
        this.crushed = false;
        this.crushedTimer = 0;

        // Set dimensions based on type
        if (type === 'SKULL_BUG') {
            this.width  = 54;
            this.height = 68;
        } else if (type === 'HORNED_BLOB') {
            this.width  = 54;  // same skeleton sprite
            this.height = 68;
        } else if (type === 'BOG_ZOMBIE') {
            this.width  = 64;  // Slightly larger than 54
            this.height = 80;  // Slightly larger than 68
        } else {
            // FIRE_IMP — flying skeleton is wide with wings
            this.width  = 120; // Larger menacing size
            this.height = 85;
        }

        if (type === 'FIRE_IMP') {
            this.startY = y;
            this.bounceTimer = Math.random() * Math.PI * 2;
        }

        // Walk animation state (for ground enemies)
        this.animFrame = 0;   // 0 = walk1, 1 = walk2
        this.animTimer = 0;   // counts up each update tick
        this.animSpeed = 12;  // ticks per frame
    }

    update(engine) {
        if (this.dead) return;
        if (this.crushed) {
            this.crushedTimer--;
            if (this.crushedTimer <= 0) this.dead = true;
            return;
        }
        const levelGrid = engine.levelGrid;
        const player = engine.player;

        if (this.type === 'SKULL_BUG' || this.type === 'HORNED_BLOB' || this.type === 'BOG_ZOMBIE') {
            this.vy += 0.8;
            this.x += this.vx * this.direction;

            // Accurate wall collision checking for large hitboxes
            const checkX = this.direction === 1 ? this.x + this.width : this.x;
            const tileX = Math.floor(checkX / TILE_SIZE);
            const tileY1 = Math.floor(this.y / TILE_SIZE);
            const tileY2 = Math.floor((this.y + this.height - 0.1) / TILE_SIZE);

            let hitWall = false;
            for (let r = tileY1; r <= tileY2; r++) {
                if (levelGrid[r] && levelGrid[r][tileX] && levelGrid[r][tileX] !== TILES.EMPTY && levelGrid[r][tileX] !== TILES.LAVA && levelGrid[r][tileX] !== TILES.SWAMP) {
                    hitWall = true;
                    break;
                }
            }

            // Platform Edge Turnaround detection
            let walkingOnLedge = true;
            const footX = this.direction === 1 ? this.x + this.width + 4 : this.x - 4;
            const footY = Math.floor((this.y + this.height + 4) / TILE_SIZE);
            const nextTileX = Math.floor(footX / TILE_SIZE);
            
            if (levelGrid[footY] && (levelGrid[footY][nextTileX] === TILES.EMPTY || levelGrid[footY][nextTileX] === TILES.LAVA)) {
                walkingOnLedge = false;
            }

            if (hitWall || !walkingOnLedge) {
                this.direction *= -1;
            }

            this.y += this.vy;
            const checkTileY = Math.floor((this.y + this.height) / TILE_SIZE);
            const checkTileX1 = Math.floor(this.x / TILE_SIZE);
            const checkTileX2 = Math.floor((this.x + this.width - 0.1) / TILE_SIZE);

            if (levelGrid[checkTileY]) {
                let hitFloor = false;
                for (let c = checkTileX1; c <= checkTileX2; c++) {
                    const t = levelGrid[checkTileY][c];
                    // Swamp (16) acts as a solid floor for enemies!
                    if (t && t !== TILES.EMPTY && t !== TILES.LAVA) {
                        hitFloor = true;
                        break;
                    }
                }
                if (hitFloor) {
                    this.y = checkTileY * TILE_SIZE - this.height;
                    this.vy = 0;
                }
            }
        } 
        else if (this.type === 'FIRE_IMP') {
            this.bounceTimer += 0.05;
            this.y = this.startY + Math.sin(this.bounceTimer) * 55;
            
            // Look left unless Hexly passes them to the right
            if (player.x > this.x + this.width / 2) {
                this.direction = 1;
            } else {
                this.direction = -1;
            }
        }

        // Advance walk/flight animation for all enemies
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = 1 - this.animFrame; // toggle 0 <-> 1
        }
        // Guard against overflow of animTimer (unlikely but safe)
        if (this.animTimer > 1000) this.animTimer = 0;
    }

    draw(ctx, cameraX, player = null) {
        if (this.dead) return;

        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);

        if (this.type === 'FIRE_IMP') {
            // Flying skeleton demon
            const frame1Ready = flyingSkeletonImgLoaded;
            const frame2Ready = flyingSkeleton2ImgLoaded;

            let facingScale = 1;
            if (player) {
                // Look left natively (1). If player is to the right, scale -1 (facing right).
                facingScale = (player.x + player.width / 2 > this.x + this.width / 2) ? -1 : 1;
            }

            if (frame1Ready && frame2Ready) {
                ctx.save();
                if (this.crushed) {
                    // Flatten to the floor
                    ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height));
                    ctx.scale(facingScale, 0.3);
                    const frameImg = this.animFrame === 0 ? flyingSkeletonImg : flyingSkeleton2Img;
                    ctx.drawImage(frameImg, -this.width / 2, -this.height, this.width, this.height);
                } else {
                    ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
                    ctx.scale(facingScale, 1);
                    const frameImg = this.animFrame === 0 ? flyingSkeletonImg : flyingSkeleton2Img;
                    ctx.drawImage(frameImg, -this.width / 2, -this.height / 2, this.width, this.height);
                }
                ctx.restore();
            } else if (flyingSkeletonImgLoaded) {
                ctx.save();
                ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
                ctx.scale(facingScale, 1);
                ctx.drawImage(flyingSkeletonImg,
                    -this.width / 2, -this.height / 2,
                    this.width, this.height);
                ctx.restore();
            }

        } else if (this.type === 'BOG_ZOMBIE') {
            const walk1Ready = bogZombie1ImgLoaded;
            const walk2Ready = bogZombie2ImgLoaded;
            
            if (walk1Ready && walk2Ready) {
                if (!bogZombie1Img.trimBounds) bogZombie1Img.trimBounds = getSpriteTrimBounds(bogZombie1Img);
                if (!bogZombie2Img.trimBounds) bogZombie2Img.trimBounds = getSpriteTrimBounds(bogZombie2Img);
                
                const frameImg = this.animFrame === 0 ? bogZombie1Img : bogZombie2Img;
                const sourceImage = frameImg.processedCanvas || frameImg;
                
                const b1 = bogZombie1Img.trimBounds;
                const b2 = bogZombie2Img.trimBounds;
                
                // Calculate a unified global bounding box that encompasses BOTH frames!
                // This perfectly preserves their relative alignment so they don't jitter,
                // while still aggressively cropping transparency so they don't float.
                const minX = Math.min(b1.x, b2.x);
                const minY = Math.min(b1.y, b2.y);
                const maxX = Math.max(b1.x + b1.w, b2.x + b2.w);
                const maxY = Math.max(b1.y + b1.h, b2.y + b2.h);
                
                const globalW = maxX - minX;
                const globalH = maxY - minY;
                
                // Scale the global bounding box to fit the new 80px hitbox height
                const scale = 80 / globalH;
                let drawW = globalW * scale;
                let drawH = globalH * scale;
                
                const cx = this.x + this.width / 2;
                let cy = this.y + this.height; // Exactly at the floor
                
                if (this.crushed) {
                    drawH = 20; // squished flat
                    drawW *= 1.2; // slight bulge out horizontally
                }

                ctx.save();
                ctx.translate(Math.round(cx), Math.round(cy));
                
                if (this.direction === 1) ctx.scale(-1, 1);
                
                ctx.imageSmoothingEnabled = true;
                // Draw the global bounding box region from the source image
                ctx.drawImage(sourceImage, minX, minY, globalW, globalH, -drawW / 2, -drawH, drawW, drawH);
                ctx.imageSmoothingEnabled = false;
                ctx.restore();
            }
        } else {
            // SKULL_BUG and HORNED_BLOB — 2-frame walk animation
            const walk1Ready = skeletonWalk1ImgLoaded;
            const walk2Ready = skeletonWalk2ImgLoaded;

            // Target visual size: 54x68
            let drawW = 54;
            let drawH = 68;
            if (this.crushed) {
                drawW = 60;
                drawH = 20; // squished flat
            }
            const dx = this.x + this.width / 2 - drawW / 2;
            const dy = this.y + this.height - drawH + 5; // Shift down by 5px to align with visual floor surface (black border)

            if (walk1Ready && walk2Ready) {
                // Pick the current walk frame
                const frameImg = this.animFrame === 0 ? skeletonWalk1Img : skeletonWalk2Img;
                // Draw beautifully auto-trimmed at a constant size!
                drawSpriteAutoTrimmed(ctx, frameImg, dx, dy, drawW, drawH, this.direction === 1);
            } else if (skeletonImgLoaded) {
                // Fallback to static skeleton
                drawSpriteAutoTrimmed(ctx, skeletonImg, dx, dy, drawW, drawH, this.direction === 1);
            }
        }
    }
}


// ----------------------------------------------------

// ============================================================
// CRUSHER — Ceiling-mounted instant-kill trap
// Tile ID 21 — Level 4 (The Avarice Yard) only.
// Timer-driven: every ~5 seconds it warns (shake), then slams,
// then slowly retracts. Player detection is NOT required.
// ============================================================
class Crusher {
    constructor(x, y) {
        // x, y = top-left pixel of the tile cell that placed this crusher
        this.tileX = x;
        this.tileY = y;

        // Visual size — wide and brutal (4 tiles wide × 2 tiles tall)
        // Reference image shows crusher ~4x the character's width, landscape orientation
        this.width  = TILE_SIZE * 4;   // 180px wide
        this.height = TILE_SIZE * 2;   // 90px tall

        // Draw centered on the placed tile column
        // (4 tiles wide, so offset left by 1.5 tiles to center on the 1-tile anchor)
        this.drawOffsetX = -TILE_SIZE * 1.5;

        // Rest position: hangs from ceiling, bottom flush with the tile row
        this.restY      = y - this.height + TILE_SIZE;
        this.y          = this.restY;

        // Slam target: bottom of crusher reaches the floor of the open space
        this.slamTargetY = y + TILE_SIZE * 1.5;

        // Speeds
        this.slamSpeed    = 22;  // px/frame — fast and brutal
        this.retractSpeed = 1.5; // px/frame — slow, menacing return

        // Timer-driven cycle (frames @ 60fps)
        // WAIT(300) → SHAKE(60) → SLAM → RETRACT → repeat
        this.WAIT_FRAMES  = 300; // 5 seconds idle
        this.SHAKE_FRAMES = 60;  // 1 second warning shake

        // State machine: 'WAIT' | 'SHAKE' | 'SLAM' | 'RETRACT'
        this.state      = 'WAIT';
        this.stateTimer = this.WAIT_FRAMES;

        // Shake offset (set each frame while shaking)
        this.shakeX = 0;
        this.shakeY = 0;

        this.hasKilledThisSlam = false;
    }

    update(engine) {
        const p = engine.player;

        switch (this.state) {

            case 'WAIT':
                this.shakeX = 0;
                this.shakeY = 0;
                this.stateTimer--;
                if (this.stateTimer <= 0) {
                    this.state      = 'SHAKE';
                    this.stateTimer = this.SHAKE_FRAMES;
                    this.hasKilledThisSlam = false;
                }
                break;

            case 'SHAKE':
                // Mirror the falling-platform shake: ±4px random jitter
                this.shakeX = (Math.random() - 0.5) * 4;
                this.shakeY = (Math.random() - 0.5) * 4;
                this.stateTimer--;
                if (this.stateTimer <= 0) {
                    this.shakeX = 0;
                    this.shakeY = 0;
                    this.state  = 'SLAM';
                }
                break;

            case 'SLAM':
                this.y = Math.min(this.y + this.slamSpeed, this.slamTargetY);

                // Kill check — instant death on contact
                if (!this.hasKilledThisSlam) {
                    const baseDrawX  = this.tileX + this.drawOffsetX;
                    const cLeft      = baseDrawX;
                    const cRight     = baseDrawX + this.width;
                    const crusherBot = this.y + this.height;

                    const overlapX = p.x + p.width > cLeft && p.x < cRight;
                    const overlapY = crusherBot >= p.y && this.y < p.y + p.height;

                    if (overlapX && overlapY) {
                        this.hasKilledThisSlam = true;
                        engine.damagePlayer(true); // instant death
                    }
                }

                if (this.y >= this.slamTargetY) {
                    this.state = 'RETRACT';
                }
                break;

            case 'RETRACT':
                this.y = Math.max(this.y - this.retractSpeed, this.restY);
                if (this.y <= this.restY) {
                    this.state      = 'WAIT';
                    this.stateTimer = this.WAIT_FRAMES;
                }
                break;
        }
    }

    draw(ctx, cameraX) {
        const baseX = this.tileX + this.drawOffsetX;
        const drawX = Math.round(baseX - cameraX + this.shakeX);
        const drawY = Math.round(this.y + this.shakeY);

        // 3 chains matching reference image: left, center, right
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth   = 5;
        const chainPositions = [drawX + this.width * 0.15, drawX + this.width * 0.5, drawX + this.width * 0.85];
        chainPositions.forEach(cx => {
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, drawY);
            ctx.stroke();
        });

        // Crusher body
        if (crusherImgLoaded) {
            ctx.drawImage(crusherImg, drawX, drawY, this.width, this.height);
        } else {
            // Fallback: dark slab with red warning stripe at bottom
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(drawX, drawY, this.width, this.height);
            ctx.fillStyle = '#880000';
            ctx.fillRect(drawX, drawY + this.height - 10, this.width, 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('CRUSHER', drawX + 8, drawY + this.height / 2 + 4);
        }
    }
}

