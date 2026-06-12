const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        // Capture browser console logs
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type().toUpperCase(), msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
        
        // Wait a tiny bit just to see if it freezes immediately
        await new Promise(r => setTimeout(r, 2000));
        
        await page.screenshot({ path: 'debug_screenshot.png' });
        console.log("Screenshot saved to debug_screenshot.png");
        
        await browser.close();
    } catch (e) {
        console.log("PUPPETEER ERROR:", e);
    }
})();
