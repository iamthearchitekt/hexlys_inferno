const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('<!DOCTYPE html>', 10);
if (idx > 0) {
    html = html.substring(0, idx);
    html += `            <!-- Toast / Message system overlay -->
            <div id="toast-message" class="hidden">COULDN'T BUMP BLOCK!</div>
        </div>
    </div>
    <script src="levels.js?v=20"></script>
    <script src="audiosynth.js?v=2"></script>
    <script src="game.js?v=20"></script>
</body>
</html>`;
    fs.writeFileSync('index.html', html);
    console.log("Fixed index.html");
} else {
    // If it's not broken, just bump the cache.
    html = html.replace(/levels\.js\?v=\d+/, 'levels.js?v=20');
    html = html.replace(/game\.js\?v=\d+/, 'game.js?v=20');
    fs.writeFileSync('index.html', html);
    console.log("Bumped cache to v20");
}
