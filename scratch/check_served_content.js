const http = require('http');

const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
};

(async () => {
    try {
        console.log('Fetching index.html from server...');
        const indexRes = await fetchUrl('http://localhost:3000/index.html');
        console.log('Index status:', indexRes.status);
        console.log('Index contains game.js?v=6:', indexRes.data.includes('game.js?v=6'));
        console.log('Index contains style.css?v=6:', indexRes.data.includes('style.css?v=6'));

        console.log('\nFetching game.js from server...');
        const gameRes = await fetchUrl('http://localhost:3000/game.js?v=6');
        console.log('Game status:', gameRes.status);
        console.log('Game contains loadLevel:', gameRes.data.includes('loadLevel'));
        console.log('Game contains window.engine.godMode:', gameRes.data.includes('window.engine.godMode'));
        console.log('Game contains r > 240 && g > 240 && b > 240:', gameRes.data.includes('r > 240 && g > 240 && b > 240'));
        console.log('Game contains width + 1:', gameRes.data.includes('width + 1'));

    } catch (e) {
        console.error('Error fetching from server:', e.message);
    }
})();
