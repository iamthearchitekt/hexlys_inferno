const { createCanvas, loadImage } = require('canvas');

async function analyze(filename) {
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    
    let edgeColors = [];
    
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const a = data[idx + 3];
            
            if (a > 0) {
                // check neighbors
                let hasTransparentNeighbor = false;
                const neighbors = [
                    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
                ];
                
                for (let [nx, ny] of neighbors) {
                    if (nx < 0 || nx >= img.width || ny < 0 || ny >= img.height) {
                        hasTransparentNeighbor = true;
                    } else {
                        const nIdx = (ny * img.width + nx) * 4;
                        if (data[nIdx + 3] === 0) hasTransparentNeighbor = true;
                    }
                }
                
                if (hasTransparentNeighbor) {
                    edgeColors.push({
                        r: data[idx], g: data[idx+1], b: data[idx+2], a: data[idx+3],
                        x: x, y: y
                    });
                }
            }
        }
    }
    
    // Categorize edge pixels
    let blackEdges = 0;
    let whiteGreyEdges = 0;
    let otherEdges = 0;
    
    for (let c of edgeColors) {
        if (c.r < 50 && c.g < 50 && c.b < 50) blackEdges++;
        else if (c.r > 150 && c.g > 150 && c.b > 150) whiteGreyEdges++;
        else otherEdges++;
    }
    
    console.log(`\n--- ${filename} ---`);
    console.log(`Total edge pixels: ${edgeColors.length}`);
    console.log(`Black (<50): ${blackEdges}`);
    console.log(`White/Grey (>150): ${whiteGreyEdges}`);
    console.log(`Other colors: ${otherEdges}`);
}

async function run() {
    await analyze('hexly.png');
    await analyze('hexly_jump.png');
    await analyze('hexly_crouch.png');
}

run().catch(console.error);
