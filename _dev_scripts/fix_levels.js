const fs = require('fs');

const path = 'levels.js';
let content = fs.readFileSync(path, 'utf8');

const dataStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const levels = eval(dataStr);

// Restore Level 1
levels[0].name = "Inferno Gate";
levels[0].background = "background_lvl1_regular_seamless.png";

// Update Level 2
levels[1].name = "The Ashen Wastes";
levels[1].background = "backgrounds/background_lvl2.png";

// Convert back to string
const newLayoutStr = JSON.stringify(levels, null, 4);
fs.writeFileSync(path, 'const LEVELS = ' + newLayoutStr + ';\n', 'utf8');
console.log('Successfully fixed levels.js!');
