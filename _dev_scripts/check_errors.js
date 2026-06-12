const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('BROWSER NETWORK ERROR:', request.url(), request.failure().errorText));

    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' });
    
    // Play for a few seconds and switch to level 2
    await page.evaluate(() => {
        if (window.gameEngine) {
            window.gameEngine.currentLevelIndex = 1;
            window.gameEngine.resetGame();
        }
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    await browser.close();
})();
