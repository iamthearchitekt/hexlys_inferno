const fs = require('fs');

let content = fs.readFileSync('levels.js', 'utf8');

// The layout for level 1 is the first array of arrays in LEVELS.
// We can use a regex or just evaluate the file, modify it, and write it back.
// Since the file has other stuff, let's just parse the layout arrays with a regex.

// Actually, evaluating levels.js might be tricky if it's not a module.
// But we can extract the first layout block.

let startIdx = content.indexOf('layout: [');
let endIdx = content.indexOf(']', startIdx + 'layout: ['.length);
// wait, layout is an array of arrays. So it ends with `        ]`
endIdx = content.indexOf('        ]', startIdx) + 9;

let layoutStr = content.substring(startIdx + 8, endIdx);
let layout = eval(layoutStr);

const TILES_GROUND = 1;
const TILES_BREAKABLE = 3;

let modified = false;

// We do a flood fill to find all connected components of TILES_GROUND (1).
// If a component has ANY tile in the last row (row 11), it's part of the floor.
// Otherwise, it's floating, so we convert it to TILES_BREAKABLE (3).

let visited = Array(12).fill(0).map(() => Array(layout[0].length).fill(false));

for (let r = 0; r < 12; r++) {
    for (let c = 0; c < layout[0].length; c++) {
        if (layout[r][c] === TILES_GROUND && !visited[r][c]) {
            // Flood fill
            let q = [[r, c]];
            let component = [];
            let isFloor = false;
            visited[r][c] = true;
            
            let head = 0;
            while(head < q.length) {
                let [currR, currC] = q[head++];
                component.push([currR, currC]);
                
                if (currR === 11) isFloor = true;
                
                const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
                for (let [dr, dc] of dirs) {
                    let nr = currR + dr;
                    let nc = currC + dc;
                    if (nr >= 0 && nr < 12 && nc >= 0 && nc < layout[0].length) {
                        if (layout[nr][nc] === TILES_GROUND && !visited[nr][nc]) {
                            visited[nr][nc] = true;
                            q.push([nr, nc]);
                        }
                    }
                }
            }
            
            if (!isFloor) {
                // It's a floating component! Convert to breakable!
                for (let [cr, cc] of component) {
                    layout[cr][cc] = TILES_BREAKABLE;
                    modified = true;
                }
            }
        }
    }
}

if (modified) {
    let newLayoutStr = '[\n';
    for (let r = 0; r < 12; r++) {
        newLayoutStr += '            [' + layout[r].join(',') + ']';
        if (r < 11) newLayoutStr += ',\n';
        else newLayoutStr += '\n';
    }
    newLayoutStr += '        ]';
    
    let newContent = content.substring(0, startIdx + 8) + newLayoutStr + content.substring(endIdx);
    fs.writeFileSync('levels.js', newContent);
    console.log("Updated levels.js successfully.");
} else {
    console.log("No floating ground tiles found.");
}
