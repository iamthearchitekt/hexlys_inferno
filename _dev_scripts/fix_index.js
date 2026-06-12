const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const levelsStart = html.indexOf('const LEVELS = [');
const levelsEnd = html.indexOf('</script>', levelsStart);
if (levelsStart !== -1 && levelsEnd !== -1) {
    let newHtml = html.substring(0, html.lastIndexOf('<script', levelsStart)) + '<script src="levels.js?v=2"></script>\n' + html.substring(levelsEnd + 9);
    fs.writeFileSync('index.html', newHtml, 'utf8');
    console.log('Fixed index.html to link to levels.js!');
} else {
    console.log('Could not find LEVELS block.');
}
