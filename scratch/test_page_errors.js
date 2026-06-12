const puppeteer = require('puppeteer');

const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log('CONSOLE:', msg.text());
    });
    
    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.message);
    });
    
    page.on('requestfailed', request => {
        console.log('REQUEST FAILED:', request.url(), request.failure() ? request.failure().errorText : '');
    });
    
    // We can also log response status
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log('HTTP ERROR:', response.status(), response.url());
        }
    });

    try {
        console.log('Navigating to game...');
        await page.goto('http://localhost:3000/index.html');
        await delay(2000);
        
        console.log('Taking screenshot...');
        await page.screenshot({ path: 'scratch/screenshot.png' });
        console.log('Screenshot saved to scratch/screenshot.png');
    } catch (e) {
        console.error('Test script error:', e);
    }
    
    await browser.close();
})();
