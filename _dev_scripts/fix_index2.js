const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The file has a duplicate <!DOCTYPE html> block at index 109 roughly. Let's slice it to the first <!DOCTYPE html>
let parts = html.split('<!DOCTYPE html>');
if (parts.length > 2) {
    // Keep only the first valid part + <!DOCTYPE html>
    html = '<!DOCTYPE html>' + parts[1];
}

// Ensure the victory-retry-btn is there!
if (!html.includes('victory-retry-btn')) {
    html = html.replace('<!-- Toast / Message system overlay -->',
`                    </div>
                    <button id="victory-retry-btn" class="arcade-btn pulse">PLAY AGAIN (R)</button>
                </div>
            </div>

            <!-- Toast / Message system overlay -->`);
}

// Make sure html and body tags are closed
if (!html.includes('</html>')) {
    html += `
        </div>
    </div>
    <script src="levels.js?v=21"></script>
    <script src="audiosynth.js?v=2"></script>
    <script src="game.js?v=21"></script>
</body>
</html>`;
} else {
    // bump cache
    html = html.replace(/levels\.js\?v=\d+/, 'levels.js?v=21');
    html = html.replace(/game\.js\?v=\d+/, 'game.js?v=21');
}

fs.writeFileSync('index.html', html);
console.log('Fixed completely!');
