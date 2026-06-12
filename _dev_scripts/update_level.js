const fs = require('fs');
const text = fs.readFileSync('levels.js', 'utf8');
const newLayoutRaw = fs.readFileSync('new_layout.json', 'utf8').trim();

// Parse and re-stringify to format it nicely with indentation
let newLayoutArray;
try {
    newLayoutArray = JSON.parse(newLayoutRaw);
} catch(e) {
    console.error("Failed to parse new layout json");
    process.exit(1);
}

let formattedLayout = '[\n';
newLayoutArray.forEach((row, i) => {
    formattedLayout += '            [' + row.join(',') + ']' + (i < newLayoutArray.length - 1 ? ',' : '') + '\n';
});
formattedLayout += '        ]';

const prefix = 'name: "Inferno Gate",\n        background: "background.png",\n        disableEnemyFireballs: false,\n        startX: 80,\n        startY: 300,\n        layout: ';

const startIndex = text.indexOf(prefix);
if (startIndex === -1) {
    console.error("Could not find the start of the layout!");
    process.exit(1);
}

const layoutStartIndex = startIndex + prefix.length;
// We look for the exact string that follows the layout block
const endStr = '\n    },';
let endIndex = text.indexOf(endStr, layoutStartIndex);

if (endIndex !== -1) {
    // We want to replace everything from layoutStartIndex up to the `\n    },`
    // Wait, the `\n    },` is at endIndex.
    // However, before the `\n    },`, there is `\n        ]`.
    // Let's just find `]\n    },` to be safe.
    
    let closingBracketIndex = text.indexOf(']\n    },', layoutStartIndex);
    if (closingBracketIndex !== -1) {
        const actualEndIndex = closingBracketIndex + 1; // points to `\n    },`
        const before = text.substring(0, layoutStartIndex);
        const after = text.substring(actualEndIndex);
        fs.writeFileSync('levels.js', before + formattedLayout + after, 'utf8');
        console.log('Layout updated successfully!');
    } else {
        console.error("Could not find closing bracket");
    }
} else {
    console.error("Could not find the end of the layout array!");
}
