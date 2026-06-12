const fs = require('fs');
const { spawn } = require('child_process');

console.log('Comparing current game.js with initial commit...');

const currentLines = fs.readFileSync('game.js', 'utf8').split('\n');

const gitShow = spawn('git', ['show', 'f09e97b:game.js']);
let originalData = '';

gitShow.stdout.on('data', (data) => {
    originalData += data.toString('utf8');
});

gitShow.on('close', (code) => {
    if (code !== 0) {
        console.error('git show failed with code', code);
        return;
    }
    
    const originalLines = originalData.split('\n');
    console.log(`Original lines: ${originalLines.length}, Current lines: ${currentLines.length}`);
    
    // Simple line by line comparison (ignoring trailing whitespace)
    let curIdx = 0;
    let origIdx = 0;
    
    while (curIdx < currentLines.length || origIdx < originalLines.length) {
        const curLine = (currentLines[curIdx] || '').trim();
        const origLine = (originalLines[origIdx] || '').trim();
        
        if (curLine === origLine) {
            curIdx++;
            origIdx++;
            continue;
        }
        
        // Check for inserts or deletes
        // Let's print changes but limit size of printed lines to 150 chars
        const printCur = curLine.length > 150 ? curLine.substring(0, 150) + '... (truncated)' : curLine;
        const printOrig = origLine.length > 150 ? origLine.substring(0, 150) + '... (truncated)' : origLine;
        
        // Let's see if we can align. For simple output we can just print line numbers and contents
        // To keep it simple, we'll just scan ahead a bit to align
        let foundMatch = false;
        for (let lookahead = 1; lookahead <= 10; lookahead++) {
            if (curIdx + lookahead < currentLines.length && (currentLines[curIdx + lookahead] || '').trim() === origLine) {
                // lookahead items inserted in current
                for (let k = 0; k < lookahead; k++) {
                    const l = currentLines[curIdx + k];
                    console.log(`+ L${curIdx + k + 1}: ${l.length > 150 ? l.substring(0, 150) + '...' : l}`);
                }
                curIdx += lookahead;
                foundMatch = true;
                break;
            }
            if (origIdx + lookahead < originalLines.length && curLine === (originalLines[origIdx + lookahead] || '').trim()) {
                // lookahead items deleted from current
                for (let k = 0; k < lookahead; k++) {
                    const l = originalLines[origIdx + k];
                    console.log(`- L${origIdx + k + 1} (orig): ${l.length > 150 ? l.substring(0, 150) + '...' : l}`);
                }
                origIdx += lookahead;
                foundMatch = true;
                break;
            }
        }
        
        if (!foundMatch) {
            // mismatch at this line, print both and advance both
            console.log(`~ L${curIdx + 1} (curr): ${printCur}`);
            console.log(`~ L${origIdx + 1} (orig): ${printOrig}`);
            curIdx++;
            origIdx++;
        }
    }
});
