const fs = require('fs');
const layoutJson = fs.readFileSync('_backups/layout.json', 'utf8');

const level2Cols = 280; // Level 1 is 256, this is a little longer

const level2Layout = [];
for (let r = 0; r < 12; r++) {
    const row = [];
    for (let c = 0; c < level2Cols; c++) {
        if (r >= 10) {
            row.push(1); // Ground floor
        } else if (r === 9 && c === level2Cols - 4) {
            row.push(6); // Portal
        } else {
            row.push(0); // Empty space
        }
    }
    level2Layout.push(row);
}

const level2Json = JSON.stringify(level2Layout)
    .replace(/\],\[/g, '],\n            ['); // Format it nicely

const content = `// ----------------------------------------------------
// HEXLY'S INFERNO ESCAPE - LEVELS
// ----------------------------------------------------
const LEVELS = [
    {
        name: "Inferno Gate",
        background: "background.png",
        disableEnemyFireballs: false,
        startX: 80,
        startY: 300,
        layout: ${layoutJson}
    },
    {
        name: "Base Level",
        background: "background.png",
        disableEnemyFireballs: false,
        startX: 80,
        startY: 300,
        layout: ${level2Json}
    }
];
`;

fs.writeFileSync('levels.js', content);
console.log("Generated Level 2 successfully!");
