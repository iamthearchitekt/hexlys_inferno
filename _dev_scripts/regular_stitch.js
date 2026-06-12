const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function stitch() {
    console.log("Loading background_lvl1.png...");
    const img = await loadImage('backgrounds/background_lvl1.png');
    const w = img.width;
    const h = img.height;
    
    const overlap = Math.floor(w * 0.2); 
    const finalW = w - overlap;
    
    const finalCanvas = createCanvas(finalW, h);
    const finalCtx = finalCanvas.getContext('2d');
    
    const leftPieceW = Math.floor(w / 2);
    finalCtx.drawImage(img, w - leftPieceW, 0, leftPieceW, h, 0, 0, leftPieceW, h);
    
    const rightPieceX = leftPieceW - overlap;
    
    const rightCanvas = createCanvas(w/2, h);
    const rightCtx = rightCanvas.getContext('2d');
    rightCtx.drawImage(img, 0, 0, w/2, h, 0, 0, w/2, h);
    
    rightCtx.globalCompositeOperation = 'destination-in';
    const grad = rightCtx.createLinearGradient(0, 0, overlap, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)'); 
    grad.addColorStop(1, 'rgba(0,0,0,1)'); 
    rightCtx.fillStyle = grad;
    // Fill the ENTIRE canvas at once! The gradient pads with solid color after 'overlap'.
    rightCtx.fillRect(0, 0, w/2, h); 
    
    rightCtx.globalCompositeOperation = 'source-over';
    
    finalCtx.drawImage(rightCanvas, rightPieceX, 0);
    
    const buffer = finalCanvas.toBuffer('image/png');
    fs.writeFileSync('background_lvl1_regular_seamless.png', buffer);
    console.log("Regular seamless background completely fixed!");
}

stitch().catch(console.error);
