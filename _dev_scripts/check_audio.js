const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text(), msg.location().url));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    
    await page.waitForSelector('#start-btn');
    await page.click('#start-btn');
    
    await new Promise(r => setTimeout(r, 2000));
    
    await browser.close();
})();
