const fs = require('fs');

const data = fs.readFileSync('levels.js', 'utf8');

// A very crude regex to extract the first layout array
const layoutMatch = data.match(/layout:\s*\[([\s\S]*?)\]\s*\}\s*,/);
if (layoutMatch) {
    // Just evaluate it (safe since it's just local JS)
    const script = `const layout = [${layoutMatch[1]}]; layout;`;
    const layout = eval(script);
    
    // We know layout is an array of rows, each 256 items.
    let lastLavaCol = -1;
    for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
            if (layout[r][c] === 5) {
                if (c > lastLavaCol) lastLavaCol = c;
            }
        }
    }
    console.log("Last lava column in Level 1:", lastLavaCol);
}
