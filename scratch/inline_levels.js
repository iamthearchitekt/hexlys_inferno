const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const levelsCode = fs.readFileSync('levels.js', 'utf8');

// Find: <script src="levels.js?v=5"></script>
const target = '<script src="levels.js?v=5"></script>';
const replacement = `<script>
${levelsCode}
</script>`;

if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync('index.html', html);
    console.log('✓ Successfully inlined levels.js into index.html!');
} else {
    console.warn('Could not find levels.js script tag in index.html. Already inlined?');
}
