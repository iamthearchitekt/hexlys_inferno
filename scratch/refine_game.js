const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Refine getSpriteTrimBounds and drawSpriteAutoTrimmed
const oldSpriteFuncsStart = code.indexOf('function getSpriteTrimBounds(image)');
const oldSpriteFuncsEnd = code.indexOf('// ----------------------------------------------------', oldSpriteFuncsStart);

if (oldSpriteFuncsStart === -1 || oldSpriteFuncsEnd === -1) {
    console.log("Could not find sprite funcs");
    process.exit(1);
}

const newSpriteFuncs = `function getSpriteTrimBounds(image) {
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
        
        // 1. Flood fill to remove background
        const visited = new Uint8Array(w * h);
        const queue = [];
        
        // Push all edge pixels into queue
        for (let y = 0; y < h; y++) {
            queue.push([0, y], [w - 1, y]);
            visited[y * w] = 1;
            visited[y * w + w - 1] = 1;
        }
        for (let x = 0; x < w; x++) {
            queue.push([x, 0], [x, h - 1]);
            visited[x] = 1;
            visited[(h - 1) * w + x] = 1;
        }
        
        let qHead = 0;
        while(qHead < queue.length) {
            const [x, y] = queue[qHead++];
            const i = (y * w + x) * 4;
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            
            // Check if it's background (transparent or near white)
            const isBg = a <= 10 || (r > 240 && g > 240 && b > 240);
            
            if (isBg) {
                // Erase it
                data[i+3] = 0;
                
                // Add neighbors
                const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                for (const d of dirs) {
                    const nx = x + d[0], ny = y + d[1];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        const ni = ny * w + nx;
                        if (!visited[ni]) {
                            visited[ni] = 1;
                            queue.push([nx, ny]);
                        }
                    }
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        image.processedCanvas = canvas;
        
        // 2. Find Trim Bounds
        let minX = w, maxX = 0, minY = h, maxY = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[(y * w + x) * 4 + 3] > 0) {
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
        console.warn("Canvas pixel scan failed:", e);
        return { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    }
}

function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    
    if (!image.trimBounds) {
        image.trimBounds = getSpriteTrimBounds(image);
    }
    
    const b = image.trimBounds || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    
    if (b.w <= 0 || b.h <= 0 || isNaN(b.w) || isNaN(b.h)) return;
    if (dw <= 0 || dh <= 0 || isNaN(dw) || isNaN(dh) || isNaN(dx) || isNaN(dy)) return;
    
    ctx.save();
    ctx.translate(Math.round(dx + dw / 2), Math.round(dy + dh / 2));
    if (flipX) ctx.scale(-1, 1);
    
    const sourceImage = image.processedCanvas || image;
    ctx.drawImage(sourceImage, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

`;
code = code.substring(0, oldSpriteFuncsStart) + newSpriteFuncs + code.substring(oldSpriteFuncsEnd);

// 2. Fix Sprint
const oldSprint = 'const isSprinting = input.shootHeld;';
const newSprint = 'const isSprinting = input.left || input.right;';
code = code.replace(oldSprint, newSprint);

// 3. Add number keys to InputHandler
const inputKeyDownMatch = `        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
            e.preventDefault();
        }`;
const inputKeyDownReplace = `        if (code.startsWith('Digit') && code.length === 6) {
            const num = parseInt(code.replace('Digit', ''));
            if (!isNaN(num)) this['digit' + num] = true;
        }

        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
            e.preventDefault();
        }`;
code = code.replace(inputKeyDownMatch, inputKeyDownReplace);

// 4. Add warp logic to GameEngine.update
const engineUpdateMatch = `    update() {
        if (this.state === 'TITLE') return;`;
const engineUpdateReplace = `    update() {
        // Handle level warping
        for (let i=1; i<=9; i++) {
            if (this.input['digit'+i]) {
                this.input['digit'+i] = false;
                if (i-1 < LEVELS.length) {
                    this.currentLevelIndex = i-1;
                    this.resetGame();
                    const lvl = LEVELS[this.currentLevelIndex];
                    this.disableEnemyFireballs = lvl.disableEnemyFireballs || false;
                    if (lvl.background) document.getElementById('game-container').style.backgroundImage = 'url(' + lvl.background + ')';
                    return;
                }
            }
        }
        
        if (this.state === 'TITLE') return;`;
code = code.replace(engineUpdateMatch, engineUpdateReplace);

fs.writeFileSync('game.js', code);
console.log('Successfully patched all issues.');
