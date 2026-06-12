const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// Replace getSpriteTrimBounds
const oldTrim = `function getSpriteTrimBounds(image) {
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
}`;

const newTrim = `function getSpriteTrimBounds(image) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return null;
        
        ctx.drawImage(image, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        
        let minX = w, maxX = 0, minY = h, maxY = 0;
        
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                let alpha = data[i + 3];
                
                // Treat pure or near-white as transparent background
                if (r > 240 && g > 240 && b > 240) {
                    data[i + 3] = 0;
                    alpha = 0;
                }
                
                if (alpha > 5) { // ignore light compression artifact noise
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        image.processedCanvas = canvas; // Cache the processed canvas
        
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
}`;

code = code.replace(oldTrim, newTrim);

// Replace drawSpriteAutoTrimmed
const oldDraw = `function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
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
}`;

const newDraw = `function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    
    if (!image.trimBounds) {
        image.trimBounds = getSpriteTrimBounds(image);
    }
    
    const b = image.trimBounds || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    
    // Validate bounds to prevent IndexSizeError
    if (b.w <= 0 || b.h <= 0 || isNaN(b.w) || isNaN(b.h)) return;
    if (dw <= 0 || dh <= 0 || isNaN(dw) || isNaN(dh) || isNaN(dx) || isNaN(dy)) return;
    
    ctx.save();
    ctx.translate(Math.round(dx + dw / 2), Math.round(dy + dh / 2));
    if (flipX) {
        ctx.scale(-1, 1);
    }
    
    // Draw the processed canvas if available, otherwise the raw image
    const source = image.processedCanvas || image;
    
    ctx.drawImage(source, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}`;

code = code.replace(oldDraw, newDraw);

fs.writeFileSync('game.js', code);
console.log('Applied white background removal to auto trimmer!');
