const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const files = [
    'boss_frame1.png',
    'boss_frame2.png'
];

async function makeBlackEdge(filename) {
    if (!fs.existsSync(filename)) return;
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;
    const width = img.width;
    const height = img.height;
    
    const copy = new Uint8ClampedArray(data);
    
    function getAlpha(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return 0;
        return copy[(y * width + x) * 4 + 3];
    }
    
    // Pass 1: Strict alpha thresholding (kill any soft halos)
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 220) {
            data[i] = 0;
            copy[i] = 0;
        } else {
            data[i] = 255;
            copy[i] = 255;
        }
    }
    
    let edgeCount = 0;
    
    // Pass 2: Force every single pixel touching transparency to be solid black
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const a = copy[idx + 3];
            
            if (a > 0) {
                // Check all 8 neighbors
                const n1 = getAlpha(x-1, y);
                const n2 = getAlpha(x+1, y);
                const n3 = getAlpha(x, y-1);
                const n4 = getAlpha(x, y+1);
                const n5 = getAlpha(x-1, y-1);
                const n6 = getAlpha(x+1, y-1);
                const n7 = getAlpha(x-1, y+1);
                const n8 = getAlpha(x+1, y+1);
                
                if (n1 === 0 || n2 === 0 || n3 === 0 || n4 === 0 || 
                    n5 === 0 || n6 === 0 || n7 === 0 || n8 === 0) {
                    // It touches the outside! Turn it pure black to match hexly.png
                    data[idx] = 0;     // R
                    data[idx+1] = 0;   // G
                    data[idx+2] = 0;   // B
                    edgeCount++;
                }
            }
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`Forced ${edgeCount} edge pixels to black on: ${filename}`);
}

async function run() {
    for (const f of files) {
        await makeBlackEdge(f);
    }
}
run().catch(console.error);
