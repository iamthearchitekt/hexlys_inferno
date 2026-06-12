const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function cleanImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // We can evaluate code inside the browser page to clean images.
    // We will read the images as base64 and pass them to the page.
    
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
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i+1];
                        const b = data[i+2];
                        const a = data[i+3];
                        
                        // If it's very close to pure white, make it transparent
                        if (r > 240 && g > 240 && b > 240 && a > 0) {
                            data[i+3] = 0;
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
        console.log(`Cleaned ${file}`);
    }
    
    await browser.close();
}

cleanImages().catch(console.error);
