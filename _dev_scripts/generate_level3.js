const fs = require('fs');
const path = require('path');

const ROWS = 12;
const COLS = 250;

// Tile IDs
const EMPTY = 0;
const GROUND = 1;
const PLATFORM = 2;
const BREAKABLE = 3;
const REWARD = 4;
const SWAMP = 16;
const PORTAL = 6;
const COIN = 7;
const SKELLY = 8;
const SKULL = 9;
const SPINE = 10;
const FLOWER = 12;
const BOSS = 13;
const FALLING = 14;
const GHOST = 15;

const grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));

// Build layout
for (let c = 0; c < COLS; c++) {
    // Fill the bottom two rows with Swamp everywhere, except safe zones
    grid[10][c] = SWAMP;
    grid[11][c] = SWAMP;
    
    // Start zone
    if (c < 25) {
        grid[8][c] = GROUND;
        grid[9][c] = GROUND;
        grid[10][c] = GROUND;
        grid[11][c] = GROUND;
    }
    
    // Boss Zone
    else if (c > 215 && c < 240) {
        grid[8][c] = GROUND;
        grid[9][c] = GROUND;
        grid[10][c] = GROUND;
        grid[11][c] = GROUND;
    }
    
    // End Zone (Portal)
    else if (c >= 240) {
        grid[8][c] = GROUND;
        grid[9][c] = GROUND;
        grid[10][c] = GROUND;
        grid[11][c] = GROUND;
    }
    
    // General traversal (Swampy pits with platforms and stepping stones)
    else {
        if (c % 15 < 3) {
            // Stepping stones
            grid[9][c] = GROUND;
            if (c % 30 < 3 && c > 40) grid[8][c] = SKELLY;
        } else if (c % 10 === 5) {
            // High platforms
            grid[5][c] = PLATFORM;
            grid[5][c+1] = PLATFORM;
            grid[5][c+2] = PLATFORM;
            if (c % 20 === 5) grid[4][c+1] = COIN;
        } else if (c % 25 === 0) {
            grid[6][c] = FALLING;
            grid[6][c+1] = FALLING;
        } else if (c % 40 === 0) {
            // Powerups
            grid[4][c] = BREAKABLE;
            grid[4][c+1] = REWARD;
            grid[4][c+2] = BREAKABLE;
        }
        
        // Deep swamp everywhere else at row 9
        if (grid[9][c] === EMPTY) {
            grid[9][c] = SWAMP;
        }
    }
}

// Add specific entities
grid[7][245] = PORTAL;
grid[7][225] = BOSS;
grid[6][215] = GHOST;
grid[6][235] = GHOST;

// Serialize
const levelObj = {
    name: "Toxic Swamp",
    background: "backgrounds/background3.jpg",
    mirrorBackground: false,
    disableEnemyFireballs: false,
    ambientParticle: "haze", // Triggers green mist
    startX: 80,
    startY: 300,
    layout: grid
};

let levelsRaw = fs.readFileSync('levels.js', 'utf8');

// Parse, push, and rewrite safely
let updatedLevels;
if (levelsRaw.includes('const LEVELS = [')) {
    // Strip the variable declaration to parse as JSON
    const jsonStr = levelsRaw.substring(levelsRaw.indexOf('['), levelsRaw.lastIndexOf(']') + 1);
    try {
        const levelsArray = JSON.parse(jsonStr);
        levelsArray.push(levelObj);
        updatedLevels = `const LEVELS = ${JSON.stringify(levelsArray, null, 4)};\n`;
    } catch (e) {
        console.error("Failed to parse existing levels.js", e);
        process.exit(1);
    }
}

fs.writeFileSync('levels.js', updatedLevels);
console.log("Level 3 appended successfully!");
