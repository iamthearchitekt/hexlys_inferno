const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

const restored = `class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();

        this.width = 960;
        this.height = 540;
        this.timeLimit = 300;
        this.state = 'TITLE';

        this.camera = { x: 0, targetX: 0 };
        this.frameCounter = 0;
        
        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.fireballs = [];
        this.enemyFireballs = [];  // Bowser-style hazard fireballs
        this.flowers = []; // Collectible powerups array
        this.enemyFireballTimer = 0;  // Countdown to next enemy fireball spawn
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];

        // Hexly configuration parameters (Size 78x90px - Super-sized 2 tiles tall!)
        this.player = {
            x: 0,
            y: 0,
            width: 78,
            height: 90,
            vx: 0,
            vy: 0,
            grounded: false,
            health: 3,
            maxHealth: 3,
            score: 0,
            coins: 0,
            poweredUp: false, // Morphing Fire Hexly state
            coyoteTimer: 0,
            jumpBufferTimer: 0,
            invulTimer: 0,
            hurtTimer: 0,
            direction: 1,
            lastSafeX: 80,
            lastSafeY: 300,
            animTime: 0,
            crouching: false
        };

        this.physics = {
            gravity: 0.52,
            acceleration: 0.38,
            friction: 0.85,
            maxSpeedX: 4.2,
            jumpForce: -15.0,
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
    }

    setupMenuTriggers() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.audioSetup();
            this.startGame();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });

        const resetHandler = () => {
            synth.resume();
            this.resetGame();
        };
        document.getElementById('pause-reset-btn').addEventListener('click', resetHandler);
        document.getElementById('retry-btn').addEventListener('click', resetHandler);
        document.getElementById('victory-retry-btn').addEventListener('click', resetHandler);
    }

    audioSetup() {
        synth.init();
        synth.musicEnabled = true;
    }

    initializeMap() {
        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.fireballs = [];
        this.enemyFireballs = [];
        this.flowers = [];
        this.enemyFireballTimer = 300; // First spawn after 5 seconds
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];

        let shardCount = 0;
        
        // Pad the level with 1 empty row at the top to push everything down by 1 row
        this.levelGrid.push(new Array(LEVEL_DATA[0].length).fill(0));

        for (let r = 0; r < LEVEL_DATA.length; r++) {
            const actualRow = r + 1; // Shift down by 1 row
            if (actualRow >= 12) continue; // Keep grid strictly 12 rows tall
            
            this.levelGrid[actualRow] = [];
            for (let c = 0; c < LEVEL_DATA[r].length; c++) {
                const cell = LEVEL_DATA[r][c];
                
                if (cell === 13) {
                    this.bosses.push(new Boss(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 14) {
                    this.levelGrid[actualRow][c] = TILES.FALLING_PLATFORM;
                } else if (cell === 7) {
                    if (shardCount % 3 === 0) {`;

code = code.replace(/                        this\.coins\.push\(new SoulCoin\(c \* TILE_SIZE, actualRow \* TILE_SIZE\)\);\n                    \}\n                    shardCount\+\+;/, restored + '\n                        this.coins.push(new SoulCoin(c * TILE_SIZE, actualRow * TILE_SIZE));\n                    }\n                    shardCount++;');

fs.writeFileSync('game.js', code);
console.log("Fixed!");
