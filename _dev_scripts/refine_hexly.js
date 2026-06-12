const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const files = [
    'hexly.png',
    'hexly_crouch.png',
    'hexly_jump.png',
    'hexly_projectile.png',
    'hexly_walk2.png'
];

async function processEdges(filename) {
    if (!fs.existsSync(filename)) {
        console.log("File not found:", filename);
        return;
    }
    
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;
    
    const width = img.width;
    const height = img.height;
    
    // Create a copy to read from while writing to data
    const copy = new Uint8ClampedArray(data);
    
    function getAlpha(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return 0;
        return copy[(y * width + x) * 4 + 3];
    }
    
    // Pass 1: Trim almost invisible noise (alpha < 10) that often causes dirty halos
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0 && data[i] < 10) {
            data[i] = 0;
            copy[i] = 0;
        }
    }
    
    // Pass 2: Refine the outer edge by anti-aliasing (averaging alpha with neighbors)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const a = copy[idx + 3];
            
            if (a > 0) {
                // Check immediate cross neighbors
                const n1 = getAlpha(x-1, y);
                const n2 = getAlpha(x+1, y);
                const n3 = getAlpha(x, y-1);
                const n4 = getAlpha(x, y+1);
                
                // If it touches a fully transparent pixel, it's an absolute outer edge pixel
                if (n1 === 0 || n2 === 0 || n3 === 0 || n4 === 0) {
                    // Apply a 3x3 box blur exclusively to the alpha channel of this edge pixel
                    let sumA = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            sumA += getAlpha(x+dx, y+dy);
                        }
                    }
                    // Average it out to soften jagged edges (feathering)
                    data[idx + 3] = Math.floor(sumA / 9);
                }
            }
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log("Refined edges for:", filename);
}

async function run() {
    for (const f of files) {
        await processEdges(f);
    }
    console.log("All Hexly sprite edges refined successfully.");
}

run().catch(console.error);
