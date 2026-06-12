const { execSync } = require('child_process');

console.log('Regenerating all level layouts...');

try {
    console.log('- Running Level 2 generator...');
    execSync('node scratch/generate_airy_layout.js', { stdio: 'inherit' });

    console.log('- Running Level 2 stairs tweaker...');
    execSync('node scratch/tweak_level2.js', { stdio: 'inherit' });

    console.log('- Running Level 3 swamp generator...');
    execSync('node scratch/generate_swamp_layout.js', { stdio: 'inherit' });

    console.log('- Running Level 5 blood marshes generator...');
    execSync('node scratch/generate_level5_layout.js', { stdio: 'inherit' });

    console.log('- Running Level 6 necropolis generator...');
    execSync('node scratch/generate_level6_layout.js', { stdio: 'inherit' });

    console.log('- Inlining levels.js into index.html...');
    // We need to restore index.html to load levels.js first, so inline_levels.js can match it
    const fs = require('fs');
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Find the inline script block and replace it back to the script tag so inline_levels.js can replace it cleanly
    const startTag = '<script>\n// ----------------------------------------------------';
    const endTag = '</script>';
    const startIdx = html.indexOf(startTag);
    const endIdx = html.indexOf(endTag, startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.slice(0, startIdx) + '<script src="levels.js?v=5"></script>' + html.slice(endIdx + endTag.length);
        fs.writeFileSync('index.html', html, 'utf8');
    }
    
    execSync('node scratch/inline_levels.js', { stdio: 'inherit' });
    console.log('✓ Successfully regenerated all levels and inlined them!');
} catch (e) {
    console.error('X Regeneration failed:', e.message);
    process.exit(1);
}
