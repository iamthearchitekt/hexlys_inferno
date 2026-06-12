const fs = require('fs');

let levelsRaw = fs.readFileSync('levels.js', 'utf8');

// Parse, update, and rewrite safely
if (levelsRaw.includes('const LEVELS = [')) {
    const jsonStr = levelsRaw.substring(levelsRaw.indexOf('['), levelsRaw.lastIndexOf(']') + 1);
    try {
        const levelsArray = JSON.parse(jsonStr);
        // Disable enemy fireballs for Level 2 (index 1) and Level 3 (index 2)
        if (levelsArray[1]) levelsArray[1].disableEnemyFireballs = true;
        if (levelsArray[2]) levelsArray[2].disableEnemyFireballs = true;
        
        const updatedLevels = `const LEVELS = ${JSON.stringify(levelsArray, null, 4)};\n`;
        fs.writeFileSync('levels.js', updatedLevels);
        console.log("Updated levels.js successfully!");
    } catch (e) {
        console.error("Failed to parse existing levels.js", e);
        process.exit(1);
    }
}
