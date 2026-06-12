const { createCanvas, loadImage } = require('canvas');

async function dumpPixels(filename) {
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    
    let blackPixels = 0;
    let transparentPixels = 0;
    let otherPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];
        
        if (a === 0) {
            transparentPixels++;
        } else if (r === 0 && g === 0 && b === 0 && a === 255) {
            blackPixels++;
        } else {
            otherPixels++;
        }
    }
    
    console.log(`${filename}: Total pixels: ${data.length / 4}`);
    console.log(`Transparent: ${transparentPixels}`);
    console.log(`Black: ${blackPixels}`);
    console.log(`Other: ${otherPixels}`);
}

dumpPixels('ghost_idle.png');
dumpPixels('ghost_move.png');
