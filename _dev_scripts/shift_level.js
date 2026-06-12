const fs = require('fs');

let levelsJS = fs.readFileSync('levels.js', 'utf8');

const startIdx = levelsJS.indexOf('layout: [');
const endIdx = levelsJS.indexOf('],', startIdx + 10);
let layoutStr = levelsJS.substring(startIdx, endIdx + 1);

let lines = layoutStr.split('\n');
let grid = [];
let lineIndices = []; 

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('[') && (line.endsWith('],') || line.endsWith(']'))) {
        let arrStr = line;
        if (arrStr.endsWith(',')) {
            arrStr = arrStr.substring(0, arrStr.length - 1);
        }
        grid.push(JSON.parse(arrStr));
        lineIndices.push(i);
    }
}

const DROP_OFFSET = 2;
let newGrid = JSON.parse(JSON.stringify(grid));

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 14) {
            newGrid[r][c] = 0; 
        }
    }
}

for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 14) {
            if (r + DROP_OFFSET < grid.length) {
                newGrid[r + DROP_OFFSET][c] = 14; 
            }
        }
    }
}

for (let i = 0; i < grid.length; i++) {
    let oldLine = lines[lineIndices[i]];
    let prefix = oldLine.substring(0, oldLine.indexOf('['));
    let suffix = oldLine.endsWith(',') ? ',' : '';
    lines[lineIndices[i]] = prefix + JSON.stringify(newGrid[i]) + suffix;
}

levelsJS = levelsJS.substring(0, startIdx) + lines.join('\n') + levelsJS.substring(endIdx + 1);
fs.writeFileSync('levels.js', levelsJS);

// 2. Change FallingPlatformEntity in game.js
let gameJS = fs.readFileSync('game.js', 'utf8');
const oldDraw = `    draw(ctx, engine) {
        if (chainTileImgLoaded) {
            // Scale chain to be visually thinner (20px tall) to match original
            const CHAIN_HEIGHT = 20;
            const scale = CHAIN_HEIGHT / 134;
            const linkW = 320 * scale;
            const offsetX = (TILE_SIZE - linkW) / 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.x, this.y, TILE_SIZE, TILE_SIZE);
            ctx.clip();
            // Draw at the TOP of the collision block so Hexly's feet touch it
            ctx.drawImage(chainTileImg, this.x + offsetX, this.y, linkW, CHAIN_HEIGHT);
            ctx.restore();
        } else {
            drawPixelMatrix(ctx, this.x, this.y, SPRITES.TILES.PLATFORM, false, 4.5);
        }
    }`;

const newDraw = `    draw(ctx, engine) {
        if (level1TileImgLoaded) {
            ctx.drawImage(level1TileImg, this.x, this.y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
        } else {
            drawPixelMatrix(ctx, this.x, this.y, SPRITES.TILES.PLATFORM, false, 4.5);
        }
    }`;

if (gameJS.includes(oldDraw)) {
    gameJS = gameJS.replace(oldDraw, newDraw);
    fs.writeFileSync('game.js', gameJS);
    console.log("Successfully shifted platforms and updated draw logic.");
} else {
    console.log("Could not find the exact old draw string in game.js");
}
