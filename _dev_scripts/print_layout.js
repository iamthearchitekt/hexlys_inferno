const fs = require('fs');

const data = fs.readFileSync('levels.js', 'utf8');

const layoutMatch = data.match(/layout:\s*\[([\s\S]*?)\]\s*\}\s*,/);
if (layoutMatch) {
    const script = `const layout = [${layoutMatch[1]}]; layout;`;
    const layout = eval(script);
    
    console.log("COLUMNS 190 to 230:");
    for (let r = 8; r <= 10; r++) {
        let rowStr = `Row ${r}: `;
        for (let c = 190; c <= 230; c++) {
            rowStr += String(layout[r][c]).padStart(2, ' ') + ",";
        }
        console.log(rowStr);
    }
}
