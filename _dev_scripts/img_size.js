const fs = require('fs');

function readPNGDimensions(filepath) {
    const data = fs.readFileSync(filepath);
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    // The IHDR chunk is always at offset 12 in a PNG file
    // Width is 4 bytes at offset 16
    // Height is 4 bytes at offset 20
    const width = view.getUint32(16, false);
    const height = view.getUint32(20, false);
    console.log(filepath, width, 'x', height);
}

readPNGDimensions('fire_gate1.png');
readPNGDimensions('fire_gate2.png');
