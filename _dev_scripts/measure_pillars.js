const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    const result = await page.evaluate(async () => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                
                // Find first non-transparent column from left
                let leftPillarStart = -1;
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                        if (alpha > 10) {
                            leftPillarStart = x;
                            break;
                        }
                    }
                    if (leftPillarStart !== -1) break;
                }
                
                // Find right edge of left pillar (where it becomes transparent again)
                let leftPillarEnd = -1;
                for (let x = leftPillarStart; x < canvas.width; x++) {
                    let hasPixels = false;
                    for (let y = 0; y < canvas.height; y++) {
                        const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                        if (alpha > 10) {
                            hasPixels = true;
                            break;
                        }
                    }
                    if (!hasPixels) {
                        leftPillarEnd = x;
                        break;
                    }
                }
                
                // Find right pillar start from right edge going left
                let rightPillarEnd = -1;
                for (let x = canvas.width - 1; x >= 0; x--) {
                    for (let y = 0; y < canvas.height; y++) {
                        const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                        if (alpha > 10) {
                            rightPillarEnd = x;
                            break;
                        }
                    }
                    if (rightPillarEnd !== -1) break;
                }

                let rightPillarStart = -1;
                for (let x = rightPillarEnd; x >= 0; x--) {
                    let hasPixels = false;
                    for (let y = 0; y < canvas.height; y++) {
                        const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                        if (alpha > 10) {
                            hasPixels = true;
                            break;
                        }
                    }
                    if (!hasPixels) {
                        rightPillarStart = x;
                        break;
                    }
                }
                
                resolve({ leftPillarStart, leftPillarEnd, rightPillarStart, rightPillarEnd, width: img.width });
            };
            img.src = 'http://localhost:8000/fire_gate1.png';
        });
    });
    
    console.log("PILLAR STATS:", result);
    await browser.close();
})();
