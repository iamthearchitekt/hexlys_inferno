const { createCanvas, loadImage } = require('canvas');

async function checkAlpha(filename) {
    const img = await loadImage(filename);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;
    
    let maxAlpha = 0;
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] > maxAlpha) {
            maxAlpha = data[i];
        }
    }
    
    console.log(`${filename} max alpha: ${maxAlpha}`);
}

checkAlpha('ghost_idle.png');
checkAlpha('ghost_move.png');
