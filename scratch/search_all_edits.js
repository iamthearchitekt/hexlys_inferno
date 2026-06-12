const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
files.forEach(f => {
    if (!f.endsWith('.txt')) return;
    const p = path.join('scratch', f);
    const content = fs.readFileSync(p, 'utf8');
    
    // Look for GROUND2 or GROUND3
    if (content.includes('GROUND2') || content.includes('GROUND3')) {
        console.log(`Found in file: ${f}`);
        let idx = 0;
        while (true) {
            idx = content.indexOf('GROUND2', idx);
            if (idx === -1) break;
            console.log(`--- Match at ${idx} ---`);
            console.log(content.substring(Math.max(0, idx - 100), idx + 500));
            idx += 7;
        }
    }
});
