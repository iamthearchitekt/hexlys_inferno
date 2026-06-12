const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously' });

setTimeout(() => {
    try {
        const engine = dom.window.engine;
        console.log('Engine state before:', engine.state);
        engine.damagePlayer();
        console.log('Engine state after damage:', engine.state);
        
        // Wait for setTimeout in damagePlayer
        setTimeout(() => {
            console.log('Engine state after timeout:', engine.state);
            process.exit(0);
        }, 1200);
    } catch(e) {
        console.error('ERROR:', e);
        process.exit(1);
    }
}, 1000);
