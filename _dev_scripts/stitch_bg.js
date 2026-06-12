const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function stitch() {
    console.log("Loading background_lvl1.png...");
    const img = await loadImage('backgrounds/background_lvl1.png');
    
    // Create a new canvas that is twice as wide to hold the original + mirrored image
    const width = img.width;
    const height = img.height;
    
    // The seamless version should just mirror the image right side
    const canvas = createCanvas(width * 2, height);
    const ctx = canvas.getContext('2d');
    
    // Draw original on the left
    ctx.drawImage(img, 0, 0, width, height);
    
    // Draw horizontally flipped on the right
    ctx.save();
    ctx.translate(width * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
    
    // Save the new seamless background
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('background_lvl1_seamless.png', buffer);
    console.log("Seamless background created successfully: background_lvl1_seamless.png (" + (width*2) + "x" + height + ")");
}

stitch().catch(console.error);
