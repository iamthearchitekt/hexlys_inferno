const fs = require('fs');

function createEmptyGrid(cols = 320) {
    const grid = [];
    for (let r = 0; r < 12; r++) {
        grid.push(new Array(cols).fill(0));
    }
    return grid;
}

function addGround(grid, startCol, endCol, row = 11, tile = 1) {
    for (let c = startCol; c <= endCol && c < grid[0].length; c++) {
        grid[row][c] = tile;
        grid[row-1][c] = tile;
    }
}

function genLevel2() {
    const grid = createEmptyGrid();
    for (let c = 0; c < 300; c += 20) {
        addGround(grid, c, c + 15, 11, 1);
        if (c + 17 < 300) {
            grid[10][c + 17] = 14; 
        }
    }
    for (let c = 20; c < 280; c += 40) {
        grid[7][c] = 2; grid[7][c+1] = 2; grid[7][c+2] = 2;
        grid[6][c+1] = 9; 
        grid[6][c] = 7; 
    }
    addGround(grid, 300, 319, 11, 1);
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "The Black Gale", background: "background2.jpg", layout: grid };
}

function genLevel3() {
    const grid = createEmptyGrid();
    addGround(grid, 0, 10, 11, 1);
    for (let c = 11; c < 300; c++) {
        grid[11][c] = 5;
    }
    for (let c = 15; c < 290; c += 15) {
        grid[9][c] = 2; grid[9][c+1] = 2; grid[9][c+2] = 2;
        grid[8][c+1] = 10; 
        grid[7][c+1] = 7; 
    }
    addGround(grid, 290, 319, 11, 1);
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "The Filth Mire", background: "background3.jpg", layout: grid };
}

function genLevel4() {
    const grid = createEmptyGrid();
    addGround(grid, 0, 319, 11, 1);
    for (let c = 20; c < 300; c += 15) {
        grid[10][c] = 8; 
        grid[7][c] = 4; 
        grid[4][c] = 7; 
    }
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "The Infernal Treasury", background: "background4.jpg", layout: grid };
}

function genLevel5() {
    const grid = createEmptyGrid();
    addGround(grid, 0, 10, 11, 1);
    for (let c = 11; c < 319; c++) grid[11][c] = 5; 
    for (let c = 15; c < 300; c += 15) {
        grid[9][c] = (c % 30 === 0) ? 14 : 2; 
        grid[9][c+1] = (c % 30 === 0) ? 14 : 2;
        grid[8][c] = 7;
    }
    addGround(grid, 300, 319, 11, 1);
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "The Blood Marshes", background: "background5.jpg", layout: grid };
}

function genLevel6() {
    const grid = createEmptyGrid();
    addGround(grid, 0, 15, 11, 1);
    for (let c = 16; c < 319; c++) grid[11][c] = 5; 
    let y = 10;
    for (let c = 20; c < 300; c += 10) {
        y = (y <= 4) ? 9 : y - 2;
        grid[y][c] = 2; grid[y][c+1] = 2;
        grid[y-1][c] = 9; 
    }
    addGround(grid, 300, 319, 11, 1);
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "The Burning Necropolis", background: "background6.jpg", layout: grid };
}

function genTemplate(num) {
    const grid = createEmptyGrid();
    addGround(grid, 0, 319, 11, 1);
    grid[9][310] = 6;
    grid[10][310] = 6;
    return { name: "Level " + num + " (Template)", background: "background.png", layout: grid };
}

function stringifyLevel(lvl) {
    let str = '    {\n';
    str += '        name: "' + lvl.name + '",\n';
    str += '        background: "' + lvl.background + '",\n';
    str += '        layout: [\n';
    for (let r = 0; r < lvl.layout.length; r++) {
        str += '            [' + lvl.layout[r].join(',') + ']' + (r < lvl.layout.length - 1 ? ',' : '') + '\n';
    }
    str += '        ]\n';
    str += '    }';
    return str;
}

try {
    const oldCode = fs.readFileSync('levels.js', 'utf8');
    const secondLevelIndex = oldCode.indexOf('name: "The Black Gale"');
    if (secondLevelIndex === -1) {
        console.error("Could not find The Black Gale in levels.js to replace!");
        process.exit(1);
    }
    const secondLevelStart = oldCode.lastIndexOf('{', secondLevelIndex);
    
    // Everything before the { of the second level (including the trailing comma and newline)
    let headerAndLevel1 = oldCode.substring(0, secondLevelStart).trim();
    if (headerAndLevel1.endsWith(',')) {
        // Keep the comma
    } else {
        headerAndLevel1 += ',';
    }

    const levels = [
        genLevel2(),
        genLevel3(),
        genLevel4(),
        genLevel5(),
        genLevel6(),
        genTemplate(7),
        genTemplate(8),
        genTemplate(9)
    ];

    let newLevelsJS = headerAndLevel1 + '\n';
    for (let i = 0; i < levels.length; i++) {
        newLevelsJS += stringifyLevel(levels[i]);
        if (i < levels.length - 1) {
            newLevelsJS += ',\n';
        } else {
            newLevelsJS += '\n';
        }
    }
    newLevelsJS += '];\n';

    fs.writeFileSync('levels.js', newLevelsJS);
    console.log("Successfully rebuilt levels.js!");

} catch (err) {
    console.error(err);
    process.exit(1);
}
