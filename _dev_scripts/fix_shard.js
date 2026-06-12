const fs = require('fs');
const puppeteer = require('puppeteer');

async function fixShard() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const b64 = fs.readFileSync('soul_shard.png').toString('base64');
    const dataUrl = `data:image/png;base64,${b64}`;
    
    const fixedDataUrl = await page.evaluate(async (src) => {
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
                const width = canvas.width;
                const height = canvas.height;
                
                // Array to keep track of which pixels are connected to the outside transparent region
                const outside = new Array(width * height).fill(false);
                const stack = [];
                
                // Add all edge pixels to the stack
                for (let y = 0; y < height; y++) {
                    stack.push({x: 0, y});
                    stack.push({x: width - 1, y});
                }
                for (let x = 0; x < width; x++) {
                    stack.push({x, y: 0});
                    stack.push({x, y: height - 1});
                }
                
                // Flood fill the outside transparent area
                while (stack.length > 0) {
                    const {x, y} = stack.pop();
                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    
                    const i = y * width + x;
                    if (outside[i]) continue;
                    
                    const pixelIndex = i * 4;
                    // If it's transparent or very close to it
                    if (data[pixelIndex + 3] === 0) {
                        outside[i] = true;
                        stack.push({x: x + 1, y});
                        stack.push({x: x - 1, y});
                        stack.push({x, y: y + 1});
                        stack.push({x, y: y - 1});
                    }
                }
                
                // Now fill any transparent pixel that is NOT connected to the outside with white
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const i = y * width + x;
                        const pixelIndex = i * 4;
                        if (data[pixelIndex + 3] === 0 && !outside[i]) {
                            // This is a hole inside the sprite! Fill it with white!
                            data[pixelIndex] = 255;     // R
                            data[pixelIndex + 1] = 255; // G
                            data[pixelIndex + 2] = 255; // B
                            data[pixelIndex + 3] = 255; // A
                        }
                    }
                }
                
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = src;
        });
    }, dataUrl);
    
    const base64Data = fixedDataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync('soul_shard.png', base64Data, 'base64');
    console.log('Fixed soul_shard.png missing center pixels!');
    
    await browser.close();
}

fixShard().catch(console.error);
