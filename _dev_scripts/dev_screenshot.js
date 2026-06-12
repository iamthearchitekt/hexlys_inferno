const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type().toUpperCase(), msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

        await page.goto('file:///C:/Users/archi/.gemini/antigravity/scratch/hexlys_inferno/index.html', { waitUntil: 'networkidle0', timeout: 10000 });
        
        console.log("Clicking start...");
        await page.click('#start-btn');
        
        await new Promise(r => setTimeout(r, 1000));
        
        console.log("Clicking Dev Mode...");
        await page.click('#dev-toggle-btn');
        
        await new Promise(r => setTimeout(r, 1000));
        
        await page.screenshot({ path: 'C:/Users/archi/.gemini/antigravity/brain/66c7c09e-41be-43ad-9516-b8a09e16285c/dev_mode_error.png' });
        console.log("Screenshot saved!");
        
        await browser.close();
    } catch (e) {
        console.log("PUPPETEER ERROR:", e);
    }
})();
