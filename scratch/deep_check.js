const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');

// Quick eval to get LEVELS array
// We'll parse manually
const TILE_SIZE = 45;
const CANVAS_H = 540;

// Find each level's layout and check if startY:300 lands the player on solid ground
// Row = Math.floor(300 / 45) = row 6 (0-indexed)
// Player is 54px tall so feet at 300+54=354 → row 7.8 → row 7

const levelRe = /name: "([^"]+)"[\s\S]*?startX: (\d+),\s*startY: (\d+),\s*layout: (\[[\s\S]*?\])\s*\}/g;
let m;
while ((m = levelRe.exec(code)) !== null) {
    const name = m[1];
    const sx = parseInt(m[2]);
    const sy = parseInt(m[3]);
    try {
        const layout = JSON.parse(m[4]);
        const rows = layout.length;
        const cols = layout[0].length;
        // Player feet at sy+54, tile col = floor(sx/45)
        const tileCol = Math.floor(sx / TILE_SIZE);
        const tileRow = Math.floor((sy + 54) / TILE_SIZE); // feet
        const tile = (tileRow < rows && tileCol < cols) ? layout[tileRow][tileCol] : '?';
        // Check if there's any non-zero tile in the bottom 3 rows
        const bottomRows = layout.slice(-3);
        const hasFloor = bottomRows.some(r => r.some(t => t !== 0));
        // Count platforms in upper half
        const upperRows = layout.slice(0, rows - 3);
        const platformTiles = upperRows.reduce((acc, r) => acc + r.filter(t => t > 0 && t !== 5 && t !== 0).length, 0);
        console.log(name + ': ' + rows + 'x' + cols + ' | player tile=' + tileRow + ',' + tileCol + ' tile=' + tile + ' | floor:' + hasFloor + ' | platform tiles:' + platformTiles);
    } catch (e) {
        console.log(name + ': PARSE ERROR ' + e.message.substring(0, 50));
    }
}
