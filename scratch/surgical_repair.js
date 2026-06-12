const fs = require('fs');
let code = fs.readFileSync('game.js', 'utf8');

// 1. Fix the double } at the end of drawSpriteAutoTrimmed
const badEnd = `    ctx.drawImage(image, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}
}`;

const goodEnd = `    ctx.drawImage(image, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}`;
code = code.replace(badEnd, goodEnd);

// 2. Fix the missing } at the end of drawPixelMatrix
const badMatrix = `    ctx.restore();

/**
 * Scans an image offscreen to find the exact bounding box of non-transparent pixels,`;

const goodMatrix = `    ctx.restore();
}

/**
 * Scans an image offscreen to find the exact bounding box of non-transparent pixels,`;

code = code.replace(badMatrix, goodMatrix);

fs.writeFileSync('game.js', code);
console.log('Surgical repair done.');
