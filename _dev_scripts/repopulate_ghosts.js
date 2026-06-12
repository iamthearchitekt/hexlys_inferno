const fs = require('fs');

const path = 'levels.js';
let content = fs.readFileSync(path, 'utf8');

const dataStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const levels = eval(dataStr);

const lvl2 = levels[1];
const layout = lvl2.layout;

// Clear all existing ghosts
for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
        if (layout[r][c] === 15) {
            layout[r][c] = 0;
        }
    }
}

// Smart scatter: max 2 ghosts per cluster, ~25 total
const width = layout[0].length;
let ghostsToPlace = 25;
let currentCol = 30; // Start at column 30

while (ghostsToPlace > 0 && currentCol < width - 15) {
    // Decide if this cluster has 1 or 2 ghosts
    const clusterSize = Math.min(ghostsToPlace, Math.random() < 0.5 ? 1 : 2);
    
    for (let i = 0; i < clusterSize; i++) {
        const cOffset = Math.floor(Math.random() * 3); // Slightly vary X within the cluster
        const r = Math.floor(Math.random() * 5) + 2; // Random row in upper air (2 to 6)
        
        const targetC = Math.min(width - 1, currentCol + cOffset);
        if (layout[r][targetC] === 0) {
            layout[r][targetC] = 15;
            ghostsToPlace--;
        }
    }
    
    // Jump forward by 8 to 12 columns for the next cluster to guarantee separation
    currentCol += Math.floor(Math.random() * 5) + 8;
}

const newLayoutStr = JSON.stringify(levels, null, 4);
fs.writeFileSync(path, 'const LEVELS = ' + newLayoutStr + ';\n', 'utf8');
console.log('Successfully spaced out ghosts! Ghosts left unplaced:', ghostsToPlace);
