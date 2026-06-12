const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function cleanImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filesToClean = ['hexly_projectile.png'];
    
    for (const file of filesToClean) {
        const p = path.resolve(file);
        if (!fs.existsSync(p)) continue;
        
        const b64 = fs.readFileSync(p).toString('base64');
        const dataUrl = `data:image/png;base64,${b64}`;
        
        const cleanDataUrl = await page.evaluate(async (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;
                    
                    // Helper to get pixel index
                    const idx = (x, y) => (y * canvas.width + x) * 4;
                    
                    // Helper to check if a pixel is white or transparent
                    const isWhiteOrTrans = (x, y) => {
                        const i = idx(x, y);
                        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                        if (a === 0) return true;
                        // For the boss and crouch sprite, the fringes are white or off-white
                        if (r > 230 && g > 230 && b > 230) return true;
                        return false;
                    };
                    
                    let visited = new Uint8Array(canvas.width * canvas.height);
                    let q = [];
                    
                    // Start flood fill from the top, bottom, left, right edges
                    for(let x=0; x<canvas.width; x++) {
                        q.push([x, 0]);
                        q.push([x, canvas.height - 1]);
                    }
                    for(let y=0; y<canvas.height; y++) {
                        q.push([0, y]);
                        q.push([canvas.width - 1, y]);
                    }
                    
                    let head = 0;
                    while(head < q.length) {
                        const [x, y] = q[head++];
                        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
                        
                        const vi = y * canvas.width + x;
                        if (visited[vi]) continue;
                        visited[vi] = 1;
                        
                        if (isWhiteOrTrans(x, y)) {
                            // Turn it completely transparent
                            const i = idx(x, y);
                            data[i+3] = 0;
                            
                            q.push([x+1, y]);
                            q.push([x-1, y]);
                            q.push([x, y+1]);
                            q.push([x, y-1]);
                            // Also diagonal for fringes
                            q.push([x+1, y+1]);
                            q.push([x-1, y-1]);
                            q.push([x+1, y-1]);
                            q.push([x-1, y+1]);
                        }
                    }
                    
                    ctx.putImageData(imgData, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.src = src;
            });
        }, dataUrl);
        
        const base64Data = cleanDataUrl.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(p, base64Data, 'base64');
        console.log(`Flood-fill cleaned ${file}`);
    }
    
    await browser.close();
}

cleanImages().catch(console.error);
