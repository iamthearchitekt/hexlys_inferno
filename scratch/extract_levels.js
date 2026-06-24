// Extract all current levels from levels.js into individual files under levels/
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd(); // Run from project root
const code = fs.readFileSync(path.join(projectRoot, 'levels.js'), 'utf8')
    .replace('export default LEVELS;', '')
    .replace('const LEVELS =', 'global.LEVELS =');
eval(code);

const outDir = path.join(projectRoot, 'levels');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

global.LEVELS.forEach(level => {
    const filename = path.join(outDir, `level${level.id}.js`);
    // Mark as stub if no real layout
    if (!level.layout || level.layout.length === 0) {
        level.stub = true;
        delete level.layout;
    }
    const content = `const level${level.id} = ${JSON.stringify(level, null, 4)};\n`;
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`Written: levels/level${level.id}.js  id=${level.id}  name="${level.name}"  stub=${!!level.stub}`);
});

console.log('Done.');
