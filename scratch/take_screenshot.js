const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        // Set standard viewport
        await page.setViewport({ width: 960, height: 540 });
        
        console.log("Loading page...");
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
        
        console.log("Waiting for game to load...");
        await new Promise(r => setTimeout(r, 1000));
        
        // Check for start button
        const btn = await page.$('#start-btn');
        if (btn) {
            console.log("Clicking start...");
            await btn.click();
            await new Promise(r => setTimeout(r, 1000)); // Wait for game to begin
        } else {
            console.log("No start button found, assuming game already running.");
        }
        
        console.log("Taking screenshot...");
        await page.screenshot({ path: 'C:\\Users\\archi\\.gemini\\antigravity\\brain\\66c7c09e-41be-43ad-9516-b8a09e16285c\\level1_screenshot.png' });
        console.log("Done.");
        
        await browser.close();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
})();
