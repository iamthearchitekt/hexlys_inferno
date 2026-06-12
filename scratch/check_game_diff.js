const { execSync } = require('child_process');

try {
    const diff = execSync('git diff game.js', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
    const lines = diff.split('\n');
    let output = [];
    lines.forEach(l => {
        // Filter out extremely long lines or lines with data:image/png
        if (l.length > 300 || l.includes('data:image') || l.includes('base64')) {
            output.push(l.substring(0, 100) + '... [BASE64 TRUNCATED]');
        } else {
            output.push(l);
        }
    });
    console.log(output.slice(0, 1000).join('\n'));
    if (output.length > 1000) {
        console.log(`... truncated ${output.length - 1000} lines ...`);
    }
} catch (e) {
    console.error('Error running diff:', e.message);
}
