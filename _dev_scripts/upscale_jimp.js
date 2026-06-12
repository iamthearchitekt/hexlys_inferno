const { Jimp, ResizeStrategy } = require('jimp');

async function upscale(file) {
    try {
        const image = await Jimp.read(file);
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        // Upscale 2x
        image.resize({ w: w * 2, h: h * 2, mode: ResizeStrategy.BICUBIC });
        await image.write(file);
        console.log(`Upscaled ${file} from ${w}x${h} to ${w*2}x${h*2}`);
    } catch (e) {
        console.error(`Failed to upscale ${file}:`, e);
    }
}

async function run() {
    await upscale('spawn_gate.png');
    await upscale('spawn_gate2.png');
}

run();
