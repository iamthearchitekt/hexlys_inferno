const fs = require('fs');
const { execSync } = require('child_process');

console.log('Inlining levels.js (with rules applied) into index.html...');
let html = fs.readFileSync('index.html', 'utf8');

const startTag = '<script>\n// ----------------------------------------------------';
const endTag = '</script>';
const startIdx = html.indexOf(startTag);
const endIdx = html.indexOf(endTag, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.slice(0, startIdx) + '<script src="levels.js?v=5"></script>' + html.slice(endIdx + endTag.length);
    fs.writeFileSync('index.html', html, 'utf8');
} else {
    console.log('No inline script block found, looking for existing script tag...');
}

execSync('node scratch/inline_levels.js', { stdio: 'inherit' });
console.log('✓ Inlining complete!');
