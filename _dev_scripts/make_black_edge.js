const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const files = [
    'hexly.png', // Redo hexly to be sure
    'hexly_crouch.png',
    'hexly_jump.png',
    'hexly_projectile.png',
    'hexly_walk2.png',
    'idle1.png',
    'idle2.png',
    'idle3.png'
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
    
    // Pass 1: Strict alpha thresholding
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
    
    // Pass 2: Expand black edge. Any pixel within 2 pixels of transparency AND not pure white/red becomes black
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const a = copy[idx + 3];
            
            if (a > 0) {
                let touchesTransparent = false;
                // Check 2-pixel radius
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        if (getAlpha(x + dx, y + dy) === 0) {
                            touchesTransparent = true;
                            break;
                        }
                    }
                    if (touchesTransparent) break;
                }
                
                if (touchesTransparent) {
                    const r = copy[idx];
                    const g = copy[idx+1];
                    const b = copy[idx+2];
                    
                    // Don't turn pure bright red or pure white into black!
                    // Hexly red: R > 150, G < 50, B < 50
                    // White: R > 200, G > 200, B > 200
                    const isRed = r > 150 && g < 100 && b < 100;
                    const isWhite = r > 200 && g > 200 && b > 200;
                    
                    if (!isRed && !isWhite) {
                        data[idx] = 0;     // R
                        data[idx+1] = 0;   // G
                        data[idx+2] = 0;   // B
                        edgeCount++;
                    }
                }
            }
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`Forced ${edgeCount} edge/grey pixels to black on: ${filename}`);
}

async function run() {
    for (const f of files) {
        await makeBlackEdge(f);
    }
}
run().catch(console.error);
