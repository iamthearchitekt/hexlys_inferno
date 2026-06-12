const { execSync } = require('child_process');
const fs = require('fs');

try {
    const committedHtml = execSync('git show HEAD:index.html', { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
    const workspaceLevels = fs.readFileSync('levels.js', 'utf8');

    const extractLevelsArray = (htmlContent) => {
        const startTag = 'const LEVELS = [';
        const endTag = '];';
        const startIdx = htmlContent.indexOf(startTag);
        if (startIdx === -1) return null;
        
        const arrayStart = startIdx + 'const LEVELS = '.length;
        let open = 0, arrayEnd = -1;
        for (let i = arrayStart; i < htmlContent.length; i++) {
            if (htmlContent[i] === '[') open++;
            else if (htmlContent[i] === ']') {
                open--;
                if (open === 0) {
                    arrayEnd = i + 1;
                    break;
                }
            }
        }
        if (arrayEnd === -1) return null;
        return htmlContent.slice(arrayStart, arrayEnd);
    };

    const commArrStr = extractLevelsArray(committedHtml);
    if (!commArrStr) {
        console.log('Could not extract LEVELS array from committed index.html');
        process.exit(1);
    }

    // Evaluate the committed levels array safely in isolated VM/context
    // We can just parse names using regex
    const getLevels = (code) => {
        const re = /name: "([^"]+)"[\s\S]*?layout: (\[[\s\S]*?\])\s*\}/g;
        const map = {};
        let m;
        while ((m = re.exec(code)) !== null) {
            map[m[1]] = m[2];
        }
        return map;
    };

    const commMap = getLevels(commArrStr);
    const workMap = getLevels(workspaceLevels);

    console.log('Committed names:', Object.keys(commMap));
    console.log('Workspace names:', Object.keys(workMap));

    Object.keys(commMap).forEach(name => {
        if (!workMap[name]) {
            console.log(`Level "${name}" is missing in workspace!`);
        } else {
            const cleanStr = (s) => s.replace(/\s+/g, '');
            const cStr = cleanStr(commMap[name]);
            const wStr = cleanStr(workMap[name]);
            if (cStr === wStr) {
                console.log(`Level "${name}" matches exactly.`);
            } else {
                console.log(`Level "${name}" is DIFFERENT!`);
                console.log(`  Committed len: ${cStr.length}, Workspace len: ${wStr.length}`);
            }
        }
    });

} catch (e) {
    console.error('Error in script:', e.message);
}
