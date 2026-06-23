/**
 * HEXLY'S INFERNO ESCAPE - 16-Bit SNES Super Size & Fireball Overhaul
 * A complete retro platformer engine built in HTML5 Canvas and Web Audio API.
 * Features 45px tiles (12 rows), skeletal enemies, Fire power-up, and 2-layer parallax.
 */

// ----------------------------------------------------
// 1. RETRO 16-BIT NINTENDO COLOR PALETTE & RENDERER
// ----------------------------------------------------
const hexlyImg = new Image();
hexlyImg.src = 'hexly sprite/hexly.png?v=3';
let hexlyImgLoaded = false;
hexlyImg.onload = () => { hexlyImgLoaded = true; };

const playerImgIdle1 = new Image();
let playerImgIdle1Loaded = false;
playerImgIdle1.onload = () => { playerImgIdle1Loaded = true; };
playerImgIdle1.src = 'hexly sprite/idle1.png';

const playerImgIdle2 = new Image();
let playerImgIdle2Loaded = false;
playerImgIdle2.onload = () => { playerImgIdle2Loaded = true; };
playerImgIdle2.src = 'hexly sprite/idle2.png';

const playerImgIdle3 = new Image();
let playerImgIdle3Loaded = false;
playerImgIdle3.onload = () => { playerImgIdle3Loaded = true; };
playerImgIdle3.src = 'hexly sprite/idle3.png?v=2';

const hexlyWalk2Img = new Image();
let hexlyWalk2ImgLoaded = false;
hexlyWalk2Img.onload = () => { hexlyWalk2ImgLoaded = true; };
hexlyWalk2Img.src = 'hexly sprite/hexly_walk2.png?v=3';

const hexlyJumpImg = new Image();
let hexlyJumpImgLoaded = false;
hexlyJumpImg.onload = () => { hexlyJumpImgLoaded = true; };
hexlyJumpImg.src = 'hexly sprite/hexly_jump.png?v=3';

const hexlyCrouchImg = new Image();
let hexlyCrouchImgLoaded = false;
hexlyCrouchImg.onload = () => { hexlyCrouchImgLoaded = true; };
hexlyCrouchImg.src = 'hexly sprite/hexly_crouch.png?v=3';

const hexlyProjectileImg = new Image();
let hexlyProjectileImgLoaded = false;
hexlyProjectileImg.onload = () => { hexlyProjectileImgLoaded = true; };
hexlyProjectileImg.src = 'hexly sprite/hexly_projectile.png?v=3';

const skeletonImg = new Image();
let skeletonImgLoaded = false;
skeletonImg.onload = () => { skeletonImgLoaded = true; };
skeletonImg.src = 'sprites/skeleton.png';

const bgImg = new Image();
let bgImgLoaded = false;
bgImg.onload = () => { bgImgLoaded = true; };
bgImg.src = 'backgrounds/background.png';

const spawnGateImg = new Image();
let spawnGateImgLoaded = false;
spawnGateImg.onload = () => { spawnGateImgLoaded = true; };
spawnGateImg.src = 'landscape elements/spawn_gate.png?v=2';

const spawnGate2Img = new Image();
let spawnGate2ImgLoaded = false;
spawnGate2Img.onload = () => { spawnGate2ImgLoaded = true; };
spawnGate2Img.src = 'landscape elements/spawn_gate2.png?v=2';

const fireGate1Img = new Image();
fireGate1Img.src = 'landscape elements/fire_gate1.png';

const fireGate2Img = new Image();
fireGate2Img.src = 'landscape elements/fire_gate2.png';

const level1TileImg = new Image();
let level1TileImgLoaded = false;
level1TileImg.onload = () => { level1TileImgLoaded = true; };
level1TileImg.src = 'tiles/level1-tile.png';

const level2TileImg = new Image();
let level2TileImgLoaded = false;
level2TileImg.onload = () => { level2TileImgLoaded = true; };
level2TileImg.src = 'tiles/level2-tile.png';

const level3TileImg = new Image();
let level3TileImgLoaded = false;
level3TileImg.onload = () => { level3TileImgLoaded = true; };
level3TileImg.src = 'tiles/level3-tile.png?v=2';

const level1BreakableTileImg = new Image();
let level1BreakableTileImgLoaded = false;
level1BreakableTileImg.onload = () => { level1BreakableTileImgLoaded = true; };
level1BreakableTileImg.src = 'tiles/level1-breakble_tile.png';

const powerupTileImg = new Image();
let powerupTileImgLoaded = false;
powerupTileImg.onload = () => { powerupTileImgLoaded = true; };
powerupTileImg.src = 'tiles/powerup_tile.png';

const powerupTileBrokenImg = new Image();
let powerupTileBrokenImgLoaded = false;
powerupTileBrokenImg.onload = () => { powerupTileBrokenImgLoaded = true; };
powerupTileBrokenImg.src = 'tiles/powerup_tile_broken.png';

const powerupShardTileImg = new Image();
let powerupShardTileImgLoaded = false;
powerupShardTileImg.onload = () => { powerupShardTileImgLoaded = true; };
powerupShardTileImg.src = 'tiles/powerup_tile_shard.png';

const powerupBrokenShardTileImg = new Image();
let powerupBrokenShardTileImgLoaded = false;
powerupBrokenShardTileImg.onload = () => { powerupBrokenShardTileImgLoaded = true; };
powerupBrokenShardTileImg.src = 'tiles/powerup_tile_broken_shard.png';

const oneUpTileImg = new Image();
let oneUpTileImgLoaded = false;
oneUpTileImg.onload = () => { oneUpTileImgLoaded = true; };
oneUpTileImg.src = 'tiles/1_up_tile.png';

const chainTileImg = new Image();
let chainTileImgLoaded = false;
chainTileImg.onload = () => { chainTileImgLoaded = true; };
chainTileImg.src = 'landscape elements/chain_tile.png';

const blockTileImg = new Image();
let blockTileImgLoaded = false;
blockTileImg.onload = () => { blockTileImgLoaded = true; };
blockTileImg.src = 'tiles/level1-breakble_tile.png';

const flameImg = new Image();
let flameImgLoaded = false;
flameImg.onload = () => { flameImgLoaded = true; };
flameImg.src = 'power_ups/flame.png';

const portalImg = new Image();
let portalImgLoaded = false;
portalImg.onload = () => { portalImgLoaded = true; };
portalImg.src = 'landscape elements/portal.png';

let bossImg1 = new Image();
let bossImg1Loaded = false;
bossImg1.onload = () => { bossImg1Loaded = true; };
bossImg1.src = 'sprites/boss_frame1.png?v=2';

let bossImg2 = new Image();
let bossImg2Loaded = false;
bossImg2.onload = () => { bossImg2Loaded = true; };
bossImg2.src = 'sprites/boss_frame2.png?v=2';

const fireballImg = new Image();
let fireballImgLoaded = false;
fireballImg.onload = () => { fireballImgLoaded = true; };
fireballImg.src = 'fireballs/fireball.png';

const enemyFireballImg = new Image();
let enemyFireballImgLoaded = false;
enemyFireballImg.onload = () => { enemyFireballImgLoaded = true; };
enemyFireballImg.src = 'fireballs/enemy_fireball.png';

const powerupImg = new Image();
let powerupImgLoaded = false;
powerupImg.onload = () => { powerupImgLoaded = true; };
powerupImg.src = 'power_ups/powerup.png';

const flyingSkeletonImg = new Image();
let flyingSkeletonImgLoaded = false;
flyingSkeletonImg.onload = () => { flyingSkeletonImgLoaded = true; };
flyingSkeletonImg.src = 'sprites/flying_skeleton.png';

const flyingSkeleton2Img = new Image();
let flyingSkeleton2ImgLoaded = false;
flyingSkeleton2Img.onload = () => { flyingSkeleton2ImgLoaded = true; };
flyingSkeleton2Img.src = 'sprites/flying_skeleton2.png';

const skeletonWalk1Img = new Image();
let skeletonWalk1ImgLoaded = false;
skeletonWalk1Img.onload = () => { skeletonWalk1ImgLoaded = true; };
skeletonWalk1Img.src = 'sprites/skeleton_walk1.png';

const skeletonWalk2Img = new Image();
let skeletonWalk2ImgLoaded = false;
skeletonWalk2Img.onload = () => { skeletonWalk2ImgLoaded = true; };
skeletonWalk2Img.src = 'sprites/skeleton_walk2.png';

const bogZombie1Img = new Image();
let bogZombie1ImgLoaded = false;
bogZombie1Img.onload = () => { bogZombie1ImgLoaded = true; };
bogZombie1Img.src = 'sprites/bog_zombie1.png';

const bogZombie2Img = new Image();
let bogZombie2ImgLoaded = false;
bogZombie2Img.onload = () => { bogZombie2ImgLoaded = true; };
bogZombie2Img.src = 'sprites/bog_zombie2.png';

const soulShardImg = new Image();
let soulShardImgLoaded = false;
soulShardImg.onload = () => { soulShardImgLoaded = true; };
soulShardImg.src = 'power_ups/soul_shard.png';

const crusherImg = new Image();
let crusherImgLoaded = false;
crusherImg.onload = () => { crusherImgLoaded = true; };
crusherImg.src = 'landscape elements/crusher.png';

const PALETTE = {
    '.': 'transparent',
    'b': '#000000',       /* Pitch Black */
    'w': '#ffffff',       /* Bright Retro White */
    'r': '#e61e29',       /* Molten Red */
    'd': '#990012',       /* Dark Shadow Red */
    'l': '#ff5a67',       /* Highlight Pink-Red */
    'y': '#f7be00',       /* Glowing Yellow */
    'o': '#f95700',       /* Hot Ember Orange */
    'p': '#c4001a',       /* Volcanic Demonic Red (Swapped from Purple) */
    'm': '#ff6a00',       /* Hot Magma Orange (Swapped from Purple) */
    'v': '#cc00ff',       /* Violet Glow */
    'V': '#e066ff',       /* Bright Violet Highlight */
    'g': '#eae4cb',       /* Bone Gray/White */
    's': '#544e47',       /* Warm Basalt Gray (Swapped from Purplish Gray) */
    'c': '#3a3530',        /* Dark Shadow Basalt Gray (Swapped from Purplish Gray) */
    'e': '#4a2c11',        /* Deep charred brown earth */
    'f': '#78441b',        /* Scorched medium brown earth */
    'q': '#a06637',        /* Light toasted clay/brown earth surface */
    'h': '#241407',        /* Deepest charred blackish-brown cracks */
    'v': '#727a1b',       /* Dark mustard olive veins */
    'u': '#4b5211',       /* Deep murky brown-green sludge */
    't': '#232607',       /* Almost black brown-green sludge */
    'z': '#c2c930',       /* Sickly jaundiced yellow-green highlight */
    'k': '#9ba126'        /* Mustard green mid-tone */
};

/**
 * Draws a pixel matrix block onto the canvas.
 * Supports: Chunky pixel scale, horizontal flips, and palette transformations (Fire Hexly).
 */
function drawPixelMatrix(ctx, x, y, matrix, flipX, pixelSize, colorOverrides = null) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    ctx.save();
    ctx.translate(Math.floor(x), Math.floor(y));
    
    if (flipX) {
        ctx.scale(-1, 1);
        ctx.translate(-cols * pixelSize, 0);
    }

    for (let r = 0; r < rows; r++) {
        const rowString = matrix[r];
        for (let c = 0; c < cols; c++) {
            const char = rowString[c];
            if (char !== '.') {
                // Apply Fire power-up color mappings if provided
                let color = PALETTE[char];
                if (colorOverrides && colorOverrides[char]) {
                    color = colorOverrides[char];
                }
                
                if (color && color !== 'transparent') {
                    ctx.fillStyle = color;
                    ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
    ctx.restore();
}

/**
 * Scans an image offscreen to find the exact bounding box of non-transparent pixels,
 * ignoring empty transparent borders at the source.
 */
function getSpriteTrimBounds(image) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return null;
        
        ctx.drawImage(image, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        
        const isHexly = image.src && (image.src.toLowerCase().includes('hexly') || image.src.toLowerCase().includes('idle'));
        
        const getAlpha = (x, y) => {
            if (x < 0 || x >= w || y < 0 || y >= h) return 0;
            return data[(y * w + x) * 4 + 3];
        };

        const newAlphas = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) newAlphas[i] = data[i * 4 + 3];

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                
                if (isHexly && a > 20) {
                    let isHalo = false;
                    let isEdge = false;
                    for (let ny = -2; ny <= 2; ny++) {
                        for (let nx = -2; nx <= 2; nx++) {
                            if (getAlpha(x + nx, y + ny) < 20) {
                                isEdge = true; break;
                            }
                        }
                        if (isEdge) break;
                    }
                    
                    if (isEdge) {
                        // Halo pixel removal (greyish or white anti-aliased edge)
                        // Be aggressive: Hexly's outline should be very dark.
                        if (r > 100 && g > 100 && b > 100) {
                            isHalo = true;
                        }
                    }
                    if (isHalo) {
                        newAlphas[y * w + x] = 0;
                    }
                } else if (!isHexly) {
                    // For non-hexly sprites (skeletons), just treat absolute pure white as transparency
                    if (r > 250 && g > 250 && b > 250) {
                        newAlphas[y * w + x] = 0;
                    }
                }
            }
        }
        
        let minX = w, maxX = 0, minY = h, maxY = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                data[(y * w + x) * 4 + 3] = newAlphas[y * w + x];
                if (newAlphas[y * w + x] > 5) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        image.processedCanvas = canvas;
        
        if (maxX < minX || maxY < minY) {
            return { x: 0, y: 0, w: w, h: h };
        }
        return { x: minX, y: minY, w: (maxX - minX) + 1, h: (maxY - minY) + 1 };
    } catch (e) {
        console.warn("Canvas pixel scan failed (using fallback bounds):", e);
        return { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    }
}

function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    
    if (!image.trimBounds) {
        image.trimBounds = getSpriteTrimBounds(image);
    }
    
    const b = image.trimBounds || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    
    if (b.w <= 0 || b.h <= 0 || isNaN(b.w) || isNaN(b.h)) return;
    if (dw <= 0 || dh <= 0 || isNaN(dw) || isNaN(dh) || isNaN(dx) || isNaN(dy)) return;
    
    ctx.save();
    ctx.translate(Math.round(dx + dw / 2), Math.round(dy + dh / 2));
    if (flipX) ctx.scale(-1, 1);
    
    const sourceImage = image.processedCanvas || image;
    ctx.drawImage(sourceImage, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

// ----------------------------------------------------
