const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
        if (!window.engine) return;
        
        engine.currentLevelIndex = 1;
        engine.resetGame();
        
        engine.camera.x = 3500;
        engine.player.x = 3500;
        
        const oldUpdate = engine.update.bind(engine);
        let logged = false;
        engine.update = function(timestamp) {
            oldUpdate(timestamp);
            if (!logged && engine.enemies.length > 0) {
                const g = engine.enemies.find(e => e.constructor.name === 'Ghost');
                if (g) {
                    const drawX = g.x - engine.camera.x;
                    console.log(`Ghost state: x=${g.x}, y=${g.y}, drawX=${drawX}, width=${g.width}, height=${g.height}, isMoving=${g.isMoving}`);
                    logged = true;
                }
            }
        };
    });
    
    await new Promise(r => setTimeout(r, 1000));
    await browser.close();
})();
