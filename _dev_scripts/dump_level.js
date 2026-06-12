const fs = require('fs');
const data = fs.readFileSync('levels.js', 'utf8');

const layoutMatch = data.match(/layout:\s*\[([\s\S]*?)\]\s*\}\s*,/);
if (layoutMatch) {
    const script = `const layout = [${layoutMatch[1]}]; layout;`;
    const layout = eval(script);
    
    let output = '';
    
    // Print column header tens
    let header1 = '    ';
    for(let c=150; c<250; c++) header1 += Math.floor(c/10).toString().slice(-1);
    output += header1 + '\n';
    
    // Print column header ones
    let header2 = '    ';
    for(let c=150; c<250; c++) header2 += (c%10).toString();
    output += header2 + '\n';

    // Print rows 8, 9, 10
    for(let r=7; r<=10; r++) {
        let rowStr = `R${r.toString().padStart(2, ' ')} `;
        for(let c=150; c<250; c++) {
            let val = layout[r][c];
            if (val === 0) rowStr += '.';
            else if (val === 1) rowStr += '1';
            else if (val === 5) rowStr += 'L'; // Lava
            else if (val === 13) rowStr += 'B'; // Boss
            else rowStr += val.toString();
        }
        output += rowStr + '\n';
    }
    
    fs.writeFileSync('dump.txt', output);
    console.log("Dumped to dump.txt");
}
