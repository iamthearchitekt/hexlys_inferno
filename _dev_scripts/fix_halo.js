const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const files = [
    'hexly.png',
    'hexly_crouch.png',
    'hexly_jump.png',
    'hexly_projectile.png',
    'hexly_walk2.png',
    'idle1.png',
    'idle2.png',
    'idle3.png'
];

async function fixHalo(filename) {
    if (!fs.existsSync(filename)) return;
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;
    
    // Hard threshold the alpha channel to completely kill any soft halos/artifacts
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 220) {
            data[i] = 0; // Destroy semi-transparent fringe pixels
        } else {
            data[i] = 255; // Ensure pixel is perfectly solid
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log("Fixed halo for:", filename);
}

async function run() {
    for (const f of files) {
        await fixHalo(f);
    }
}

run().catch(console.error);
