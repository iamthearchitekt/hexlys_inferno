const fs = require('fs');
const path = require('path');

// 1. Read transform_level.js to get Level 1
const transformCode = fs.readFileSync('transform_level.js', 'utf8');
let levelDataMatch = transformCode.match(/const LEVEL_DATA = \[([\s\S]*?)\];/);
let changesMatch = transformCode.match(/const changes = \[([\s\S]*?)\];/);

let LEVEL_DATA = eval('[' + levelDataMatch[1] + ']');
let changes = eval('[' + changesMatch[1] + ']');

// Do not apply changes to Level 1! The user wants the exact original.

// 2. Create PLACEHOLDER_LAYOUT
const PLACEHOLDER_LAYOUT = [];
for (let r=0; r<12; r++) {
    let row = new Array(320).fill(0);
    if (r >= 10) {
        row.fill(1);
    }
    if (r === 9) {
        row[312] = 6;
    }
    PLACEHOLDER_LAYOUT.push(row);
}

// 3. Rebuild levels.js string
let outStr = `// ----------------------------------------------------
// HEXLY'S INFERNO ESCAPE - 9-LEVEL DEVELOPMENT DATA
// ----------------------------------------------------
// Customize names, player starts, layouts, and hazards here!
// 
// TILE INDEX LEGEND:
//  0 = Empty
//  1 = Ground Floor Block
//  2 = Chain Platform
//  3 = Breakable Block
//  4 = Glowing Reward Block
//  5 = Lava Hazard (Instantly fatal)
//  6 = Level Exit Portal
//  7 = Soul Shard (Coin)
//  8 = Patrol Skeleton (SKULL_BUG)
//  9 = Flying Skull Imp (FIRE_IMP)
// 10 = Horned Spine Crawler (HORNED_BLOB)
// 13 = Skeleton Overlord Boss
// 14 = Falling Platform
// 15 = Red 1-UP Block (Restores health / points)

// Simple placeholder layout template for Levels 2-9
const PLACEHOLDER_LAYOUT = [
${PLACEHOLDER_LAYOUT.map(row => '    [' + row.join(',') + ']').join(',\n')}
];

const LEVELS = [
    {
        name: "Inferno Gate",
        background: "background.png",
        startX: 80,
        startY: 300,
        layout: [
${LEVEL_DATA.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "The Black Gale",
        background: "background2.jpg",
        disableEnemyFireballs: true,
        windForce: -0.05,
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "The Filth Mire",
        background: "background3.jpg",
        disableEnemyFireballs: true,
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "The Infernal Treasury",
        background: "background4.jpg",
        disableEnemyFireballs: true,
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "The Blood Marshes",
        background: "background5.jpg",
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "The Burning Necropolis",
        background: "background6.jpg",
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "Level 7",
        background: "background.jpg",
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "Level 8",
        background: "background.jpg",
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    },
    {
        name: "Level 9",
        background: "background.jpg",
        startX: 80,
        startY: 300,
        layout: [
${PLACEHOLDER_LAYOUT.map(row => '            [' + row.join(',') + ']').join(',\n')}
        ]
    }
];
`;

fs.writeFileSync('levels.js', outStr, 'utf8');
console.log('Restored base levels.js successfully!');
