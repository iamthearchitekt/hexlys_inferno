const { execSync } = require('child_process');
const fs = require('fs');

try {
    const committed = execSync('git show HEAD:levels.js', { maxBuffer: 15 * 1024 * 1024 }).toString('utf8');
    const workspace = fs.readFileSync('levels.js', 'utf8');

    const getLevelsNames = (code) => {
        const re = /name: "([^"]+)"/g;
        const names = [];
        let m;
        while ((m = re.exec(code)) !== null) {
            names.push(m[1]);
        }
        return names;
    };

    console.log('Committed level names:', getLevelsNames(committed));
    console.log('Workspace level names:', getLevelsNames(workspace));

    // Compare each level's layout string
    const getLevels = (code) => {
        const re = /name: "([^"]+)"[\s\S]*?layout: (\[[\s\S]*?\])\s*\}/g;
        const map = {};
        let m;
        while ((m = re.exec(code)) !== null) {
            map[m[1]] = m[2];
        }
        return map;
    };

    const commMap = getLevels(committed);
    const workMap = getLevels(workspace);

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
    console.error('Error comparing levels:', e.message);
}
