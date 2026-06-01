const fs = require('fs');

let gameCode = fs.readFileSync('game.js', 'utf8');

// The best way is to dynamically shift LEVEL_DATA when parsing it, rather than rewriting the giant array text.
// Wait, actually I did that before and it broke because I also changed the canvas height.
// If I JUST dynamically shift it, it's very clean!
// Wait! I already have the parser logic! Let's modify the parser logic to shift everything down by 2 rows.
// And drop any rows that go past 12.

const newParserLogic = `
        let shardCount = 0;
        
        // Shift level down by 2 rows for more jumping room
        const shiftY = 2;
        
        // Initialize 12 rows
        for (let r = 0; r < 12; r++) {
            this.levelGrid[r] = new Array(LEVEL_DATA[0].length).fill(0);
        }

        for (let r = 0; r < LEVEL_DATA.length; r++) {
            const actualRow = r + shiftY;
            if (actualRow >= 12) continue; // Drop rows that get pushed off the bottom
            
            for (let c = 0; c < LEVEL_DATA[r].length; c++) {
                const cell = LEVEL_DATA[r][c];
                
                if (cell === 7) {
                    if (shardCount % 3 === 0) {
                        this.coins.push(new SoulCoin(c * TILE_SIZE, actualRow * TILE_SIZE));
                    }
                    shardCount++;
                    this.levelGrid[actualRow][c] = 0;
                } else if (cell === 8) {
                    this.enemies.push(new SkellyBug(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = 0;
                } else if (cell === 9) {
                    this.enemies.push(new WingedSkull(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = 0;
                } else if (cell === 10) {
                    this.enemies.push(new SpineCrawler(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = 0;
                } else if (cell === 12) {
                    this.flowers.push(new LavaFlower(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = 0;
                } else {
                    this.levelGrid[actualRow][c] = cell;
                }
            }
        }`;

const oldParserRegex = /let shardCount = 0;[\s\S]*?this\.levelGrid\[r\]\[c\] = cell;\n                }\n            }\n        }/;
gameCode = gameCode.replace(oldParserRegex, newParserLogic.trim());

// We must also shift Hexly's initial Y spawn position down by 2 tiles (90px)
gameCode = gameCode.replace(/this\.player\.y = 80;/g, 'this.player.y = 170;');

// Save changes
fs.writeFileSync('game.js', gameCode);

console.log('Shifted level data down by 2 rows.');
