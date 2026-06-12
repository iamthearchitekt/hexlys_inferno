const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.slice(54, 115).forEach((line, index) => {
    console.log(`${index + 55}: ${line}`);
});
