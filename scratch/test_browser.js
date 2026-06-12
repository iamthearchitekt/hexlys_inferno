const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // Check if start button exists
    const btn = await page.$('#start-btn');
    if (btn) {
        console.log('Clicking start button...');
        await btn.click();
    } else {
        console.log('Start button not found!');
    }
    
    await new Promise(r => setTimeout(r, 1000));
    await browser.close();
})();
