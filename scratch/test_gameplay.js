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

        // Check initial state
        let state = await page.evaluate(() => engine ? engine.state : 'NO ENGINE');
        console.log('Initial state:', state);

        // Press Space to start the game
        console.log('Pressing Spacebar...');
        await page.keyboard.press('Space');
        await delay(1000);

        state = await page.evaluate(() => engine.state);
        console.log('State after Spacebar:', state);

        if (state !== 'PLAYING') {
            console.log('Clicking the START button as fallback...');
            await page.click('#start-btn');
            await delay(1000);
            state = await page.evaluate(() => engine.state);
            console.log('State after fallback click:', state);
        }

        // Trigger damage/kills until game over
        console.log('Damaging player to trigger Game Over...');
        await page.evaluate(() => {
            // Force health to 0 or repeatedly call damagePlayer to trigger game over
            engine.player.health = 1;
            engine.damagePlayer();
        });
        await delay(2000); // Wait for transition/animations

        state = await page.evaluate(() => engine.state);
        console.log('State after damage:', state);

        const isGameOverHidden = await page.evaluate(() => {
            const el = document.getElementById('game-over-screen');
            return el.classList.contains('hidden');
        });
        console.log('Is game-over-screen hidden:', isGameOverHidden);

        console.log('Taking game over screenshot...');
        await page.screenshot({ path: 'scratch/gameover_screenshot.png' });
        console.log('Game over screenshot saved to scratch/gameover_screenshot.png');

        // Press any key to restart
        console.log('Pressing Any Key (Space) to restart...');
        await page.keyboard.press('Space');
        await delay(1500);

        state = await page.evaluate(() => engine.state);
        console.log('State after Any Key restart:', state);

        const isGameOverHiddenAfter = await page.evaluate(() => {
            const el = document.getElementById('game-over-screen');
            return el.classList.contains('hidden');
        });
        console.log('Is game-over-screen hidden after restart:', isGameOverHiddenAfter);

    } catch (e) {
        console.error('Error during automation:', e);
    }

    await browser.close();
    console.log('Done!');
})();
