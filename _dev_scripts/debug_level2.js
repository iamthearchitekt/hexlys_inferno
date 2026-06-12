const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    
    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' });
    
    // Click the start button specifically
    await page.evaluate(() => {
        const btn = document.getElementById('start-btn');
        if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    await page.evaluate(() => {
        if (!window.engine) return;
        
        // Switch to level 2
        engine.startGame(1);
        
        // Ghost is at x=3600
        engine.camera.x = 3500;
        engine.player.x = 3500; 
        engine.player.y = 315;
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    const screenshotPath = 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/level2_ghost_debug5.png';
    await page.screenshot({ path: screenshotPath });
    console.log("Saved screenshot to " + screenshotPath);
    
    await browser.close();
})();
