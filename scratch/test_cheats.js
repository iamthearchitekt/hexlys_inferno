const puppeteer = require('puppeteer');

const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    try {
        console.log('Navigating to http://localhost:3000/index.html...');
        await page.goto('http://localhost:3000/index.html');
        await delay(1000);

        // Press Space to start
        console.log('Pressing Spacebar...');
        await page.keyboard.press('Space');
        await delay(1000);

        let state = await page.evaluate(() => engine.state);
        console.log('Game state:', state);

        // Press G to toggle God Mode
        console.log('Pressing G (God Mode)...');
        await page.keyboard.press('KeyG');
        await delay(500);

        let godMode = await page.evaluate(() => engine.godMode);
        console.log('God Mode is active:', godMode);

        // Press Digit2 to warp to Level 2
        console.log('Pressing Digit2 (Level 2)...');
        await page.keyboard.press('Digit2');
        await delay(1000);

        let lvlIdx = await page.evaluate(() => engine.currentLevelIndex);
        console.log('Current Level Index:', lvlIdx); // Should be 1 (0-indexed Level 2)

        // Try to damage player under God Mode
        console.log('Calling damagePlayer under God Mode...');
        await page.evaluate(() => engine.damagePlayer());
        let health = await page.evaluate(() => engine.player.health);
        console.log('Player health after damage in God Mode:', health); // Should stay at 3!

        // Press Digit3 to warp to Level 3
        console.log('Pressing Digit3 (Level 3)...');
        await page.keyboard.press('Digit3');
        await delay(1000);

        lvlIdx = await page.evaluate(() => engine.currentLevelIndex);
        console.log('Current Level Index after warping to 3:', lvlIdx); // Should be 2

        console.log('Taking a screenshot...');
        await page.screenshot({ path: 'scratch/cheats_screenshot.png' });
        console.log('Screenshot saved to scratch/cheats_screenshot.png');

    } catch (e) {
        console.error('Error during cheats test:', e);
    }

    await browser.close();
    console.log('Done!');
})();
