const fs = require('fs');

const originalFunctions = `
/**
 * Scans an image offscreen to find the exact bounding box of non-transparent pixels,
 * ignoring empty transparent borders at the source.
 */
function getSpriteTrimBounds(image) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return null;
    
    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        ctx.drawImage(image, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        
        let minX = w, maxX = 0, minY = h, maxY = 0;
        
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const alpha = data[(y * w + x) * 4 + 3];
                if (alpha > 5) { // ignore light compression artifact noise
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        if (maxX < minX || maxY < minY) {
            return { x: 0, y: 0, w: w, h: h };
        }
        
        return {
            x: minX,
            y: minY,
            w: (maxX - minX) + 1,
            h: (maxY - minY) + 1
        };
    } catch (e) {
        console.warn("Canvas pixel scan failed (using fallback bounds):", e);
        return { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    }
}

/**
 * Draws a sprite dynamically cropped to its visual pixel bounds, guaranteeing perfect
 * sizing, alignment, and scale between different animation frames.
 */
function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    
    if (!image.trimBounds) {
        image.trimBounds = getSpriteTrimBounds(image);
    }
    
    const b = image.trimBounds || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    
    // Validate bounds to prevent IndexSizeError (drawing 0-width or 0-height images is forbidden in Canvas)
    if (b.w <= 0 || b.h <= 0 || isNaN(b.w) || isNaN(b.h)) return;
    if (dw <= 0 || dh <= 0 || isNaN(dw) || isNaN(dh) || isNaN(dx) || isNaN(dy)) return;
    
    ctx.save();
    ctx.translate(Math.round(dx + dw / 2), Math.round(dy + dh / 2));
    if (flipX) {
        ctx.scale(-1, 1);
    }
    
    // Draw only the cropped character sub-rectangle scaled perfectly to fit the drawing box (dw, dh)!
    ctx.drawImage(image, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

// ----------------------------------------------------
`;

let gameCode = fs.readFileSync('game.js', 'utf8');

// Find insertion point right after `ctx.restore();` at the end of drawPixelMatrix
const targetIndex = gameCode.indexOf('// 2. 16-BIT RETRO GRAPHICS MATRIX SPRITE SHEETS');

if (targetIndex !== -1) {
    const finalCode = gameCode.substring(0, targetIndex) + originalFunctions + gameCode.substring(targetIndex);
    fs.writeFileSync('game.js', finalCode);
    console.log('Successfully patched functions into game.js');
} else {
    console.log('Failed to find insertion point!');
}
