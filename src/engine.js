// 9. CLEAN 2-LAYER WASTELAND PARALLAX ENGINE
// ----------------------------------------------------
class ParallaxBackground {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.mirror = true;
        this.offscreenCanvas = null;
        this.seamlessImage = null;
        this.lastBgSrc = null;
    }

    prepareSeamlessBackground() {
        if (!bgImgLoaded || this.mirror) return;
        
        if (!this.offscreenCanvas) {
            this.offscreenCanvas = document.createElement('canvas');
        }
        const w = bgImg.width;
        const h = bgImg.height;
        const blendW = Math.floor(w * 0.15); // 15% overlap
        const newW = w - blendW;
        
        this.offscreenCanvas.width = newW;
        this.offscreenCanvas.height = h;
        const octx = this.offscreenCanvas.getContext('2d');
        
        // 1. Draw main part
        octx.drawImage(bgImg, 0, 0, newW, h, 0, 0, newW, h);
        
        // 2. Fade the rightmost pixels of the original image over the left side
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = blendW;
        maskCanvas.height = h;
        const mctx = maskCanvas.getContext('2d');
        
        mctx.drawImage(bgImg, newW, 0, blendW, h, 0, 0, blendW, h);
        
        mctx.globalCompositeOperation = 'destination-in';
        const grad = mctx.createLinearGradient(0, 0, blendW, 0);
        grad.addColorStop(0, 'rgba(0,0,0,1)'); // Opaque at x=0
        grad.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent at x=blendW
        mctx.fillStyle = grad;
        mctx.fillRect(0, 0, blendW, h);
        
        octx.drawImage(maskCanvas, 0, 0);
        
        this.seamlessImage = this.offscreenCanvas;
        this.lastBgSrc = bgImg.src;
    }

    draw(ctx, cameraX) {
        if (bgImgLoaded) {
            if (!this.mirror && (!this.seamlessImage || this.lastBgSrc !== bgImg.src)) {
                this.prepareSeamlessBackground();
            }
            
            const imgToDraw = (!this.mirror && this.seamlessImage) ? this.seamlessImage : bgImg;
            
            // Preserve background aspect ratio for a seamless stitch
            const scale = this.height / imgToDraw.height;
            const scaledW = Math.floor(imgToDraw.width * scale);

            // A full seamless block consists of one normal and one horizontally mirrored image
            const fullBlockW = this.mirror ? (scaledW * 2) : scaledW;
            let scrollX = Math.floor((cameraX * 0.2)) % fullBlockW;
            if (scrollX < 0) scrollX += fullBlockW; // Handle negative camera coordinates
            
            ctx.save();
            ctx.translate(-scrollX, 0);
            
            // Draw enough copies to cover the screen plus enough extra for the scroll wrap
            const neededCopies = Math.ceil(this.width / scaledW) + 2; 
            let drawX = 0;
            for (let i = 0; i < neededCopies; i++) {
                if (this.mirror && i % 2 === 1) {
                    // Draw mirrored image
                    ctx.save();
                    ctx.translate(drawX + scaledW, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(imgToDraw, 0, 0, scaledW, this.height);
                    ctx.restore();
                } else {
                    // Draw normal image
                    ctx.drawImage(imgToDraw, drawX, 0, scaledW, this.height);
                }
                drawX += scaledW;
            }
            
            ctx.restore();
        } else {
            // Flat Spooky Underworld Sky (Crimson-Obsidian) Fallback
            const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
            skyGrad.addColorStop(0, '#000000');
            skyGrad.addColorStop(0.6, '#180305');
            skyGrad.addColorStop(1, '#47050a');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Layer 1: Wasteland Volcanic Silhouette Peaks (Scroll 10%)
            ctx.fillStyle = '#0f0205';
            const mountOffset = -(cameraX * 0.10) % 400;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const mx = mountOffset + i * 400;
                ctx.moveTo(mx - 100, 540);
                ctx.lineTo(mx + 80, 290); // Jagged mountains
                ctx.lineTo(mx + 220, 420);
                ctx.lineTo(mx + 310, 310);
                ctx.lineTo(mx + 450, 540);
            }
            ctx.closePath();
            ctx.fill();

            // Layer 2: Craggy Ash Cliffs & Horizons (Scroll 30%)
            ctx.fillStyle = '#260408';
            const cliffOffset = -(cameraX * 0.30) % 300;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const cx = cliffOffset + i * 300;
                ctx.moveTo(cx - 50, 540);
                ctx.lineTo(cx + 80, 410); // Spooky jagged volcanic horizons
                ctx.lineTo(cx + 180, 450);
                ctx.lineTo(cx + 250, 380);
                ctx.lineTo(cx + 350, 540);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}


// ----------------------------------------------------
// 10. MAIN HIGH-DEFINITION RETRO GAME LOOP ENGINE
// ----------------------------------------------------
class FallingPlatformEntity {
    constructor(c, r) {
        this.x = c * TILE_SIZE;
        this.y = r * TILE_SIZE;
        this.vy = 0;
        this.dead = false;
    }
    update() {
        this.vy += 0.25; // gravity
        this.y += this.vy;
        if (this.y > 700) this.dead = true;
    }
    draw(ctx, engine) {
        if (blockTileImgLoaded) {
            ctx.drawImage(blockTileImg, this.x, this.y, TILE_SIZE, TILE_SIZE);
        } else {
            ctx.fillStyle = '#aa00ff';
            ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
        }
    }
}

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.width = 200;
        this.height = 200;
        this.vx = -1.5;
        this.vy = 0;
        this.grounded = false;
        this.frameCounter = 0;
        this.fireballTimer = 120;
        this.jumpTimer = 180;
        this.dead = false;
    }
    update(engine) {
        this.frameCounter++;
        this.fireballTimer--;
        this.jumpTimer--;
        
        // Pacing
        if (this.x < this.startX - 150) this.vx = 1.5;
        if (this.x > this.startX + 150) this.vx = -1.5;
        
        // Jump to allow player under
        if (this.jumpTimer <= 0 && this.grounded) {
            this.vy = -16;
            this.grounded = false;
            this.jumpTimer = 180 + Math.random() * 60;
        }
        
        // Shoot fireball
        if (this.fireballTimer <= 0) {
            this.fireballTimer = 120 + Math.random() * 60;
            if (this.x - engine.player.x < 600) {
                // Shoot towards player
                const dir = this.x > engine.player.x ? -1 : 1;
                engine.enemyFireballs.push(new Fireball(this.x + this.width/2, this.y + this.height/2, dir * 5, 0.5));
                if (window.synth && window.synth.playFire) window.synth.playFire();
            }
        }
        
        // Physics
        this.vy += engine.physics.gravity;
        this.y += this.vy;
        this.x += this.vx;
        
        // Floor collision
        if (this.y + this.height >= 9 * TILE_SIZE) {
            this.y = 9 * TILE_SIZE - this.height;
            this.vy = 0;
            this.grounded = true;
        }
    }
    draw(ctx, cameraX) {
        if (!bossImg1Loaded || !bossImg2Loaded) return;
        const img = Math.floor(this.frameCounter / 15) % 2 === 0 ? bossImg1 : bossImg2;
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        ctx.save();
        if (this.vx > 0) {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(img, drawX, drawY, this.width, this.height);
        }
        ctx.restore();
    }
}

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();

        this.width = 960;
        this.height = 540;
        this.timeLimit = 300;
        
        // Apply level-specific settings
        this.currentLevelIndex = 0;
        const lvl = LEVELS[this.currentLevelIndex];
        this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
        
        this.state = 'TITLE';

        this.camera = { x: 0, targetX: 0 };
        this.frameCounter = 0;
        
        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.ejectedCoins = [];
        this.soulRewardHits = {};
        this.fireballs = [];
        this.enemyFireballs = [];  // Bowser-style hazard fireballs
        this.flowers = []; // Collectible powerups array
        this.enemyFireballTimer = 0;  // Countdown to next enemy fireball spawn
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];
        this.crushers = [];
        this.chainPattern = null;

        // Hexly configuration parameters (Size 78x90px - Super-sized 2 tiles tall!)
        this.player = {
            x: 0,
            y: 0,
            width: 44, // Tightened collision box (was 78) to fix edge floating
            height: 90,
            vx: 0,
            vy: 0,
            grounded: false,
            health: 3,
            maxHealth: 3,
            score: 0,
            coins: 0,
            poweredUp: false, // Morphing Fire Hexly state
            superPowered: false, // Star invincibility
            superTimer: 0,
            coyoteTimer: 0,
            jumpBufferTimer: 0,
            dropTimer: 0, // Delay for falling through platforms
            fireCooldown: 0, // Auto-fire delay
            invulTimer: 0,
            hurtTimer: 0,
            direction: 1,
            lastSafeX: 80,
            lastSafeY: 300,
            animTime: 0,
            crouching: false,
            shootTimer: 0
        };

        this.physics = {
            gravity: 0.52,
            acceleration: 0.38,
            friction: 0.85,
            maxSpeedX: 4.7,
            jumpForce: -16.2,
            maxFallSpeed: 10.0,
            coyoteDuration: 9,
            jumpBufferDuration: 6
        };

        this.background = new ParallaxBackground(this.width, this.height);

        this.screens = {
            title: document.getElementById('title-screen'),
            pause: document.getElementById('pause-screen'),
            gameover: document.getElementById('game-over-screen'),
            victory: document.getElementById('victory-screen'),
            hud: document.getElementById('hud-overlay')
        };

        this.setupMenuTriggers();
        this.initializeMap();
        this.mapCols = LEVELS[0].layout[0].length;
        
        // devGodMode: always-on in dev builds — god mode + level-menu access
        this.devGodMode = typeof DEV_MODE !== 'undefined' ? DEV_MODE : false;
        // isDevMode: tile-editor mode only (camera pan, palette, Hexly hidden) — starts OFF
        this.isDevMode = false;
        if (this.devGodMode) {
            this.devMenu = new DevMenu(this);
        }
        this.draggedTile = null;
        this.setupDevEditor();
    }

    setupMenuTriggers() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.devGodMode && this.devMenu) {
                    this.devMenu.show();
                } else {
                    this.audioSetup();
                    this.startGame();
                }
            });
        }

        const resetHandler = () => {
            synth.resume();
            this.resetGame();
        };

        window.addEventListener('keydown', (e) => {
            if (this.devMenu && this.devMenu.isVisible()) {
                if (e.code === 'Escape' || e.code === 'Backquote') {
                    this.devMenu.hide();
                    this.input.pausePressed = false; // prevent spurious pause on Escape
                }
                // Drain any digit keys queued while menu was open so they don't fire after close
                for (let i = 1; i <= 9; i++) this.input['digit' + i] = false;
                return;
            }

            // Backtick (~) — open dev menu from anywhere during play
            if (e.code === 'Backquote' && this.devGodMode && this.devMenu) {
                this.devMenu.show();
                return;
            }

            if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'Enter') {
                if (this.state === 'TITLE') {
                    if (this.devGodMode && this.devMenu) {
                        this.devMenu.show();
                    } else {
                        this.audioSetup();
                        this.startGame();
                    }
                } else if (this.state === 'GAMEOVER' || this.state === 'VICTORY' || this.state === 'LEVEL_TALLY') {
                    // Press space/W to restart or advance game
                    if (this.state === 'LEVEL_TALLY') {
                        this.nextLevel();
                    } else {
                        resetHandler();
                    }
                }
            }
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('pause-reset-btn').addEventListener('click', resetHandler);
    }

    audioSetup() {
        synth.init();
        // synth.musicEnabled = true; // Disabled during development
    }

    initializeMap() {
        const lvl = LEVELS[this.currentLevelIndex];
        const activeLevel = lvl.layout;
        
        // Load properties
        this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
        this.disableEmbers = lvl.disableEmbers || false;
        this.baseWindSpeed = lvl.windSpeed || 0;
        this.windDelay = lvl.windDelay || 0;
        this.windSpeed = this.windDelay > 0 ? 0 : this.baseWindSpeed;
        this.gustTimer = 0;
        this.gustStrength = 0;
        if (lvl.background) {
            if (!bgImg.src.includes(lvl.background)) {
                bgImgLoaded = false;
                bgImg.src = lvl.background;
            }
            document.getElementById('game-container').style.backgroundImage = 'url("' + lvl.background + '")';
            this.background.mirror = lvl.mirrorBackground !== false;
        } else {
            bgImgLoaded = false;
            bgImg.src = '';
            document.getElementById('game-container').style.backgroundImage = 'none';
            this.background.mirror = true;
        }

        // Handle level-specific ambience and sounds
        if (synth) {
            synth.playBellToll();
            if (this.currentLevelIndex === 0 || this.currentLevelIndex === 1) {
                synth.playAmbience(this.currentLevelIndex);
            } else {
                synth.stopAmbience();
            }
        }

        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.ejectedCoins = [];
        this.soulRewardHits = {};
        this.fireballs = [];
        this.enemyFireballs = [];
        this.flowers = [];
        this.enemyFireballTimer = 300; // First spawn after 5 seconds
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];
        this.crushers = [];
        this.mapCols = activeLevel[0].length;
        // Clear leftover particles from previous levels (e.g. red embers from level 1 bleeding into level 3)
        if (typeof particles !== 'undefined') particles.particles = [];

        let shardCount = 0;
        
        // Pad the level with 1 empty row at the top to push everything down by 1 row
        this.levelGrid.push(new Array(activeLevel[0].length).fill(0));

        for (let r = 0; r < activeLevel.length; r++) {
            const actualRow = r + 1; // Shift down by 1 row
            if (actualRow >= 12) continue; // Keep grid strictly 12 rows tall
            
            this.levelGrid[actualRow] = [];
            for (let c = 0; c < activeLevel[r].length; c++) {
                const cell = activeLevel[r][c];
                
                if (cell === 13) {
                    this.bosses.push(new Boss(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 14) {
                    this.levelGrid[actualRow][c] = TILES.FALLING_PLATFORM;
                } else if (cell === 7) {
                    this.coins.push(new SoulCoin(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 8) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'SKULL_BUG'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 9) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'FIRE_IMP'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 10) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'HORNED_BLOB'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 17) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'BOG_ZOMBIE'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 15) {
                    this.enemies.push(new Ghost(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 21) {
                    // Crusher — level 4 (The Avarice Yard) only
                    if (this.currentLevelIndex === 3) {
                        // Scan down from ceiling to find the actual floor Y for this column
                        let floorY = this.levelGrid.length * TILE_SIZE; // fallback: bottom of grid
                        for (let scanRow = 2; scanRow < this.levelGrid.length; scanRow++) {
                            if (this.isSolid(this.levelGrid[scanRow][c])) {
                                floorY = scanRow * TILE_SIZE;
                                break;
                            }
                        }
                        this.crushers.push(new Crusher(c * TILE_SIZE, floorY));
                    }
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else {
                    this.levelGrid[actualRow][c] = cell;
                }
            }
        }

        // Set maximum coin count dynamically based on the actual spawned shards!
        this.player.maxCoins = this.coins.length || 1;
    }

    startGame() {
        this.state = 'PLAYING';
        this.screens.title.classList.add('hidden');
        this.screens.hud.classList.remove('hidden');
        
        // Ensure ambience starts if it's the first level
        if (typeof synth !== 'undefined') {
            synth.playBellToll();
            if (this.currentLevelIndex <= 2) {
                synth.playAmbience(this.currentLevelIndex);
            }
            if (synth.startMusic && LEVELS[this.currentLevelIndex].music) {
                synth.startMusic(LEVELS[this.currentLevelIndex].music);
            }
        }
        
        this.resetGame();
    }

    triggerLevelClear() {
        if (this.state === 'PORTAL_ENTER') return; // Prevent triggering every frame
        this.state = 'PORTAL_ENTER';
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.invulTimer = 9999;
        if (window.synth && window.synth.playOneUp) window.synth.playOneUp(); // A nice sound for entering the portal

        // Find the portal center
        let portalX = this.player.x;
        let portalY = this.player.y;
        for (let r = 0; r < this.levelGrid.length; r++) {
            for (let c = 0; c < this.levelGrid[0].length; c++) {
                if (this.levelGrid[r][c] === TILES.PORTAL) {
                    portalX = c * TILE_SIZE + TILE_SIZE / 2;
                    portalY = r * TILE_SIZE + TILE_SIZE / 2;
                }
            }
        }
        
        this.portalCenterX = portalX;
        
        // Face the portal center
        this.player.direction = (this.player.x + this.player.width/2 < this.portalCenterX) ? 1 : -1;

        const walkInterval = setInterval(() => {
            if (this.state !== 'PORTAL_ENTER') {
                clearInterval(walkInterval);
                return;
            }
            
            // Walk forward
            this.player.x += this.player.direction * 1.5;
            
            // Animate walk cycle
            this.player.vx = this.player.direction * 1.5; // Ensure walk animations trigger
            
            // Check if fully clipped past the center
            const pastCenter = (this.player.direction === 1 && this.player.x > this.portalCenterX) || 
                               (this.player.direction === -1 && this.player.x + this.player.width < this.portalCenterX);

            if (pastCenter) {
                clearInterval(walkInterval);
                this.player.vx = 0;
                this.triggerTallyScreen(this.currentLevelIndex >= LEVELS.length - 1);
            }
        }, 16);
    }

    nextLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= LEVELS.length) {
            this.triggerTallyScreen(true);
            return;
        }
        
        if (typeof synth !== 'undefined') {
            if (this.currentLevelIndex <= 2) {
                synth.playAmbience(this.currentLevelIndex);
            }
            if (synth.startMusic && LEVELS[this.currentLevelIndex].music) {
                synth.startMusic(LEVELS[this.currentLevelIndex].music);
            }
        }
        
        const lvl = LEVELS[this.currentLevelIndex];
        this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
        if (lvl.background) {
            if (!bgImg.src.includes(lvl.background)) {
                bgImgLoaded = false;
                bgImg.src = lvl.background;
            }
            document.getElementById('game-container').style.backgroundImage = 'url("' + lvl.background + '")';
            this.background.mirror = lvl.mirrorBackground !== false;
        } else {
            bgImgLoaded = false;
            bgImg.src = '';
            document.getElementById('game-container').style.backgroundImage = 'none';
            this.background.mirror = true;
        }
        
        this.initializeMap(); // Load the new level grid!
        this.resetGame(true); // Soft reset! Preserves score and health!
    }

    triggerTallyScreen(isFinalLevel = false) {
        this.state = 'LEVEL_TALLY';
        
        // Stop all level music!
        if (typeof synth !== 'undefined') {
            if (synth.stopMusic) synth.stopMusic();
            if (synth.stopStarMusic) synth.stopStarMusic();
            synth.playVictory();
        }
        
        this.screens.tally = document.getElementById('tally-screen');
        this.screens.tally.classList.remove('hidden');
        
        const heading = document.getElementById('tally-heading');
        const subtext = document.getElementById('tally-subtext');
        if (isFinalLevel) {
            heading.innerText = 'INFERNO ESCAPED!';
            subtext.innerText = 'Hexly successfully leaped out of the underworld!';
        } else {
            heading.innerText = 'CIRCLE CLEARED';
            subtext.innerText = 'Hexly is descending deeper...';
        }
        
        const scoreSpan = document.getElementById('v-score');
        const coinSpan = document.getElementById('v-coins');
        const timeSpan = document.getElementById('v-time');
        
        // Hide the try again button temporarily
        const playAgainBtn = this.screens.tally.querySelector('.try-again-btn');
        if (playAgainBtn) playAgainBtn.style.display = 'none';
        
        let displayScore = this.player.score;
        let displayCoins = this.player.coins;
        let displayTime = this.timeRemaining;
        
        scoreSpan.innerText = displayScore;
        coinSpan.innerText = displayCoins;
        timeSpan.innerText = displayTime;
        
        const tallyInterval = setInterval(() => {
            if (this.state !== 'LEVEL_TALLY') {
                clearInterval(tallyInterval);
                return;
            }
            
            let changed = false;
            
            // Tally Time (50 points per second)
            if (displayTime > 0) {
                displayTime--;
                displayScore += 50;
                changed = true;
            }
            // Tally Coins (500 points per coin)
            else if (displayCoins > 0) {
                displayCoins--;
                displayScore += 500;
                changed = true;
            }
            
            if (changed) {
                scoreSpan.innerText = displayScore;
                coinSpan.innerText = displayCoins;
                timeSpan.innerText = displayTime;
                if (synth && synth.playCollect) synth.playCollect();
            } else {
                clearInterval(tallyInterval);
                
                // Update final persisted player score with the newly tallied points!
                this.player.score = displayScore;
                this.player.coins = 0; 
                
                if (isFinalLevel) {
                    this.state = 'VICTORY'; // Final state where spacebar works
                    if (playAgainBtn) playAgainBtn.style.display = 'block';
                } else {
                    // Short pause, then load next level automatically
                    setTimeout(() => {
                        this.nextLevel();
                    }, 2000); // 2 second pause
                }
            }
        }, 15); // much faster tick!
    }

    resetGame(isSoftReset = false, forceLevel = null) {
        this.state = 'PLAYING';
        this.screens.title.classList.add('hidden');
        this.screens.gameover.classList.add('hidden');
        if (this.screens.tally) this.screens.tally.classList.add('hidden');
        if (this.screens.victory) this.screens.victory.classList.add('hidden');
        this.screens.pause.classList.add('hidden');
        this.screens.hud.classList.remove('hidden');

        if (forceLevel !== null) {
            this.currentLevelIndex = forceLevel;
        } else if (!isSoftReset) {
            this.currentLevelIndex = 0;
        }

        // Preserve state if soft resetting between levels
        const savedScore = isSoftReset ? this.player.score : 0;
        const savedHealth = isSoftReset ? this.player.health : 3;
        const savedPower = isSoftReset ? this.player.poweredUp : false;

        this.player.x = 80;
        this.player.y = 300;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.direction = 1;
        this.player.health = savedHealth;
        this.player.score = savedScore;
        this.player.coins = 0;
        this.player.poweredUp = savedPower; // Preserve fireball morph across levels!
        this.player.superPowered = false;
        this.player.superTimer = 0;
        this.player.grounded = false;
        this.player.invulTimer = 0;
        this.player.hurtTimer = 0;
        this.player.lastSafeX = 80;
        this.player.lastSafeY = 300;
        this.player.shootTimer = 0;
        this.player.fireCooldown = 0;

        this.camera.x = 0;
        this.camera.targetX = 0;
        this.camera.floatX = 0;
        
        this.timeRemaining = this.timeLimit;
        this.initializeMap();
        this.updateHUD();
        particles.spawnHexlyVaporizeBlast(this.player.x, this.player.y, this.player.width, this.player.height);

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state === 'PLAYING' && !this.isDevMode) {
                this.timeRemaining--;
                this.updateHUD();
                if (this.timeRemaining <= 0) this.triggerGameOver();
            }
        }, 1000);
    }

    triggerGameOver() {
        this.state = 'GAMEOVER';
        if (synth && synth.playGameOver) synth.playGameOver();
        else synth.playDamage(); // Fallback
        this.screens.gameover.classList.remove('hidden');
        document.getElementById('go-score').innerText = this.player.score;
        document.getElementById('go-coins').innerText = `${this.player.coins}/${this.player.maxCoins}`;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    triggerVictory() {
        this.state = 'VICTORY';
        synth.playVictory();
        this.screens.victory.classList.remove('hidden');
        
        document.getElementById('vic-score').innerText = String(this.player.score).padStart(6, '0');
        document.getElementById('vic-coins').innerText = `${this.player.coins}/${this.player.maxCoins}`;
        const timeSpent = this.timeLimit - this.timeRemaining;
        const mins = Math.floor(timeSpent / 60);
        const secs = String(timeSpent % 60).padStart(2, '0');
        document.getElementById('vic-time').innerText = `${mins}:${secs}`;
        
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    togglePause() {
        if (this.state === 'PLAYING' && !this.isDevMode) {
            this.state = 'PAUSED';
            if (typeof synth !== 'undefined' && synth.pause) synth.pause();
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            if (typeof synth !== 'undefined' && synth.resume) synth.resume();
        }
    }

    takeScreenshot() {
        if (!this.canvas) return;
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `hexlys_inferno_screenshot_${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        this.showToast("Screenshot Saved!");
    }

    updateHUD() {
        const container = document.getElementById('heart-container');
        if (container) {
            container.innerHTML = '';
            for (let i = 0; i < this.player.health; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                container.appendChild(heart);
            }
        }
        
        const scoreVal = document.getElementById('score-val');
        if (scoreVal) {
            scoreVal.innerText = String(this.player.score).padStart(6, '0');
        }
    }

    showToast(message) {
        // Only show toasts for layout exporting, disable the annoying gameplay toasts!
        if (!message.includes('LAYOUT') && !message.includes('COPIED') && !message.includes('CONSOLE')) return;
        
        const toast = document.getElementById('toast-message');
        if (!toast) return;
        
        toast.innerText = message;
        toast.classList.remove('hidden');
        toast.style.display = 'block';
        toast.style.opacity = '1';
        
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.classList.add('hidden'), 500); // fade out
        }, 2000);
    }

    // ----------------------------------------------------
    // 11. ENGINE UPDATE CYCLES
    // ----------------------------------------------------
    updateCursorVisibility() {
        let desired = 'default';
        if (this.isDevMode) {
            desired = 'crosshair';
        }
        // TEMP: cursor visible during level building — re-enable 'none' before ship
        // } else if (this.state === 'PLAYING' || this.state === 'DYING') {
        //     desired = 'none';
        // }
        if (document.body.style.cursor !== desired) {
            document.body.style.cursor = desired;
        }
    }

    update() {
        this.input.updateGamepad();
        this.updateCursorVisibility();
        this.frameCounter++;
        
        // Digit 1-9 level warping — dev builds only
        if (this.devGodMode) {
            for (let i=1; i<=9; i++) {
                if (this.input['digit'+i]) {
                    this.input['digit'+i] = false;
                    if (i-1 < LEVELS.length) {
                        this.resetGame(false, i-1);
                        
                        // Update ambience and music for new level
                        if (typeof synth !== 'undefined') {
                            if (this.currentLevelIndex <= 2) {
                                synth.playAmbience(this.currentLevelIndex);
                            }
                            if (synth.startMusic && LEVELS[this.currentLevelIndex].music) {
                                synth.startMusic(LEVELS[this.currentLevelIndex].music);
                            }
                        }
                        
                        const lvl = LEVELS[this.currentLevelIndex];
                        this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
                        if (lvl.background) {
                            if (!bgImg.src.includes(lvl.background)) {
                                bgImgLoaded = false;
                                bgImg.src = lvl.background;
                            }
                            document.getElementById('game-container').style.backgroundImage = 'url("' + lvl.background + '")';
                        } else {
                            bgImgLoaded = false;
                            bgImg.src = '';
                            document.getElementById('game-container').style.backgroundImage = 'none';
                        }
                        return;
                    }
                }
            }
        }

        if (this.input.restartPressed || ((this.state === 'TITLE' || this.state === 'GAMEOVER') && (this.input.jumpPressed || this.input.shootPressed))) {
            this.audioSetup();
            this.resetGame();
        }

        if (this.isDevMode) {
            // Dev Mode camera panning
            if (this.input.left) {
                this.camera.x -= 10;
            } else if (this.input.right) {
                this.camera.x += 10;
            }
            this.camera.x = Math.max(0, Math.min(this.camera.x, (this.levelGrid[0].length * TILE_SIZE) - this.width));
        }
        
        if (this.input.pausePressed) {
            this.audioSetup();
            if (this.state === 'PLAYING' || this.state === 'PAUSED') this.togglePause();
            this.input.clearFrameTriggers();
            return;
        }

        if (this.input.screenshotPressed) {
            this.takeScreenshot();
            this.input.screenshotPressed = false; // Consume the input
        }

        // Allow particles + rendering to keep running during DYING (death animation plays out)
        if (this.state === 'DYING' || this.state === 'PORTAL_ENTER' || this.state === 'LEVEL_TALLY' || this.state === 'VICTORY' || this.state === 'GAMEOVER') {
            if (this.state === 'DYING' || this.state === 'PORTAL_ENTER') {
                particles.update(this.windSpeed); // Keep updating particles during death/portal
            }
            this.input.clearFrameTriggers();
            return;
        }

        if (this.state !== 'PLAYING') {
            this.input.clearFrameTriggers();
            return;
        }

        particles.update(this.windSpeed);
        
        // 1. Core Player Timers
        if (this.player.invulTimer > 0) this.player.invulTimer--;
        if (this.player.hurtTimer > 0) this.player.hurtTimer--;
        if (this.player.coyoteTimer > 0) this.player.coyoteTimer--;
        if (this.player.jumpBufferTimer > 0) this.player.jumpBufferTimer--;
        if (this.player.fireCooldown > 0) this.player.fireCooldown--;
        
        if (!this.input.left && !this.input.right && !this.input.up && !this.input.shootHeld && !this.input.down && Math.abs(this.player.vx) < 0.1 && this.player.grounded) {
            this.player.idleTimer = (this.player.idleTimer || 0) + 1;
        } else {
            this.player.idleTimer = 0;
        }
        
        if (this.player.superTimer > 0) {
            this.player.superTimer--;
            if (this.player.superTimer <= 0) {
                this.player.superPowered = false;
                synth.stopStarMusic();
            }
        }

        const p = this.player;
        const input = this.input;

        // Slow down walk cycle and instantly freeze to static pose when input keys are released
        if ((input.left || input.right) && p.grounded && !p.crouching) {
            p.animTime += 0.048 * Math.abs(p.vx); // Quadrupled animation speed for a faster walk cycle
        } else {
            p.animTime = 0;
        }
        // Prevent animTime from growing without bound (which can cause floating‑point slowdown)
        if (p.animTime > 1000) p.animTime = 0;

        // Crouch State Machine
        let wantCrouch = input.down;
        
        if (p.crouching) {
            if (!wantCrouch) {
                // Standing up height clearance check
                const testY = p.y - 45;
                const testH = 90;
                let blocked = false;
                
                const bounds = this.getTileBounds(p.x, testY, p.width, testH);
                for (let r = bounds.minY; r <= bounds.maxY; r++) {
                    for (let c = bounds.minX; c <= bounds.maxX; c++) {
                        const t = this.getTile(c, r);
                        if (this.isSolid(t)) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked) break;
                }
                
                if (blocked) {
                    wantCrouch = true;
                } else {
                    p.crouching = false;
                    p.height = 90;
                    p.y -= 45;
                }
            }
        } else {
            if (wantCrouch) {
                p.crouching = true;
                p.height = 45;
                p.y += 45;
            }
        }

        // 2. Horizontal physics calculations (Modern Smooth Momentum Buildup)
        if (p.sprintTimer === undefined) p.sprintTimer = 0;
        if (input.left || input.right) {
            p.sprintTimer++;
        } else {
            p.sprintTimer = 0;
        }

        // Smoothly interpolate max speed and acceleration over 25 frames (~0.4s)
        const sprintFactor = Math.min(1.0, p.sprintTimer / 25);
        const finalFactor = input.shootHeld ? 1.0 : sprintFactor;
        
        const currentAccel = this.physics.acceleration + (0.22 * finalFactor); // 0.38 -> 0.60
        const currentMaxSpeed = (this.physics.maxSpeedX + (3.3 * finalFactor)) * 1.1;  // Boosted sprint speed

        if (p.crouching) {
            p.vx *= 0.985; // Mario-style long slide when crouching!
        } else {
            if (input.left) {
                p.vx -= currentAccel;
                p.direction = -1;
            } else if (input.right) {
                p.vx += currentAccel;
                p.direction = 1;
            } else {
                p.vx *= this.physics.friction;
            }
        }

        // 2b. Ambient Wind Physics / Gust Physics
        let applyWind = this.baseWindSpeed !== 0;

        // Level 2 specific logic: no wind before the first gap (column 24)
        if (this.currentLevelIndex === 1 && p.x < 24 * TILE_SIZE) {
            applyWind = false;
        }

        if (this.isDevMode) {
            applyWind = false;
        }

        if (applyWind) {
            if (this.windDelay > 0) {
                this.windDelay--;
                this.windSpeed = 0;
            } else {
                if (this.gustTimer > 0) {
                    this.gustTimer--;
                    this.windSpeed = this.baseWindSpeed + this.gustStrength;
                } else {
                    this.windSpeed = this.baseWindSpeed;
                    // 0.5% chance per frame to start a gust
                    if (Math.random() < 0.005) {
                        this.gustTimer = 45; // 45 frames of gust
                        this.gustStrength = this.baseWindSpeed * (1 + Math.random() * 2);
                    }
                }
            }
            p.vx += this.windSpeed;
        } else {
            this.windSpeed = 0;
        }

        p.vx = Math.max(-currentMaxSpeed, Math.min(p.vx, currentMaxSpeed));

        // 3. Jumps physics calculations
        if (this.input.jumpPressed) {
            this.player.jumpBufferTimer = this.physics.jumpBufferDuration;
        }

        if (this.player.crouching) {
            this.player.dropTimer++;
        } else {
            this.player.dropTimer = 0;
        }

        if (this.player.grounded) {
            this.player.vy += this.physics.gravity;
            this.player.coyoteTimer = this.physics.coyoteDuration;
        } else {
            this.player.coyoteTimer--;
            // If sprinting fast, suppress gravity for the first few frames of falling
            // This allows the player to seamlessly run across 1-tile gaps (like falling platforms)
            if (this.player.coyoteTimer > 4 && Math.abs(this.player.vx) >= 4.5) {
                this.player.vy = 0;
            } else {
                this.player.vy += this.physics.gravity;
            }
        }

        if (this.player.jumpBufferTimer > 0 && this.player.coyoteTimer > 0) {
            synth.playJump();
            this.player.grounded = false;
            this.player.coyoteTimer = 0;
            this.player.jumpBufferTimer = 0;
            
            if (this.player.inQuicksand) {
                this.player.vy = this.physics.jumpForce * 0.95; // A touch harder to jump out of muck, but stronger than before
                // Splash of toxic goo vapor instead of dust
                for (let i = 0; i < 5; i++) {
                    particles.spawnHaze(this.player.x + this.player.width / 2 + (Math.random() - 0.5) * 20, this.player.y + this.player.height);
                }
            } else {
                this.player.vy = this.physics.jumpForce; // Normal jump force
                particles.spawnJumpDust(this.player.x + this.player.width / 2, this.player.y + this.player.height);
            }
        }

        if (!this.input.jump && this.player.vy < -2.0) {
            this.player.vy = -2.0;
        }

        if (this.player.vy > this.physics.maxFallSpeed) {
            this.player.vy = this.physics.maxFallSpeed;
        }

        // 4. Bouncing Fireball shooting logic (Individual shots only!)
        if (this.input.shootPressed && this.player.poweredUp && this.player.fireCooldown <= 0) {
            if (this.fireballs.length < 6) { // Max 6 active fireballs
                synth.playFireball();
                const fx = this.player.x + (this.player.direction === 1 ? this.player.width : -12);
                const fy = this.player.y + 15;
                this.fireballs.push(new Fireball(fx, fy, this.player.direction * 6.5, 1.0));
                this.player.shootTimer = 8; // Faster animation return
                this.player.fireCooldown = 6; // Shoot once every 6 frames
            }
        }
        
        if (this.player.shootTimer > 0) this.player.shootTimer--;

        this.resolveCollisions();

        // 5. Ambient embers and bubbling lava
        if (this.frameCounter % 15 === 0) {
            const rColX = Math.floor(Math.random() * this.levelGrid[0].length);
            for (let y = 9; y < 12; y++) {
                if (this.levelGrid[y]) {
                    if (this.levelGrid[y][rColX] === TILES.LAVA) {
                        particles.spawnLavaBubble(rColX * TILE_SIZE + Math.random() * TILE_SIZE, y * TILE_SIZE + 2);
                        break;
                    } else if (this.levelGrid[y][rColX] === TILES.SWAMP) {
                        particles.spawnHaze(rColX * TILE_SIZE + Math.random() * TILE_SIZE, y * TILE_SIZE + 2);
                        break;
                    }
                }
            }
        }
        if (this.frameCounter % 6 === 0) {
            const currentLevel = LEVELS[this.currentLevelIndex] || {};
            if (!currentLevel.disableEmbers) {
                const sX = this.camera.x + Math.random() * this.width;
                if (currentLevel.ambientParticle === 'haze') {
                    // Level 3: spawn haze mist
                    particles.spawnHaze(sX, 350 + Math.random() * 100);
                } else if (this.currentLevelIndex === 0) {
                    // Fire embers are level 1 only
                    particles.spawnEmber(sX, 100 + Math.random() * 300);
                }
            }
        }

        // 6. Entity Updates
        this.coins.forEach(coin => coin.update(this.frameCounter));
        if (this.ejectedCoins) {
            for (let i = this.ejectedCoins.length - 1; i >= 0; i--) {
                this.ejectedCoins[i].update();
                if (this.ejectedCoins[i].dead) this.ejectedCoins.splice(i, 1);
            }
        }
        this.enemies.forEach(enemy => enemy.update(this));
        this.flowers.forEach(flower => flower.update());

        for (const key in this.platformTimers) {
            this.platformTimers[key]--;
            if (this.platformTimers[key] <= 0) {
                const [c, r] = key.split(',').map(Number);
                this.levelGrid[r][c] = TILES.EMPTY;
                this.fallingPlatforms.push(new FallingPlatformEntity(c, r));
                if (window.synth && window.synth.playFallingTile) synth.playFallingTile();
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
        this.crushers.forEach(crusher => {
            crusher.update(this);

            // Solid collision — crusher body is impassable once below ceiling
            if (crusher.state === 'WAIT' || crusher.state === 'SHAKE') return;
            const p = this.player;
            const cLeft   = crusher.tileX + crusher.drawOffsetX;
            const cRight  = cLeft + crusher.width;
            const cTop    = crusher.y;
            const cBottom = crusher.y + crusher.height;
            const overlapX = p.x + p.width > cLeft && p.x < cRight;
            const overlapY = p.y + p.height > cTop  && p.y < cBottom;
            if (overlapX && overlapY) {
                // Instant kill if crusher is actively slamming down
                if (crusher.state === 'SLAM') {
                    this.damagePlayer(true);
                    return;
                }
                // Otherwise push player out horizontally (impassable wall)
                const pushLeft  = p.x + p.width - cLeft;
                const pushRight = cRight - p.x;
                if (pushLeft < pushRight) {
                    p.x = cLeft - p.width;
                } else {
                    p.x = cRight;
                }
                p.vx = 0;
            }
        });


        
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fb = this.fireballs[i];
            fb.update(this);
            if (fb.dead) this.fireballs.splice(i, 1);
        }

        // 6b. Enemy fireball spawning — level 1 only
        this.enemyFireballTimer--;
        if (this.enemyFireballTimer <= 0 && !this.disableEnemyFireballs && this.currentLevelIndex === 0) {
            // Spawn from right edge of current viewport + offset
            const spawnX = this.camera.x + this.width + 40;
            // Pick a random Y in the upper 2/3 of the level so it has room to arc down
            const spawnY = 80 + Math.random() * 280;
            const speed = 2.8 + Math.random() * 1.5;
            this.enemyFireballs.push(new EnemyFireball(spawnX, spawnY, speed));
            if (synth && synth.playFire) synth.playFire();
            // Next fireball in 4-8 seconds (240-480 frames)
            this.enemyFireballTimer = 240 + Math.floor(Math.random() * 240);
        }

        // Check if Hexly's fireballs destroy enemy fireballs
        for (let i = this.enemyFireballs.length - 1; i >= 0; i--) {
            const ef = this.enemyFireballs[i];
            ef.update(this);
            if (ef.dead) {
                this.enemyFireballs.splice(i, 1);
            }
        }

        this.resolveInteractions();

        // 7. Stable Lockstep Camera Follow - Hard-locked to player integer position to mathematically eliminate all pixel judder
        const targetX = Math.round(this.player.x) - 441;
        const maxScroll = (this.levelGrid[0].length * TILE_SIZE) - this.width;
        this.camera.x = Math.max(0, Math.min(targetX, maxScroll));

        this.input.clearFrameTriggers();
    }

    resolveCollisions() {
        this.player.x += this.player.vx;
        this.player.grounded = false;

        let bounds = this.getTileBounds(this.player.x, this.player.y, this.player.width, this.player.height);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r);
                if (this.isSolid(t)) {
                    if (this.player.vx > 0) {
                        this.player.x = c * TILE_SIZE - this.player.width;
                        this.player.vx = 0;
                    } else if (this.player.vx < 0) {
                        this.player.x = (c + 1) * TILE_SIZE;
                        this.player.vx = 0;
                    }
                }
            }
        }

        this.player.y += this.player.vy;
        bounds = this.getTileBounds(this.player.x, this.player.y, this.player.width, this.player.height);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r);
                if (this.isSolid(t)) {
                    if (this.player.vy > 0) {
                        this.player.y = r * TILE_SIZE - this.player.height;
                        this.player.vy = 0;
                        this.player.grounded = true;

                        if (t !== TILES.LAVA && t !== TILES.SWAMP && t !== TILES.PLATFORM && t !== TILES.FALLING_PLATFORM) {
                            this.player.lastSafeX = this.player.x;
                            this.player.lastSafeY = this.player.y;
                        }
                    } else if (this.player.vy < 0) {
                        this.player.y = (r + 1) * TILE_SIZE;
                        this.player.vy = 0;
                        this.triggerCeilingBump(c, r);
                    }
                } else if (this.isOneWay(t)) {
                    if (this.player.vy < 0 && t === TILES.FALLING_PLATFORM) {
                        // Bustable falling platform from underneath!
                        this.player.y = (r + 1) * TILE_SIZE;
                        this.player.vy = 0;
                        this.triggerCeilingBump(c, r);
                    }
                    
                    if (t === TILES.PLATFORM && this.player.crouching && this.player.dropTimer > 15) continue; // Drop through chains if holding down for a delay!
                    
                    // Only collide if falling DOWN, AND previously above the platform
                    if (this.player.vy > 0 && (this.player.y - this.player.vy + this.player.height <= r * TILE_SIZE + 0.1)) {
                        this.player.y = r * TILE_SIZE - this.player.height;
                        this.player.vy = 0;
                        this.player.grounded = true;

                        if (t === TILES.FALLING_PLATFORM && !this.platformTimers[`${c},${r}`]) {
                            this.platformTimers[`${c},${r}`] = 120; // 2 seconds
                        }

                        this.player.lastSafeX = this.player.x;
                        this.player.lastSafeY = this.player.y;
                    }
                }
            }
        }

        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.vx = 0;
        }
        if (this.player.y > 540) {
            this.damagePlayer(true); // Instant death fall
        }
    }

    triggerCeilingBump(col, row) {
        // Mario-style mechanic: Flip/kill enemies standing on top of bumped blocks
        const checkY = (row - 1) * TILE_SIZE;
        const checkX1 = col * TILE_SIZE;
        const checkX2 = checkX1 + TILE_SIZE;
        
        this.enemies.forEach(enemy => {
            if (enemy.dead || this.state !== 'PLAYING') return;
            const overlapX = enemy.x < checkX2 && (enemy.x + enemy.width) > checkX1;
            const enemyBottom = enemy.y + enemy.height;
            // Target enemies sitting precisely on the block
            const isAbove = enemyBottom >= (row * TILE_SIZE - 5) && enemyBottom <= (row * TILE_SIZE + 5);
            
            if (overlapX && isAbove) {
                enemy.dead = true;
                this.player.score += 150;
                synth.playStomp();
                if (enemy.constructor.name === 'Ghost') {
                    particles.spawnMistExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    this.showToast("+150 EXORCISED!");
                } else {
                    particles.spawnFireExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    this.showToast("+150 VAPORIZED!");
                }
                this.updateHUD();
            }
        });

        const tile = this.levelGrid[row][col];
        if (tile === TILES.BREAKABLE || tile === TILES.FALLING_PLATFORM) {
            this.levelGrid[row][col] = TILES.EMPTY;
            synth.playCrunch();
            particles.spawnBlockDebris(col * TILE_SIZE + TILE_SIZE/2, row * TILE_SIZE + TILE_SIZE/2);
            this.player.score += 15;
            this.updateHUD();
        } 
        else if (tile === TILES.REWARD) {
            this.levelGrid[row][col] = TILES.SPENT_REWARD;
            
            // Strike block: pop out Lava Flower powerup (or coin occasionally)
            const cx = col * TILE_SIZE;
            const cy = row * TILE_SIZE;
            
            synth.playCollect();
            this.flowers.push(new LavaFlower(cx, cy));
            this.showToast("POWERUP RELEASED!");
        }
        else if (tile === TILES.ONE_UP) {
            this.levelGrid[row][col] = TILES.SPENT_REWARD;
            
            synth.playOneUp();

            this.player.health = this.player.maxHealth;
            this.player.score += 500;
            this.showToast("1-UP!");
            this.updateHUD();
        }        else if (tile === TILES.SOUL_REWARD) {
            const key = `${col},${row}`;
            if (!this.soulRewardHits[key]) this.soulRewardHits[key] = 0;
            
            this.soulRewardHits[key]++;
            
            const cx = col * TILE_SIZE;
            const cy = row * TILE_SIZE;
            if (typeof EjectedSoulCoin !== 'undefined') {
                this.ejectedCoins.push(new EjectedSoulCoin(cx, cy));
            }
            this.player.coins++;
            this.player.score += 100;
            this.showToast("+1 SHARD");
            if (typeof synth !== 'undefined' && synth.playCollect) synth.playCollect();
            this.updateHUD();

            if (this.soulRewardHits[key] >= 6) {
                this.levelGrid[row][col] = TILES.SPENT_SOUL_REWARD;
                if (typeof particles !== 'undefined' && particles.spawnCrystalExplosion) particles.spawnCrystalExplosion(cx + TILE_SIZE/2, cy + TILE_SIZE/2, true);
                if (typeof synth !== 'undefined' && synth.playFallingTile) synth.playFallingTile();
            } else {
                if (typeof particles !== 'undefined' && particles.spawnCrystalExplosion) particles.spawnCrystalExplosion(cx + TILE_SIZE/2, cy + TILE_SIZE/2, false);
            }
        } 
    }

    damagePlayer(instantDeath = false) {
        if (this.isDevMode && this.player.health > 0) return; // God mode only while tile editor is active
        if (!instantDeath && (this.player.invulTimer > 0 || this.player.superPowered)) return;

        // If powered up, lose fireball power but stay alive! (Nintendo style)
        if (this.player.poweredUp && !instantDeath) {
            this.player.poweredUp = false;
            synth.playDamage();
            this.player.invulTimer = 90;
            this.player.hurtTimer = 25;
            this.player.vy = -6.0;
            this.player.vx = -this.player.direction * 3.5;
            this.player.grounded = false;
            this.showToast("POWER LOST!");
            return;
        }

        this.player.health--;
        this.updateHUD();
        
        // Every normal hit without a powerup now costs a life and forces a restart!
        if (synth.playLoseLife) synth.playLoseLife();
        else synth.playDamage(); // Fallback just in case
        
        this.player.vy = 0;
        this.player.vx = 0;
        this.player.invulTimer = 9999; // Prevent further damage

        const cabinet = document.getElementById('arcade-cabinet');
        cabinet.classList.add('pulse');
        setTimeout(() => cabinet.classList.remove('pulse'), 400);

        // Vaporize Hexly and freeze!
        particles.spawnHexlyVaporizeBlast(this.player.x, this.player.y, this.player.width, this.player.height);
        this.state = 'DYING';
        
        // Disable star mode if active
        this.player.superPowered = false;
        if (typeof synth !== 'undefined' && synth.stopStarMusic) synth.stopStarMusic();
        
        setTimeout(() => {
            if (this.state === 'DYING') {
                if (this.player.health <= 0) {
                    this.triggerGameOver();
                } else {
                    // Preserve health & score but reinitialize map and start position
                    const savedHealth = this.player.health;
                    const savedScore  = this.player.score;
                    this.initializeMap();
                    this.player.health = savedHealth;
                    this.player.score  = savedScore;
                    this.player.coins  = 0; // Reset collected coins so they match the fully respawned shards on the map!
                    this.player.poweredUp = false;
                    this.player.x = 80;
                    this.player.y = 300;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.player.direction = 1;
                    this.player.invulTimer = 120; // 2-second grace period
                    this.player.hurtTimer  = 0;
                    this.player.grounded   = false;
                    this.camera.x = 0;
                    this.camera.targetX = 0;
                    this.state = 'PLAYING';
                    this.updateHUD();
                    particles.spawnHexlyVaporizeBlast(this.player.x, this.player.y, this.player.width, this.player.height);
                    this.showToast('BACK TO START!');
                }
            }
        }, 1200); // 1.2s delay to let the death sound and explosion play out
    }

    resolveInteractions() {
        if (this.isDevMode) return;
        const px = this.player.x;
        const py = this.player.y;
        const pw = this.player.width;
        const ph = this.player.height;

        // 1. Soul Shard collections
        this.coins.forEach(coin => {
            if (coin.collected) return;
            // Generous AABB collision detection to make collection feel natural and responsive
            const hitX = px < coin.x + 18 && px + pw > coin.x - 18;
            const hitY = py < coin.y + 24 && py + ph > coin.y - 24;
            if (hitX && hitY) {
                coin.collected = true;
                this.player.coins++;
                this.player.score += 50;
                synth.playCollect();
                this.updateHUD();
                for (let i = 0; i < 6; i++) particles.spawnSoulSpark(coin.x, coin.y);
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

        // 2. Lava Flower collections (Fire Suit Power-up)
        this.flowers.forEach(flower => {
            if (flower.collected) return;
            // AABB overlapping
            const hitX = px < flower.x + 30 && px + pw > flower.x;
            const hitY = py < flower.y + 30 && py + ph > flower.y;
            if (hitX && hitY) {
                flower.collected = true;
                
                if (this.player.poweredUp) {
                    this.player.superPowered = true;
                    this.player.superTimer = 600; // 10 seconds of invincibility
                    synth.playStarMusic();
                    this.showToast("SUPER HEXLY INVINCIBLE!");
                } else {
                    this.player.poweredUp = true;
                    this.player.score += 500;
                    synth.playVictory();
                    this.showToast("FIRE HEXLY MORPHED!");
                }
                
                this.updateHUD();
                
                // Add particle explosion
                for (let i = 0; i < 20; i++) {
                    particles.spawnEmber(flower.x + 15, flower.y + 15);
                }
            }
        });

        // 3. Enemy stomping checking
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Skip collision if enemy is dying or already crushed
            if (enemy.dead || enemy.crushed || this.state !== 'PLAYING') continue;

            if (this.checkCollision(this.player, enemy)) {
                if (this.player.superPowered) {
                    // Star mode! Instantly destroy the enemy!
                    if (enemy.constructor.name === 'Ghost') {
                        enemy.dead = true;
                        particles.spawnMistExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    } else if (enemy.type === 'FIRE_IMP') {
                        enemy.dead = true;
                        particles.spawnFireExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    } else {
                        enemy.dead = true;
                        for (let i = 0; i < 15; i++) {
                            particles.spawnEmber(enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height);
                        }
                    }
                    this.player.score += 200;
                    synth.playStomp();
                    this.showToast("+200 SUPER KILL!");
                    continue; // Check next enemy!
                }
                
                // Head jump kill
                const py = this.player.y + this.player.height;
                const ey = enemy.y;
                if (this.player.vy > 0 && py < ey + 30 && py > ey) {
                    if (enemy.constructor.name === 'Ghost') {
                        enemy.dead = true;
                        particles.spawnMistExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                        this.showToast("+100 EXORCISED!");
                    } else if (enemy.type === 'FIRE_IMP') {
                        enemy.dead = true;
                        particles.spawnFireExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                        this.showToast("+100 BONE CRUSH!");
                    } else {
                        enemy.crushed = true;
                        enemy.crushedTimer = 15;
                        if (enemy.type === 'BOG_ZOMBIE') {
                            particles.spawnSlimeExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height);
                            this.showToast("+100 SWAMP SQUISH!");
                        } else {
                            particles.spawnStompExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                            this.showToast("+100 BONE CRUSH!");
                        }
                    }
                    this.player.score += 100;
                    this.player.vy = -6; // bounce off head
                    synth.playStomp();
                    
                    continue; // Multi-kill enabled!
                }
                this.damagePlayer();
            }
        }

        // 4. Portal Goal check
        const bounds = this.getTileBounds(px, py, pw, ph);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.PORTAL) {
                    this.triggerLevelClear();
                    return;
                }
            }
        }

        this.player.inQuicksand = false; // Reset before checking hazards
        // 5. Lava Hazard intersection checks
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const tileType = this.getTile(c, r);
                if (tileType === TILES.LAVA) {
                    // Lower the lava collision box by 20 pixels so the player has to fall into it
                    const lavaTop = r * TILE_SIZE + 20;
                    if (py + ph > lavaTop) {
                        this.damagePlayer(true); // Instant death on lava
                        return;
                    }
                } else if (tileType === TILES.SWAMP) {
                    const swampTop = r * TILE_SIZE + 10;
                    if (py + ph > swampTop) {
                        this.player.vx *= 0.5; // Heavy quicksand drag
                        this.player.inQuicksand = true;
                        
                        // Cap sink speed but allow upward leaps to escape
                        if (this.player.vy > 1.5) {
                            this.player.vy = 1.5; // Cap sink speed
                        } else if (this.player.vy < -2 && this.player.vy > -8) {
                            // Only lightly dampen upward movement if they are struggling, 
                            // but let fresh strong jumps (-12) escape the tile!
                            this.player.vy *= 0.95;
                        }
                        
                        this.player.grounded = true; // Allow jump escape
                    }
                }
            }
        }
    }

    getTile(col, row) {
        if (col < 0 || col >= this.levelGrid[0].length || row < 0 || row >= 12) return TILES.EMPTY;
        return this.levelGrid[row][col];
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    isSolid(tile) {
        return tile === TILES.GROUND || 
               tile === TILES.BREAKABLE || 
               tile === TILES.REWARD || 
               tile === TILES.ONE_UP || 
               tile === TILES.SOUL_REWARD || 
               tile === TILES.SPENT_SOUL_REWARD || 
               tile === TILES.SPENT_REWARD;
    }

    isOneWay(tile) {
        return tile === TILES.PLATFORM || 
               tile === TILES.FALLING_PLATFORM;
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
        const sg1Loaded = spawnGateImg && spawnGateImg.complete;
        const sg2Loaded = spawnGate2Img && spawnGate2Img.complete;
        if (sg1Loaded && sg2Loaded) {
            const floorY = 10 * 45; // 450 (Row 9 + 1 padding row)
            
            // The newly cropped image is 1254x1254 square
            const imgW = 250;
            const imgH = 250;
            
            const startX = LEVELS[this.currentLevelIndex].startX;
            
            // Center the gate around Hexly's starting X coordinate
            const drawX = startX - (imgW / 2) + (this.player.width / 2);
            
            // Sit exactly on the floor perfectly flush
            const drawY = floorY - imgH; 
            
            // 2-frame animation alternating every 15 frames
            const activeImg = (Math.floor((this.frameCounter || 0) / 15) % 2 === 0) ? spawnGateImg : spawnGate2Img;
            if (activeImg && activeImg.complete) {
                this.ctx.drawImage(activeImg, drawX, drawY, imgW, imgH);
            }
        }

        // Draw animated Fire Gate background at the boss arena for Level 1
        const fg1Loaded = fireGate1Img && fireGate1Img.complete;
        const fg2Loaded = fireGate2Img && fireGate2Img.complete;
        if (fg1Loaded && fg2Loaded && this.currentLevelIndex === 0) {
            // Start exactly to the right of the lava pit in the boss arena (Lava is at 212-215, so start at 216)
            const bossStartX = 216 * TILE_SIZE; 
            const bossEndX = LEVELS[0].layout[0].length * TILE_SIZE;
            
            const floorY = 10 * 45 + 20; // Pushed 20px further down into the ground
            const gateHeight = 150; // Much smaller than the boss
            
            // New aspect ratio is 1448x694
            const gateWidth = 1448 * (gateHeight / 694); 
            const drawY = floorY - gateHeight;
            
            // The image has two pillars. We stride by exactly the distance between the two pillars 
            // so the left pillar of the next image perfectly stacks over the right pillar of the previous one.
            const stride = gateWidth * 0.68; 
            
            const activeGate = (Math.floor((this.frameCounter || 0) / 15) % 2 === 0) ? fireGate1Img : fireGate2Img;
            
            for (let drawX = bossStartX; drawX < bossEndX; drawX += stride) {
                // Ensure we only draw if it's visible on screen
                if (drawX + gateWidth > this.camera.x && drawX < this.camera.x + this.width) {
                    this.ctx.drawImage(activeGate, drawX, drawY, gateWidth, gateHeight);
                }
            }
        }

        this.drawTiles();

        this.coins.forEach(coin => {
            if (!coin.collected) coin.draw(this.ctx, this.camera.x);
        });
        if (this.ejectedCoins) this.ejectedCoins.forEach(coin => coin.draw(this.ctx, this.camera.x));

        this.flowers.forEach(flower => {
            if (!flower.collected) flower.draw(this.ctx, this.camera.x);
        });

        this.fireballs.forEach(fb => fb.draw(this.ctx, this.camera.x));
        this.enemyFireballs.forEach(ef => ef.draw(this.ctx));
        this.fallingPlatforms.forEach(p => p.draw(this.ctx, this));
        this.bosses.forEach(b => b.draw(this.ctx, this.camera.x));
        this.crushers.forEach(c => c.draw(this.ctx, this.camera.x));

        this.enemies.forEach(enemy => {
            if (!enemy.dead) enemy.draw(this.ctx, this.camera.x, this.player);
        });

        particles.draw(this.ctx, 0);

        this.drawHexly();

        if (this.isDevMode) {
            this.drawDevEditor();
        }

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
        if (type === TILES.GROUND) {
            let tileImg = (level1TileImgLoaded ? level1TileImg : null);
            if (this.currentLevelIndex === 1 && level2TileImgLoaded) tileImg = level2TileImg;
            if (this.currentLevelIndex === 2 && level3TileImgLoaded) tileImg = level3TileImg;
            if (tileImg) {
                this.ctx.drawImage(tileImg, x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
                return;
            }
        }
        if (type === TILES.BREAKABLE && level1BreakableTileImgLoaded) {
            this.ctx.drawImage(level1BreakableTileImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.REWARD && powerupTileImgLoaded) {
            this.ctx.drawImage(powerupTileImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.ONE_UP && oneUpTileImgLoaded) {
            this.ctx.drawImage(oneUpTileImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.SOUL_REWARD && powerupShardTileImgLoaded) {
            this.ctx.save();
            // Explicitly kill any inherited shadow from lava/portal before we set ours
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.globalAlpha = 1;
            this.ctx.drawImage(powerupShardTileImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.restore();
            // Also clear shadow after restore so next tile starts clean
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.SPENT_SOUL_REWARD && powerupBrokenShardTileImgLoaded) {
            this.ctx.drawImage(powerupBrokenShardTileImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.SPENT_REWARD && powerupTileBrokenImgLoaded) {
            this.ctx.drawImage(powerupTileBrokenImg, x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            return;
        }
        if (type === TILES.PLATFORM && chainTileImgLoaded) {
            const c = Math.round(x / TILE_SIZE);
            const r = Math.round(y / TILE_SIZE);
            
            // Find the true left edge of this contiguous platform
            let startC = c;
            while (startC > 0 && this.getTile(startC - 1, r) === TILES.PLATFORM) {
                startC--;
            }
            
            // The camera's left-most visible column
            const screenStartCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE));
            
            // Only draw the chain if this is the true left edge, OR if it's the first visible tile on screen.
            // This prevents it from disappearing when the left edge scrolls off-screen!
            if (c !== startC && c !== screenStartCol) {
                return;
            }
            
            // Find the true right edge
            let endC = c;
            while (endC < this.mapCols && this.getTile(endC, r) === TILES.PLATFORM) {
                endC++;
            }
            
            const platformStartX = startC * TILE_SIZE;
            const platformWidth = (endC - startC) * TILE_SIZE;            
            
            // Match the original visual thickness of the chain (approx 20px) 
            const CHAIN_HEIGHT = 20;
            const scale = CHAIN_HEIGHT / 134; // 134 is the natural height of chain_tile.png
            let linkVisualWidth = 320 * scale; 
            
            // We want to dynamically calculate the stride so the final link perfectly touches the right edge
            const targetOverlapRatio = 0.35; 
            const targetStride = linkVisualWidth * (1 - targetOverlapRatio);
            
            let N = 1;
            if (platformWidth > linkVisualWidth) {
                N = Math.max(2, Math.round((platformWidth - linkVisualWidth) / targetStride) + 1);
            }
            
            let stride = 0;
            if (N > 1) {
                stride = (platformWidth - linkVisualWidth) / (N - 1);
            } else {
                linkVisualWidth = platformWidth; // Squash slightly to fit single tiles
            }
            
            const drawY = y;
            let drawX = platformStartX;
            
            for (let i = 0; i < N; i++) {
                this.ctx.drawImage(chainTileImg, drawX, drawY, linkVisualWidth, CHAIN_HEIGHT);
                drawX += stride;
            }
            return;
        }

        let matrix = null;
        
        if (type === TILES.FALLING_PLATFORM) {
            let dx = x;
            let dy = y;
            const c = Math.round(x / TILE_SIZE);
            const r = Math.round(y / TILE_SIZE);
            const timer = this.platformTimers[`${c},${r}`];
            if (timer && timer < 60) {
                dx += (Math.random() - 0.5) * 4;
                dy += (Math.random() - 0.5) * 4;
            }
            if (blockTileImgLoaded) {
                this.ctx.drawImage(blockTileImg, dx, dy, TILE_SIZE, TILE_SIZE);
            }
            return;
        }
        
        else if (type === TILES.ONE_UP) {
            return;
        }
        else if (type === TILES.REWARD) {
            return;
        }
        
        else if (type === TILES.LAVA || type === TILES.SWAMP) {
            // Slow 3-frame downward waterfall animation (18 ticks per frame = sluggish lava/swamp)
            const frame = Math.floor(this.frameCounter / 18) % 3;
            
            if (type === TILES.LAVA) {
                if (frame === 0) matrix = SPRITES.TILES.LAVA_A;
                else if (frame === 1) matrix = SPRITES.TILES.LAVA_B;
                else matrix = SPRITES.TILES.LAVA_C;
            } else {
                if (frame === 0) matrix = SPRITES.TILES.SWAMP_A;
                else if (frame === 1) matrix = SPRITES.TILES.SWAMP_B;
                else matrix = SPRITES.TILES.SWAMP_C;
            }

            // Draw the base tile first
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
            
            // Pulsing glow overlay using 'screen' composite
            const pulse = (Math.sin(this.frameCounter * 0.1) + 1) / 2; // 0..1 oscillation
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.globalAlpha = 0.15 + pulse * 0.25; // 0.15 to 0.40 breathing range
            const grd = this.ctx.createRadialGradient(
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2,
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE * 0.8
            );
            
            if (type === TILES.LAVA) {
                grd.addColorStop(0,   'rgba(255, 200, 50, 1)');
                grd.addColorStop(0.5, 'rgba(255, 60, 0, 0.8)');
                grd.addColorStop(1,   'rgba(180, 0, 0, 0)');
            } else {
                // Sickly jaundiced mustard glow
                grd.addColorStop(0,   'rgba(155, 161, 38, 0.6)');
                grd.addColorStop(0.5, 'rgba(114, 122, 27, 0.4)');
                grd.addColorStop(1,   'rgba(75, 82, 17, 0)');
            }
            
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.restore();
            
            return; // Lava handled — skip matrix draw at the end
        }
        else if (type === TILES.PORTAL) {
            if (portalImgLoaded) {
                const pw = 150;
                const ph = 225; // Proportional to 1024x1536
                const px2 = x + (TILE_SIZE - pw) / 2;
                // Anchor bottom exactly to the floor, plus a 15px offset to account for any transparent padding at the bottom of the image
                const py2 = y - ph + TILE_SIZE + 15;

                // --- Smooth color-dodge glow animation ---
                // Smooth pulse factor using sine wave (0 1 0 over 40 ticks)
                const pulseSin = (Math.sin(this.frameCounter * (Math.PI / 20)) + 1) / 2; // 0..1

                this.ctx.save();

                // Layer 1 - base portal image with animated shadow glow
                // Smoothly blend from #ff3300 to #ff9900
                const r = 255;
                const g = Math.floor(51 + pulseSin * 102); // 51 is 0x33, 153 is 0x99
                const b = 0;
                this.ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
                this.ctx.shadowBlur  = 20 + pulseSin * 30; // pulses 20 50
                this.ctx.drawImage(portalImg, px2, py2, pw, ph);

                // Layer 2 - smooth screen-blend bright inner light overlay
                this.ctx.globalCompositeOperation = 'screen';
                this.ctx.globalAlpha = 0.10 + pulseSin * 0.30; // Smooth 0.10 to 0.40
                
                // Draw a radial inner-glow ellipse over the portal aperture
                const grd = this.ctx.createRadialGradient(
                    px2 + pw * 0.42, py2 + ph * 0.52, 2,
                    px2 + pw * 0.42, py2 + ph * 0.52, pw * 0.55
                );
                grd.addColorStop(0,   'rgba(255,255,220,1)');
                grd.addColorStop(0.3, 'rgba(255,160,30,0.8)');
                grd.addColorStop(0.7, 'rgba(255,40,0,0.4)');
                grd.addColorStop(1,   'rgba(0,0,0,0)');
                this.ctx.fillStyle = grd;
                this.ctx.fillRect(px2, py2, pw, ph);

                this.ctx.restore();
            }
            return; // Portal handled — skip matrix draw
        }

        if (matrix) {
            // Draw blocks pixelated (Scale 4.5 = 45px)
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
        }
    }

    drawHexly() {
        const p = this.player;
        const ctx = this.ctx;
        
        ctx.save();
        
        if (this.state === 'PORTAL_ENTER' && this.portalCenterX !== undefined) {
            ctx.beginPath();
            const pxCanvas = this.portalCenterX - this.camera.x;
            if (p.direction === 1) { // Walking right, clip left of center
                ctx.rect(0, 0, pxCanvas, this.height);
            } else { // Walking left, clip right of center
                ctx.rect(pxCanvas, 0, this.width, this.height);
            }
            ctx.clip();
        }

        if (this.isDevMode) {
            ctx.restore();
            return;
        }
        if (this.state === 'DYING' || this.state === 'GAME_OVER') {
            ctx.restore();
            return;
        }
        if (p.invulTimer > 0 && Math.floor(p.invulTimer / 4) % 2 === 0) {
            ctx.restore();
            return;
        }

        if (hexlyImgLoaded) {
            ctx.save();
            
            // 1. Pick the correct animation frame image (custom jump/crouch frames included)
            let currentHexlyImg = hexlyImg;
            if (p.crouching && hexlyCrouchImgLoaded) {
                currentHexlyImg = hexlyCrouchImg;
            } else if (p.shootTimer > 0 && hexlyProjectileImgLoaded) {
                currentHexlyImg = hexlyProjectileImg;
            } else if (!p.grounded && hexlyJumpImgLoaded) {
                currentHexlyImg = hexlyJumpImg;
            } else if (p.grounded && Math.abs(p.vx) > 0.2 && hexlyWalk2ImgLoaded) {
                const walkFrame = Math.floor(p.animTime) % 2;
                currentHexlyImg = walkFrame === 0 ? hexlyImg : hexlyWalk2Img;
            } else if (p.idleTimer > 300 && playerImgIdle1Loaded && playerImgIdle2Loaded && playerImgIdle3Loaded) {
                const cycle = (p.idleTimer - 300) % 300;
                if (cycle < 180) {
                    currentHexlyImg = Math.floor(cycle / 15) % 2 === 0 ? playerImgIdle1 : playerImgIdle2;
                } else {
                    currentHexlyImg = playerImgIdle3;
                }
            }
            
            // Cache trim bounds and calculate dynamic dimensions keeping natural visual proportions
            if (!currentHexlyImg.trimBounds) {
                currentHexlyImg.trimBounds = getSpriteTrimBounds(currentHexlyImg);
            }
            const b = currentHexlyImg.trimBounds || { x: 0, y: 0, w: currentHexlyImg.naturalWidth || 690, h: currentHexlyImg.naturalHeight || 860 };
            
            const sourceW = b.w > 0 ? b.w : 690;
            const sourceH = b.h > 0 ? b.h : 860;
            
            let drawW, drawH;
            if (p.crouching) {
                // Perfect balanced size so he doesn't look tiny, but doesn't become huge.
                // Calculates width proportionally so he is NEVER distorted.
                drawH = 60;
                drawW = drawH * (sourceW / sourceH);
            } else {
                // Lock standing height to 90px to prevent jitter, 
                // and calculate width proportionally so he is NEVER distorted.
                drawH = 90;
                drawW = drawH * (sourceW / sourceH);
            }
            
            let dx = p.x + p.width / 2 - drawW / 2;
            let dy = p.y + p.height - drawH; // Align perfectly flush with his hitbox (feet on floor, head on ceiling)

            // 5. Apply Invulnerability translucent flash
            if (p.invulTimer > 0 && Math.floor(p.invulTimer / 4) % 2 === 0) {
                ctx.restore();
                return;
            }
            if (p.invulTimer > 0) {
                ctx.globalAlpha = 0.6;
            }
            
            if (p.superPowered) {
                // Fast white strobe effect
                const strobe = (Date.now() % 100) < 50;
                if (strobe) {
                    ctx.filter = 'brightness(1000%) drop-shadow(0 0 10px white) grayscale(100%)';
                }
            }
            
            // 5. Apply dynamic floor-anchored animations
            let scaleSaved = false;
            if (p.hurtTimer > 0) {
                // Rotate around the bottom center
                ctx.save();
                ctx.translate(p.x + p.width / 2, p.y + p.height);
                ctx.rotate(p.direction * 0.15);
                ctx.translate(-(p.x + p.width / 2), -(p.y + p.height));
                scaleSaved = true;
            } 
            else if (this.state === 'VICTORY') {
                const bounce = Math.abs(Math.sin(p.animTime * 2.2)) * 8;
                dy -= Math.round(bounce);
            }
            
            // 6. Draw Hexly beautifully auto-trimmed and auto-aligned!
            // If powered up, draw molten aura under him
            if (p.poweredUp) {
                ctx.save();
                ctx.shadowColor = '#ff5a00';
                ctx.shadowBlur = 12 + Math.sin(p.animTime * 1.2) * 8;
                drawSpriteAutoTrimmed(ctx, currentHexlyImg, dx, dy, drawW, drawH, p.direction === -1);
                ctx.restore();
            } else {
                drawSpriteAutoTrimmed(ctx, currentHexlyImg, dx, dy, drawW, drawH, p.direction === -1);
            }
            
            if (scaleSaved) ctx.restore();
            
            // Restore any rotation/scale saves
            if (scaleSaved) {
                ctx.restore();
            }
            
            ctx.restore();
        }
        
        ctx.restore();
    }

    // ----------------------------------------------------
    // 16. DEV MODE EDITOR
    // ----------------------------------------------------
    setupDevEditor() {
        const toggleBtn = document.getElementById('dev-toggle-btn');
        const exportBtn = document.getElementById('dev-export-btn');
        const palette = document.getElementById('dev-palette');
        const enemyPalette = document.getElementById('dev-enemy-palette');
        
        this.selectedDevTool = 7; // Default to Soul Shard

        // Sync button label with actual initial state (isDevMode starts false)
        toggleBtn.innerText = this.isDevMode ? 'DEV MODE: ON' : 'DEV MODE: OFF';
        toggleBtn.style.borderColor = this.isDevMode ? '#00ffaa' : '#ff4400';
        exportBtn.style.display = this.isDevMode ? 'block' : 'none';
        palette.style.display = this.isDevMode ? 'block' : 'none';
        enemyPalette.style.display = this.isDevMode ? 'block' : 'none';

        palette.addEventListener('change', () => {
            if (palette.value !== "0") {
                enemyPalette.value = "0"; // Clear enemy selection
                this.selectedDevTool = parseInt(palette.value, 10);
            }
        });

        enemyPalette.addEventListener('change', () => {
            if (enemyPalette.value !== "0") {
                palette.value = "0"; // Clear normal selection
                this.selectedDevTool = parseInt(enemyPalette.value, 10);
            }
        });
        
        toggleBtn.addEventListener('click', () => {
            this.isDevMode = !this.isDevMode;
            toggleBtn.innerText = this.isDevMode ? 'DEV MODE: ON' : 'DEV MODE: OFF';
            toggleBtn.style.borderColor = this.isDevMode ? '#00ffaa' : '#ff4400';
            exportBtn.style.display = this.isDevMode ? 'block' : 'none';
            palette.style.display = this.isDevMode ? 'block' : 'none';
            enemyPalette.style.display = this.isDevMode ? 'block' : 'none';
            
            if (this.isDevMode) {
                this.screens.hud.classList.add('hidden');
            } else {
                this.screens.hud.classList.remove('hidden');
                // Instantly apply changes by resetting the map
                this.resetGame();
            }
        });

        exportBtn.addEventListener('click', () => {
            const layout = LEVELS[this.currentLevelIndex].layout;
            
            // Sync live SoulCoins back to the layout before exporting
            // First, clear all 7s
            for (let r = 0; r < layout.length; r++) {
                for (let c = 0; c < layout[r].length; c++) {
                    if (layout[r][c] === 7) layout[r][c] = 0;
                }
            }
            // Then, write current live coins
            this.coins.forEach(coin => {
                const c = Math.floor(coin.x / TILE_SIZE);
                // The coin visually floats slightly above, so use Math.round to snap row perfectly
                const r = Math.round(coin.baseY / TILE_SIZE) - 1;
                if (r >= 0 && r < layout.length && c >= 0 && c < layout[0].length) {
                    layout[r][c] = 7;
                }
            });

            let str = '[\n';
            layout.forEach((row, i) => {
                str += '    [' + row.join(',') + ']' + (i < layout.length - 1 ? ',' : '') + '\n';
            });
            str += ']';

            const fallbackCopy = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.showToast('LAYOUT COPIED! PASTE IN CHAT!');
                } catch (err) {
                    this.showToast('PRESS F12 TO COPY FROM CONSOLE');
                    console.log(text);
                }
                document.body.removeChild(textArea);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(str).then(() => {
                    this.showToast('LAYOUT COPIED! PASTE IN CHAT!');
                }).catch(() => fallbackCopy(str));
            } else {
                fallbackCopy(str);
            }
            
            // ALSO Auto-save directly to file via our new local backend!
            if (window.electronAPI) {
                window.electronAPI.saveLevel(str).then(result => {
                    if (result.success) this.showToast('SAVED VIA ELECTRON!');
                    else if (!result.canceled) console.error("Electron save failed", result.error);
                });
            } else {
                fetch('http://127.0.0.1:8081/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: str
                }).then(() => {
                    this.showToast('AUTO-SAVED TO FILE!');
                }).catch(e => {
                    console.error("Auto-save failed", e);
                });
            }
        });

        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('mousedown', (e) => {
            if (!this.isDevMode) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            const worldX = mouseX + this.camera.x;
            const worldY = mouseY;
            
            // Check if clicking a live SoulCoin
            for (let i = 0; i < this.coins.length; i++) {
                const coin = this.coins[i];
                if (Math.abs(worldX - coin.x) < TILE_SIZE && Math.abs(worldY - coin.baseY) < TILE_SIZE) {
                    if (e.button === 2) { // Right click to delete
                        this.coins.splice(i, 1);
                        return;
                    }
                    if (e.button === 0) { // Left click to pick up
                        this.draggedLiveCoin = coin;
                        coin.isDragged = true;
                        return;
                    }
                }
            }

            const col = Math.floor(worldX / TILE_SIZE);
            const row = Math.floor(worldY / TILE_SIZE) - 1; // -1 because grid has 1 row pad at top
            const layout = LEVELS[this.currentLevelIndex].layout;
            
            if (row < 0 || row >= layout.length || col < 0 || col >= layout[0].length) return;

            // Right click = delete
            if (e.button === 2) {
                layout[row][col] = 0;
                this.levelGrid[row + 1][col] = 0; // Update live grid too
                return;
            }

            // Left click
            if (e.button === 0) {
                const selectedTileType = this.selectedDevTool || 7;
                const existing = layout[row][col];
                
                // Pick up existing if it matches a placeable type, else use selected type
                const placeables = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 21];
                const typeToDrag = placeables.includes(existing) ? existing : selectedTileType;
                
                if (typeToDrag === 7) {
                    if (existing === 7) {
                        layout[row][col] = 0;
                        this.levelGrid[row + 1][col] = 0;
                        let foundCoin = this.coins.find(c => Math.abs(c.x - (col * TILE_SIZE)) < 30 && Math.abs(c.y - ((row + 1) * TILE_SIZE)) < 30);
                        if (foundCoin) {
                            foundCoin.isDragged = true;
                            this.draggedLiveCoin = foundCoin;
                        } else {
                            const newCoin = new SoulCoin(col * TILE_SIZE, (row + 1) * TILE_SIZE);
                            newCoin.isDragged = true;
                            this.coins.push(newCoin);
                            this.draggedLiveCoin = newCoin;
                        }
                    } else {
                        const newCoin = new SoulCoin(worldX, worldY);
                        newCoin.isDragged = true;
                        this.coins.push(newCoin);
                        this.draggedLiveCoin = newCoin;
                    }
                    return;
                }

                this.draggedTile = { col, row, type: typeToDrag };
                layout[row][col] = 0; // Remove from map while dragging
                this.levelGrid[row + 1][col] = 0; // Update live grid too
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!this.isDevMode) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            if (this.draggedLiveCoin) {
                this.draggedLiveCoin.x = mouseX + this.camera.x;
                this.draggedLiveCoin.baseY = mouseY;
                this.draggedLiveCoin.y = mouseY; // Update visual instantly
            } else if (this.draggedTile) {
                this.draggedTile.mouseX = mouseX;
                this.draggedTile.mouseY = mouseY;
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (!this.isDevMode) return;
            if (e.button !== 0) return;

            const layout = LEVELS[this.currentLevelIndex].layout;

            if (this.draggedLiveCoin) {
                let dropCol = Math.floor(this.draggedLiveCoin.x / TILE_SIZE);
                let dropRow = Math.floor(this.draggedLiveCoin.baseY / TILE_SIZE) - 1;
                
                if (dropCol >= 0 && dropCol < layout[0].length) {
                    let snappedRow = dropRow;
                    while (snappedRow < layout.length - 1) {
                        const nextCell = layout[snappedRow + 1][dropCol];
                        if (this.isSolid(nextCell) || this.isOneWay(nextCell)) break;
                        snappedRow++;
                    }
                    this.draggedLiveCoin.x = dropCol * TILE_SIZE + TILE_SIZE / 2;
                    this.draggedLiveCoin.baseY = (snappedRow + 1) * TILE_SIZE + TILE_SIZE / 2 - 20; // Float slightly above
                }
                this.draggedLiveCoin.isDragged = false;
                this.draggedLiveCoin = null;
                return;
            }

            if (!this.draggedTile) return;

            const worldX = this.draggedTile.mouseX + this.camera.x;
            const worldY = this.draggedTile.mouseY;
            
            let dropCol = Math.floor(worldX / TILE_SIZE);
            let dropRow = Math.floor(worldY / TILE_SIZE) - 1;
            
            if (dropCol >= 0 && dropCol < layout[0].length && dropRow >= 0 && dropRow < layout.length) {
                // Prevent placing tile on top of another existing tile
                if (layout[dropRow][dropCol] === 0) {
                    layout[dropRow][dropCol] = this.draggedTile.type;
                    this.levelGrid[dropRow + 1][dropCol] = this.draggedTile.type;
                } else {
                    layout[this.draggedTile.row][this.draggedTile.col] = this.draggedTile.type;
                    this.levelGrid[this.draggedTile.row + 1][this.draggedTile.col] = this.draggedTile.type;
                }
            } else {
                layout[this.draggedTile.row][this.draggedTile.col] = this.draggedTile.type;
                this.levelGrid[this.draggedTile.row + 1][this.draggedTile.col] = this.draggedTile.type;
            }
            this.draggedTile = null;
        });
        
        canvas.addEventListener('contextmenu', e => {
            if (this.isDevMode) e.preventDefault();
        });
    }

    drawDevEditor() {
        this.ctx.save();
        
        // Draw grid overlay and placed enemies
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        const layout = LEVELS[this.currentLevelIndex].layout;
        for (let r = 0; r < layout.length; r++) {
            for (let c = 0; c < layout[r].length; c++) {
                const drawX = c * TILE_SIZE;
                const drawY = (r + 1) * TILE_SIZE;
                this.ctx.strokeRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
                
                const t = layout[r][c];
                if (t === 8 && skeletonImg.complete) this.ctx.drawImage(skeletonImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
                else if (t === 9 && flyingSkeletonImg.complete) this.ctx.drawImage(flyingSkeletonImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
                else if (t === 15 && ghostIdleImg.complete) this.ctx.drawImage(ghostIdleImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
                else if (t === 17 && bogZombie1ImgLoaded) this.ctx.drawImage(bogZombie1Img, drawX, drawY, TILE_SIZE, TILE_SIZE);
                else if (t === 18 && oneUpTileImgLoaded) this.ctx.drawImage(oneUpTileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
                else if (t === 21) {
                    // Crusher: grey block + red warning stripe
                    if (crusherImgLoaded) {
                        this.ctx.drawImage(crusherImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
                    } else {
                        this.ctx.fillStyle = '#2a2a2a';
                        this.ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
                        this.ctx.fillStyle = '#cc0000';
                        this.ctx.fillRect(drawX, drawY + TILE_SIZE - 8, TILE_SIZE, 8);
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.font = '8px monospace';
                        this.ctx.fillText('CR', drawX + 14, drawY + 26);
                    }
                }
            }
        }

        // Draw dragged tile preview
        if (this.draggedTile) {
            const t = this.draggedTile.type;
            const drawX = this.draggedTile.mouseX + this.camera.x - TILE_SIZE/2;
            const drawY = this.draggedTile.mouseY - TILE_SIZE/2;
            this.ctx.globalAlpha = 0.8;
            if (t === 7 && soulShardImgLoaded) this.ctx.drawImage(soulShardImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 3 && blockTileImgLoaded) this.ctx.drawImage(blockTileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 4 && powerupTileImgLoaded) this.ctx.drawImage(powerupTileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 2 && chainTileImgLoaded) this.ctx.drawImage(chainTileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 1) {
                let tileImg = (level1TileImgLoaded ? level1TileImg : null);
                if (this.currentLevelIndex === 1 && level2TileImgLoaded) tileImg = level2TileImg;
                if (this.currentLevelIndex === 2 && level3TileImgLoaded) tileImg = level3TileImg;
                if (tileImg) this.ctx.drawImage(tileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            }
            else if (t === 5) { this.ctx.fillStyle = '#ff4400'; this.ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE); } // Lava
            else if (t === 8 && skeletonImg.complete) this.ctx.drawImage(skeletonImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 9 && flyingSkeletonImg.complete) this.ctx.drawImage(flyingSkeletonImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 14 && blockTileImgLoaded) this.ctx.drawImage(blockTileImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 15 && ghostIdleImg.complete) this.ctx.drawImage(ghostIdleImg, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 16) { this.ctx.fillStyle = 'rgba(0, 100, 0, 0.7)'; this.ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE); }
            else if (t === 17 && bogZombie1ImgLoaded) this.ctx.drawImage(bogZombie1Img, drawX, drawY, TILE_SIZE, TILE_SIZE);
            else if (t === 21) {
                // Crusher drag preview
                if (crusherImgLoaded) {
                    this.ctx.drawImage(crusherImg, drawX, drawY, TILE_SIZE, TILE_SIZE * 1.5);
                } else {
                    this.ctx.fillStyle = '#2a2a2a';
                    this.ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
                    this.ctx.fillStyle = '#cc0000';
                    this.ctx.fillRect(drawX, drawY + TILE_SIZE - 8, TILE_SIZE, 8);
                }
            }
            this.ctx.globalAlpha = 1.0;
        }

        this.ctx.restore();
    }
}


// Start loop with bulletproof readyState check
function initGame() {
    const engine = new GameEngine();
    function gameLoop() {
        engine.update();
        engine.render();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
    window.gameEngine = engine; // EXPORT FOR DEBUGGING
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
} else {
    window.addEventListener('DOMContentLoaded', initGame);
}
