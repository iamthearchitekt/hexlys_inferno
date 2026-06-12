// Platform Audit Script
// Physics reference:
//   TILE_SIZE = 45px
//   Player hitbox: 78x90px  (drawn at 82px tall)
//   gravity: 0.52 px/frame²
//   jumpForce: -15.0 px/frame
//   Max jump height ≈ v²/(2g) = 225/(2*0.52) ≈ 216px ≈ 4.8 tiles
//   Sprint max speed: 6.5 px/frame
//   Screen viewport: 960x540px = ~21 tiles wide x 12 tiles tall

const TILE_SIZE = 45;
const SCREEN_W_TILES = Math.ceil(960 / TILE_SIZE); // 22

// Tile legend
const T = { EMPTY:0, GROUND:1, PLATFORM:2, BREAKABLE:3, REWARD:4, LAVA:5, PORTAL:6, COIN:7, SKULLBUG:8, WINGED:9, SPINE:10, SPENT:11, FLOWER:12, BOSS:13, FALLING:14 };
const NAMES = { 0:'.', 1:'G', 2:'P', 3:'B', 4:'R', 5:'~', 6:'O', 7:'c', 8:'s', 9:'w', 10:'x', 11:'S', 12:'F', 13:'K', 14:'F' };

const LEVEL_DATA = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7,0,0,0,0,0,0,7,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,3,4,3,0,0,0,0,0,0,2,2,2,0,0,0,9,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,14,14,0,14,14,0,14,14,0,0,0,0,14,14,0,14,14,0,14,14,0,14,14,0,0,0,0,14,14,0,14,14,0,0,0,0,14,14,0,0,0,0,14,14,0,14,14,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,8,0,0,7,0,0,0,0,10,0,0,0,0,8,0,9,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,10,0,0,7,0,0,0,8,0,0,9,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,8,0,0,0,0,0,0,9,0,0,0,0,0,10,8,1,1,1,1,1,1,1,1,1,0,0,0,0,8,0,0,0,0,0,0,10,0,0,0,0,8,0,0,0,0,0,0,8,0,9,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,9,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,9,0,0,0,0,9,0,0,9,0,0,10,0,0,0,0,10,0,0,8,0,0,10,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,1,1,1,1,0,2,2,2,2,2,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const COLS = LEVEL_DATA[0].length;
const ROWS = LEVEL_DATA.length;

// Max jump height in tiles: v²/(2g) = 15²/(2*0.52) ≈ 216px = 4.8 tiles
const MAX_JUMP_TILES = 4.8;
// Player height in tiles: 90px / 45px = 2 tiles
const PLAYER_H_TILES = 2;

console.log(`\n== LEVEL AUDIT ==`);
console.log(`Tiles: ${COLS} cols x ${ROWS} rows | Tile: ${TILE_SIZE}px | World: ${COLS * TILE_SIZE}px wide`);
console.log(`Player: 78x90px (hitbox) | Max jump: ~${MAX_JUMP_TILES.toFixed(1)} tiles | Sprint: 6.5px/f`);
console.log(`Viewport: ~${SCREEN_W_TILES} tiles wide\n`);

// Find all solid platforms (type 2 PLATFORM) and their positions
const platforms = [];
for (let r = 0; r < ROWS; r++) {
    let runStart = -1;
    let runLen = 0;
    for (let c = 0; c <= COLS; c++) {
        const t = c < COLS ? LEVEL_DATA[r][c] : 0;
        if (t === 2) {
            if (runStart === -1) { runStart = c; runLen = 0; }
            runLen++;
        } else {
            if (runStart !== -1) {
                platforms.push({ row: r, col: runStart, len: runLen, 
                    px: runStart * TILE_SIZE, py: r * TILE_SIZE,
                    worldX: runStart * TILE_SIZE, worldY: r * TILE_SIZE });
                runStart = -1; runLen = 0;
            }
        }
    }
}

// Find all falling platforms (type 14)
const falling = [];
for (let r = 0; r < ROWS; r++) {
    let runStart = -1, runLen = 0;
    for (let c = 0; c <= COLS; c++) {
        const t = c < COLS ? LEVEL_DATA[r][c] : 0;
        if (t === 14) {
            if (runStart === -1) { runStart = c; runLen = 0; }
            runLen++;
        } else {
            if (runStart !== -1) {
                falling.push({ row: r, col: runStart, len: runLen, worldX: runStart * TILE_SIZE, worldY: r * TILE_SIZE });
                runStart = -1; runLen = 0;
            }
        }
    }
}

// Find ground (type 1) rows - where solid ground exists col by col
const groundLevel = []; // col -> row of ground
for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
        if (LEVEL_DATA[r][c] === 1) { groundLevel[c] = r; break; }
    }
}

// Analyze gaps between platforms
console.log('=== STATIC PLATFORMS (type 2) ===');
platforms.forEach(p => {
    const widthPx = p.len * TILE_SIZE;
    const heightFromBottom = (ROWS - p.row) * TILE_SIZE;
    console.log(`  Row ${p.row} | Col ${p.col}-${p.col+p.len-1} (${p.len} tiles = ${widthPx}px wide) | Y=${p.worldY}px | WorldX=${p.worldX}px`);
});

console.log('\n=== FALLING PLATFORMS (type 14) ===');
falling.forEach(p => {
    console.log(`  Row ${p.row} | Col ${p.col}-${p.col+p.len-1} (${p.len} tiles = ${p.len*TILE_SIZE}px) | WorldX=${p.worldX}px`);
});

// Identify gaps between platform clusters that look reachable
console.log('\n=== GAP ANALYSIS (consecutive platform clusters, same row) ===');
const byRow = {};
[...platforms, ...falling].forEach(p => {
    if (!byRow[p.row]) byRow[p.row] = [];
    byRow[p.row].push(p);
});

Object.keys(byRow).sort((a,b)=>a-b).forEach(row => {
    const sorted = byRow[row].sort((a,b)=>a.col-b.col);
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i-1];
        const curr = sorted[i];
        const gapTiles = curr.col - (prev.col + prev.len);
        const gapPx = gapTiles * TILE_SIZE;
        const jumpable = gapPx <= (6.5 * 20); // rough 20 frames at sprint speed
        console.log(`  Row ${row}: gap between col ${prev.col+prev.len} and ${curr.col} = ${gapTiles} tiles (${gapPx}px) ${jumpable?'[reachable]':'[WIDE - may need sprint]'}`);
    }
});

// Find areas where player would need a jump of more than MAX_JUMP_TILES rows
console.log('\n=== VERTICAL REACHABILITY AUDIT ===');
// For each platform, check if there is something below it within jump range
platforms.forEach(p => {
    // Look for platforms or ground below this platform within MAX_JUMP_TILES rows
    const below = [];
    for (let r = p.row + 1; r < ROWS; r++) {
        for (let c = p.col; c < p.col + p.len; c++) {
            const t = LEVEL_DATA[r][c];
            if (t === 1 || t === 2 || t === 14) {
                below.push({ row: r, type: t, vertDist: r - p.row });
                break;
            }
        }
        if (below.length) break;
    }
    const belowRow = below.length ? below[0].row : ROWS;
    const dropTiles = belowRow - p.row;
    const jumpToReach = dropTiles - PLAYER_H_TILES; // net tiles to jump up
    
    // Look for platforms above within jump reach
    const above = [];
    for (let r = p.row - 1; r >= 0; r--) {
        for (let c = p.col; c < p.col + p.len; c++) {
            const t = LEVEL_DATA[r][c];
            if (t === 1 || t === 2 || t === 14) {
                above.push({ row: r, vertDist: p.row - r });
                break;
            }
        }
        if (above.length) break;
    }
    
    if (above.length) {
        const rowsUp = above[0].vertDist;
        const flag = rowsUp > MAX_JUMP_TILES ? ' ⚠️  TOO HIGH TO REACH' : rowsUp > 3.5 ? ' ⚡ tight jump' : '';
        if (flag) {
            console.log(`  Platform Row ${p.row} Col ${p.col}: ${rowsUp} rows above next platform${flag}`);
        }
    }
});

console.log('\n=== REWARD/BREAKABLE BLOCK POSITIONS ===');
for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const t = LEVEL_DATA[r][c];
        if (t === 3 || t === 4) {
            // Find floor below
            let floorRow = ROWS;
            for (let fr = r+1; fr < ROWS; fr++) {
                const ft = LEVEL_DATA[fr][c];
                if (ft === 1 || ft === 2) { floorRow = fr; break; }
            }
            const headroom = (r - 0); // rows from top
            const floorDist = floorRow - r;
            console.log(`  ${t===4?'REWARD':'BREAK'} Block: Row ${r}, Col ${c} | ${floorDist} tiles above floor | WorldX=${c*TILE_SIZE}px`);
        }
    }
}
