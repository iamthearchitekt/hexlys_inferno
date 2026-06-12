const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1448, height: 728 });
    await page.goto('http://localhost:8000/fire_gate1.png', { waitUntil: 'networkidle0' });
    
    // Save to the artifacts directory where I can see it
    await page.screenshot({ path: 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/scratch/fire_gate_preview.png' });
    
    await browser.close();
})();
