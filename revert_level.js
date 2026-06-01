const fs = require('fs');

let gameCode = fs.readFileSync('game.js', 'utf8');

gameCode = gameCode.replace(/this\.height = 630;/g, 'this.height = 540;');
gameCode = gameCode.replace(/row >= 14/g, 'row >= 12');
gameCode = gameCode.replace(/r < 14/g, 'r < 12');
gameCode = gameCode.replace(/y > 630/g, 'y > 540');
gameCode = gameCode.replace(/this\.y > 630/g, 'this.y > 540');
gameCode = gameCode.replace(/630\)/g, '540)');
gameCode = gameCode.replace(/for \(let y = 11; y < 14; y\+\+\) {/g, 'for (let y = 9; y < 12; y++) {');
gameCode = gameCode.replace(/this\.player\.y = 170;/g, 'this.player.y = 80;');

const newParserLogic = `
        let shardCount = 0;
        for (let r = 0; r < LEVEL_DATA.length; r++) {
            this.levelGrid[r] = [];
            for (let c = 0; c < LEVEL_DATA[r].length; c++) {
                const cell = LEVEL_DATA[r][c];
                
                if (cell === 7) {
                    // Spawns 33% of the mapped shards in a 100% deterministic pattern,
                    // ensuring they always spawn in the exact same spots on restart!
                    if (shardCount % 3 === 0) {
                        this.coins.push(new SoulCoin(c * TILE_SIZE, r * TILE_SIZE));
                    }
                    shardCount++;
                    this.levelGrid[r][c] = 0;
                } else if (cell === 8) {
                    this.enemies.push(new SkellyBug(c * TILE_SIZE, r * TILE_SIZE));
                    this.levelGrid[r][c] = 0;
                } else if (cell === 9) {
                    this.enemies.push(new WingedSkull(c * TILE_SIZE, r * TILE_SIZE));
                    this.levelGrid[r][c] = 0;
                } else if (cell === 10) {
                    this.enemies.push(new SpineCrawler(c * TILE_SIZE, r * TILE_SIZE));
                    this.levelGrid[r][c] = 0;
                } else if (cell === 12) {
                    this.flowers.push(new LavaFlower(c * TILE_SIZE, r * TILE_SIZE));
                    this.levelGrid[r][c] = 0;
                } else {
                    this.levelGrid[r][c] = cell;
                }
            }
        }`;

const oldParserRegex = /let shardCount = 0;[\s\S]*?this\.levelGrid\[actualRow\]\.push\(cell\);\n                }\n            }\n        }/;
gameCode = gameCode.replace(oldParserRegex, newParserLogic.trim());

fs.writeFileSync('game.js', gameCode);

let htmlCode = fs.readFileSync('index.html', 'utf8');
htmlCode = htmlCode.replace(/height="630"/g, 'height="540"');
fs.writeFileSync('index.html', htmlCode);
