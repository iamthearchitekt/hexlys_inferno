const fs = require('fs');
const content = fs.readFileSync('scratch/all_game_edits.txt', 'utf8');

const stepMarker = 'STEP 633:';
const idx = content.indexOf(stepMarker);
if (idx === -1) {
    console.error('STEP 633 not found');
    process.exit(1);
}

const contentStartMarker = '--- Content Start ---';
const contentStartIdx = content.indexOf(contentStartMarker, idx);
if (contentStartIdx === -1) {
    console.error('--- Content Start --- not found after step marker');
    process.exit(1);
}

const lineStart = contentStartIdx + contentStartMarker.length;
const contentEndMarker = '--- Content End ---';
const contentEndIdx = content.indexOf(contentEndMarker, lineStart);
if (contentEndIdx === -1) {
    console.error('--- Content End --- not found after content start');
    process.exit(1);
}

let contentStr = content.substring(lineStart, contentEndIdx).trim();

// Unescape the JSON-escaped string
let finalCode;
try {
    finalCode = JSON.parse(contentStr);
} catch (e) {
    console.warn('Failed to parse content as JSON directly, trying to wrap or use raw:', e.message);
    if (!contentStr.startsWith('"')) {
        contentStr = '"' + contentStr + '"';
        try {
            finalCode = JSON.parse(contentStr);
        } catch (err) {
            console.error('Failed to unescape wrapped string:', err.message);
            finalCode = contentStr;
        }
    } else {
        finalCode = contentStr;
    }
}

fs.writeFileSync('scratch/audiosynth.js', finalCode, 'utf8');
console.log('Successfully wrote AudioSynth code to scratch/audiosynth.js!');
console.log('Code length:', finalCode.length);
