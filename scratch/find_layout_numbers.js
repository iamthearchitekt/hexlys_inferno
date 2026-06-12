const fs = require('fs');
const code = fs.readFileSync('levels.js', 'utf8');

// Find all layout arrays
const levelRe = /name: "([^"]+)"[\s\S]*?layout: (\[[\s\S]*?\])\s*\}/g;
let m;
while ((m = levelRe.exec(code)) !== null) {
    const name = m[1];
    try {
        const layout = JSON.parse(m[2]);
        const set = new Set();
        layout.forEach(row => row.forEach(val => set.add(val)));
        console.log(`${name}: distinct tile numbers:`, Array.from(set).sort((a,b)=>a-b));
    } catch (e) {
        console.log(`${name}: PARSE ERROR`, e.message.substring(0, 50));
    }
}
