const fs = require('fs');

let levelsRaw = fs.readFileSync('levels.js', 'utf8');

if (levelsRaw.includes('const LEVELS = [')) {
    const jsonStr = levelsRaw.substring(levelsRaw.indexOf('['), levelsRaw.lastIndexOf(']') + 1);
    try {
        const levelsArray = JSON.parse(jsonStr);
        const level3 = levelsArray[2];
        
        if (level3 && level3.layout) {
            // IDs for enemies: 8 (Skelly), 9 (Skull), 10 (Spine), 13 (Boss), 15 (Ghost)
            const enemyIds = new Set([8, 9, 10, 13, 15]);
            
            for (let r = 0; r < level3.layout.length; r++) {
                for (let c = 0; c < level3.layout[r].length; c++) {
                    if (enemyIds.has(level3.layout[r][c])) {
                        level3.layout[r][c] = 0; // Set to EMPTY
                    }
                }
            }
        }
        
        const updatedLevels = `const LEVELS = ${JSON.stringify(levelsArray, null, 4)};\n`;
        fs.writeFileSync('levels.js', updatedLevels);
        console.log("Enemies removed from Level 3 successfully!");
    } catch (e) {
        console.error("Failed to parse existing levels.js", e);
        process.exit(1);
    }
}
