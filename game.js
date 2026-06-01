/**
 * HEXLY'S INFERNO ESCAPE - 16-Bit SNES Super Size & Fireball Overhaul
 * A complete retro platformer engine built in HTML5 Canvas and Web Audio API.
 * Features 45px tiles (12 rows), skeletal enemies, Fire power-up, and 2-layer parallax.
 */

// ----------------------------------------------------
// 1. RETRO 16-BIT NINTENDO COLOR PALETTE & RENDERER
// ----------------------------------------------------
const hexlyImg = new Image();
let hexlyImgLoaded = false;
hexlyImg.onload = () => {
    hexlyImgLoaded = true;
};
hexlyImg.src = 'hexly.png';

const hexlyWalk2Img = new Image();
let hexlyWalk2ImgLoaded = false;
hexlyWalk2Img.onload = () => {
    hexlyWalk2ImgLoaded = true;
};
hexlyWalk2Img.src = 'hexly_walk2.png';

const hexlyJumpImg = new Image();
let hexlyJumpImgLoaded = false;
hexlyJumpImg.onload = () => {
    hexlyJumpImgLoaded = true;
};
hexlyJumpImg.src = 'hexly_jump.png';

const hexlyCrouchImg = new Image();
let hexlyCrouchImgLoaded = false;
hexlyCrouchImg.onload = () => {
    hexlyCrouchImgLoaded = true;
};
hexlyCrouchImg.src = 'hexly_crouch.png';

const skeletonImg = new Image();
let skeletonImgLoaded = false;
skeletonImg.onload = () => {
    skeletonImgLoaded = true;
};
skeletonImg.src = 'skeleton.png';

const bgImg = new Image();
let bgImgLoaded = false;
bgImg.onload = () => {
    bgImgLoaded = true;
};
bgImg.src = 'background.png';

const flameImg = new Image();
let flameImgLoaded = false;
flameImg.onload = () => { flameImgLoaded = true; };
flameImg.src = 'flame.png';

const portalImg = new Image();
let portalImgLoaded = false;
portalImg.onload = () => { portalImgLoaded = true; };
portalImg.src = 'portal.png';

let bossImg1 = new Image();
let bossImg1Loaded = false;
bossImg1.onload = () => { bossImg1Loaded = true; };
bossImg1.src = 'boss_frame1.png';

let bossImg2 = new Image();
let bossImg2Loaded = false;
bossImg2.onload = () => { bossImg2Loaded = true; };
bossImg2.src = 'boss_frame2.png';

const fireballImg = new Image();
let fireballImgLoaded = false;
fireballImg.onload = () => { fireballImgLoaded = true; };
fireballImg.src = 'fireball.png';

const enemyFireballImg = new Image();
let enemyFireballImgLoaded = false;
enemyFireballImg.onload = () => { enemyFireballImgLoaded = true; };
enemyFireballImg.src = 'enemy_fireball.png';

const powerupImg = new Image();
let powerupImgLoaded = false;
powerupImg.onload = () => { powerupImgLoaded = true; };
powerupImg.src = 'powerup.png';

const flyingSkeletonImg = new Image();
let flyingSkeletonImgLoaded = false;
flyingSkeletonImg.onload = () => { flyingSkeletonImgLoaded = true; };
flyingSkeletonImg.src = 'flying_skeleton.png';

const flyingSkeleton2Img = new Image();
let flyingSkeleton2ImgLoaded = false;
flyingSkeleton2Img.onload = () => { flyingSkeleton2ImgLoaded = true; };
flyingSkeleton2Img.src = 'flying_skeleton2.png';

const skeletonWalk1Img = new Image();
let skeletonWalk1ImgLoaded = false;
skeletonWalk1Img.onload = () => { skeletonWalk1ImgLoaded = true; };
skeletonWalk1Img.src = 'skeleton_walk1.png';

const skeletonWalk2Img = new Image();
let skeletonWalk2ImgLoaded = false;
skeletonWalk2Img.onload = () => { skeletonWalk2ImgLoaded = true; };
skeletonWalk2Img.src = 'skeleton_walk2.png';

const soulShardImg = new Image();
let soulShardImgLoaded = false;
soulShardImg.onload = () => { soulShardImgLoaded = true; };
soulShardImg.src = 'soul_shard.png';

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
    'g': '#eae4cb',       /* Bone Gray/White */
    's': '#544e47',       /* Warm Basalt Gray (Swapped from Purplish Gray) */
    'c': '#3a3530',        /* Dark Shadow Basalt Gray (Swapped from Purplish Gray) */
    'e': '#4a2c11',        /* Deep charred brown earth */
    'f': '#78441b',        /* Scorched medium brown earth */
    'q': '#a06637',        /* Light toasted clay/brown earth surface */
    'h': '#241407'         /* Deepest charred blackish-brown cracks */
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
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return null;
    
    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        ctx.drawImage(image, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        
        let minX = w, maxX = 0, minY = h, maxY = 0;
        
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const alpha = data[(y * w + x) * 4 + 3];
                if (alpha > 5) { // ignore light compression artifact noise
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        if (maxX < minX || maxY < minY) {
            return { x: 0, y: 0, w: w, h: h };
        }
        
        return {
            x: minX,
            y: minY,
            w: (maxX - minX) + 1,
            h: (maxY - minY) + 1
        };
    } catch (e) {
        console.warn("Canvas pixel scan failed (using fallback bounds):", e);
        return { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    }
}

/**
 * Draws a sprite dynamically cropped to its visual pixel bounds, guaranteeing perfect
 * sizing, alignment, and scale between different animation frames.
 */
function drawSpriteAutoTrimmed(ctx, image, dx, dy, dw, dh, flipX = false) {
    if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
    
    if (!image.trimBounds) {
        image.trimBounds = getSpriteTrimBounds(image);
    }
    
    const b = image.trimBounds || { x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight };
    
    // Validate bounds to prevent IndexSizeError (drawing 0-width or 0-height images is forbidden in Canvas)
    if (b.w <= 0 || b.h <= 0 || isNaN(b.w) || isNaN(b.h)) return;
    if (dw <= 0 || dh <= 0 || isNaN(dw) || isNaN(dh) || isNaN(dx) || isNaN(dy)) return;
    
    ctx.save();
    ctx.translate(Math.round(dx + dw / 2), Math.round(dy + dh / 2));
    if (flipX) {
        ctx.scale(-1, 1);
    }
    
    // Draw only the cropped character sub-rectangle scaled perfectly to fit the drawing box (dw, dh)!
    ctx.drawImage(image, b.x, b.y, b.w, b.h, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
}

// ----------------------------------------------------
// 2. 16-BIT RETRO GRAPHICS MATRIX SPRITE SHEETS
// ----------------------------------------------------
const SPRITES = {
    // HEXLY: Custom Red Demon Sprite (Size 26 cols x 30 rows. Scale 1.5 = 39x45px!)
    HEXLY: {
        IDLE: [
            "......bb..........bb......",
            ".....bllb........brrb.....",
            ".....bllb........brrb.....",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrwwwwwwwwwb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            ".....bllrb.bbbb.bbrrrd....",
            "....bllrb..bbbb..bdrrrd...",
            "....bllb....bb....bddrd...",
            "...bllb.....bb.....bddrd..",
            "..bbbb......bb......bbbb.."
        ],
        RUN_A: [
            "......bb..........bb......",
            ".....bllb........brrb.....",
            ".....bllb........brrb.....",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrwwwwwwwwwb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            ".....bllrb.bbbb...bbrrd...",
            "....bbllrb.bbbb....bdrrd..",
            "....bbllb...bb......bddr..",
            "....bbbb....bb.......bbb..",
            ".....bbb....bb........bb.."
        ],
        RUN_B: [
            "......bb..........bb......",
            ".....bllb........brrb.....",
            ".....bllb........brrb.....",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrwwwwwwwwwb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            "......bllrb.bbbb.bbrrrd...",
            ".....bllrb..bbbb..bdrrrd..",
            ".....bllb...bb....bddrd...",
            "....bllb....bb.....bddrd..",
            "....bbbb....bb......bbbb.."
        ],
        JUMP: [
            "p.....bb..........bb.....p",
            "pp...bllb........brrb...pp",
            "p....bllb........brrb....p",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrwwwwwwwwwb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            ".....bllrb.bbbb.bbrrrd....",
            "....bllrb..bbbb..bdrrrd...",
            "....bbbb....bb....bbbb....",
            "..........................",
            ".........................."
        ],
        HURT: [
            "......bb..........bb......",
            ".....bllb........brrb.....",
            ".....bllb........brrb.....",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbxbxxbbllrrrrwxbxbbrrrd",
            "bllbxbxxbbllrrrrwxbxbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrbbbbbbbbbb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            ".....bllrb.bbbb.bbrrrd....",
            "....bllrb..bbbb..bdrrrd...",
            "....bllb....bb....bddrd...",
            "...bllb.....bb.....bddrd..",
            "..bbbb......bb......bbbb.."
        ],
        WIN: [
            "......bb..........bb......",
            ".....bllb........brrb.....",
            ".....bllb........brrb.....",
            "....blllb........brrrb....",
            "....bllb..........brrb....",
            "...bllb...bbbbbb...brrb...",
            "...bllbbbbllrrbbbbbrrrb...",
            "..blllrllllrrrrrrrrrrrdd..",
            "..bllllllllllrrrrrrrrrrd..",
            ".bllllllllllrrrrrrrrrrrrd.",
            "blllllllllllrrrrrrrrrrrrrd",
            "blllbbbbllllrrrrrbbbbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwbbwbbllrrrrwbbwbbrrrd",
            "bllbwwwwbbllrrrrwwwwbbrrrd",
            "bllbbbbbllllrrrrrbbbbbrrrd",
            "blllllllllllrrrrrrrrrrrrrd",
            ".bllllllllllrrrrrrrrrrrrd.",
            "..blllrrrrrrbbbbbbbbbbrd..",
            "...blllrrrrwbbwbbwbbwrd...",
            "....bbllrrrwwwwwwwwwb.....",
            "......bbbbbbbbbbbbbb......",
            "........bllrrrrrrd........",
            ".......bllrrrrrrrrd.......",
            "......bllrrrrrrrrrrd......",
            "....bbllrb.bbbb.bbrrrd....",
            "...blllrbb..bbbb..bdrrrdb.",
            "...bllb.....bb.....bddrd..",
            "..bbbb......bb......bbbb..",
            ".........................."
        ]
    },

    // TILES: Size 10 cols x 10 rows. Scale 4.5 = 45x45px (Perfect 45px grids!)
    TILES: {
        GROUND: [
            "bbbbbbbbbb",
            "bqqfffqqeb",
            "bqfhhhfheb",
            "bqfheehfeb",
            "bqfhhhfheb",
            "bqfeeeffeb",
            "bqfhhhhheb",
            "bqfeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],
        PLATFORM: [
            "bbbbbbbbbb",
            "bssssssssb",
            "bs......sb",
            "bccccccccb",
            "bbbbbbbbbb",
            "..........",
            "..........",
            "..........",
            "..........",
            ".........."
        ],
        BREAKABLE: [
            "bbbbbbbbbb",
            "bqqqqqqqqb",
            "bqfqffqffb",
            "bqffqffqfb",
            "bfqffqffbb",
            "bqffqffqfb",
            "bqfqffqffb",
            "bqqqqqqqqb",
            "beeeeeeeeb",
            "bbbbbbbbbb"
        ],
        // REWARD: Brown earth base (same as GROUND) — gets an orange pulse overlay when drawn
        REWARD: [
            "bbbbbbbbbb",
            "bqqfffqqfb",
            "bqfhhhfheb",
            "bqfheehfeb",
            "bqfhhhfheb",
            "bqfeeeffeb",
            "bqfhhhhheb",
            "bqfeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],
        // SPENT: Same brown base but darker — no glow, solid full-size
        SPENT: [
            "bbbbbbbbbb",
            "beeffffebb",
            "behheeeheb",
            "behheeeheb",
            "behhheeehb",
            "beeeffeeeb",
            "behhhhhheb",
            "beeeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],
        // LAVA_A/B/C: 3-frame downward waterfall animation.
        // Each frame shifts the molten texture DOWN 3 rows, creating a slow falling-lava illusion.
        // Pattern: bright surface glow at top fading to deep dark red at bottom.
        LAVA_A: [
            "oyoyoyoyoy",  // Row 0: incandescent hot surface sparks
            "yoroyoroyo",  // Row 1: bright swirling glow
            "rooroororr",  // Row 2: orange-red flow
            "orrdorrdrr",  // Row 3: flowing red with darker veins
            "rrddrrddrr",  // Row 4: mid-depth red
            "rdddrdddrd",  // Row 5: deeper, darker
            "ddrdddrddd",  // Row 6: deep dark red flows
            "dddddddddd",  // Row 7: dark red depth
            "dddddddddd",  // Row 8: dark red depth
            "dddrdddrddd".substring(0,10)  // Row 9: dark red depth
        ],
        LAVA_B: [
            "rdddrdddrd",  // Row 0 shifted: deeper layer now at top (lava fell down)
            "ddrdddrddd",  // Row 1
            "dddddddddd",  // Row 2
            "dddddddddd",  // Row 3
            "oyoyoyoyoy",  // Row 4: glow wraps around (new lava surface)
            "yoroyoroyo",  // Row 5
            "rooroororr",  // Row 6
            "orrdorrdrr",  // Row 7
            "rrddrrddrr",  // Row 8
            "rdddrdddrd"   // Row 9
        ],
        LAVA_C: [
            "dddddddddd",  // Row 0 shifted further
            "oyoyoyoyoy",  // Row 1: glow band
            "yoroyoroyo",  // Row 2
            "rooroororr",  // Row 3
            "orrdorrdrr",  // Row 4
            "rrddrrddrr",  // Row 5
            "rdddrdddrd",  // Row 6
            "ddrdddrddd",  // Row 7
            "dddddddddd",  // Row 8
            "dddddddddd"   // Row 9
        ],
        PORTAL: [
            "bbbbbbbbbb",
            "bppppppppb",
            "bpwpmwpmpb",
            "bpmwpmwpbb",
            "bpwpmwpmbb",
            "bpmwpmwpbb",
            "bpwpmwpmpb",
            "bppppppppb",
            "bddddddddb",
            "bbbbbbbbbb"
        ]
    },

    // SOUL COIN: Spinning (Size 10 cols x 10 rows. Scale 3.0 = 30x30px)
    COIN: [
        "..bbbbbb..",
        ".byyyyyyb.",
        "byyyooyyyb",
        "byyooodyyb",
        "byyododyyb",
        "byyooodyyb",
        "byyyooyyyb",
        ".byyyyyyb.",
        "..bbbbbb..",
        ".........."
    ],

    // LAVA FLOWER POWERUP: Size 10 cols x 10 rows. Scale 3.0 = 30x30px
    FLOWER: [
        "....bb....",
        "...byyb...",
        "..bywwyb..",
        "..boywyob.",
        ".boowwoob.",
        ".brroorrb.",
        "brdddddrb.",
        "bdddddddb.",
        "bbbbbbbbb.",
        ".........."
    ],

    // FIREBALL Entity: Size 6 cols x 6 rows. Scale 2.0 = 12x12px
    FIREBALL: [
        "..bb..",
        ".byyob.",
        "bywwob",
        "bywwob",
        ".brrb.",
        "..b..."
    ],

    // SKELETONS ENEMIES (Sizes 12 cols x 10 rows. Scale 3.0 = 36x30px)
    SKELETONS: {
        SKELLY_SCUTTLER: [
            "...bbbbbb...",
            "..bggggggb..",
            ".bgbgbbgbgb.",
            "bggggggggggb",
            "bggbbwbbwggb",
            "bggggggggggb",
            ".bggggggggb.",
            "..bbbbbbbb..",
            ".g..g..g..g.",
            "bb..bb..bb..b"
        ],
        WINGED_SKULL: [
            "p..bbbbbb..p",
            "p.bggggggb.p",
            "pbgbgbbgbgbp",
            "bggggggggggb",
            "bggbbwbbwggb",
            "bggggggggggb",
            ".bggggggggb.",
            "..booooob..",
            "...o...o....",
            "....ooo....."
        ],
        SPINE_CRAWLER: [
            "............",
            "....bbbb....",
            "...bggggbb..",
            "..bgggggggb.",
            ".bggbbbbggbb",
            "bggbbbbbbggb",
            "bggbbbbbbggb",
            ".bggbbbbggb.",
            "..bbbbbbbb..",
            "............"
        ]
    }
};

// ----------------------------------------------------
// 3. SYNTHESIZED 8-BIT AUDIO ENGINE
// ----------------------------------------------------
class AudioSynth {
    constructor() {
        this.ctx = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.musicIntervalId = null;
        this.step = 0;

        // Spooky underworld chiptune melody
        this.bassSequence = ['E2', 'E2', 'E2', 'E2', 'G2', 'G2', 'G2', 'G2', 'A2', 'A2', 'A2', 'A2', 'B2', 'B2', 'A2', 'G2'];
        this.melodySequence = [
            'E4', null, 'G4', null, 'A4', 'B4', null, 'A4',
            'G4', null, 'E4', null, 'B4', null, null, null,
            'B4', null, 'D5', null, 'E5', 'D5', null, 'B4',
            'A4', null, 'G4', 'A4', 'B4', null, null, null
        ];

        this.frequencies = {
            'E2': 82.41, 'G2': 97.99, 'A2': 110.00, 'B2': 123.47,
            'E4': 329.63, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'D5': 587.33, 'E5': 659.25
        };
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.startMusicLoop();
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    startMusicLoop() {
        if (this.musicIntervalId) clearInterval(this.musicIntervalId);
        this.musicIntervalId = setInterval(() => {
            if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
            this.playSequencerStep();
        }, 180);
    }

    playSequencerStep() {
        const time = this.ctx.currentTime;
        const bassNote = this.bassSequence[this.step % this.bassSequence.length];
        if (bassNote && this.frequencies[bassNote]) {
            this.playTone(this.frequencies[bassNote], 'sawtooth', 0.05, 0.16, time);
        }

        const melodyNote = this.melodySequence[this.step % this.melodySequence.length];
        if (melodyNote && this.frequencies[melodyNote]) {
            this.playTone(this.frequencies[melodyNote], 'triangle', 0.04, 0.25, time);
        }

        if (this.step % 4 === 2) {
            this.playNoiseTick(0.015, time);
        }
        this.step++;
    }

    playTone(freq, type, volume, duration, startTime) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playNoiseTick(volume, startTime) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.04;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.03);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(startTime);
        noise.stop(startTime + 0.04);
    }

    playJump() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCollect() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        
        // A magical shimmering arpeggio
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        // Fast ascending magical chime (A major chord sweeping up)
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.1); // A6
        osc1.frequency.exponentialRampToValueAtTime(3520, now + 0.3); // A7
        
        osc2.frequency.setValueAtTime(1108, now); // C#6 (major third)
        osc2.frequency.exponentialRampToValueAtTime(2217, now + 0.1); 
        osc2.frequency.exponentialRampToValueAtTime(4434, now + 0.3);
        
        // Smooth ringing decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    }

    playStomp() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCrunch() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        
        // Create a short 8-bit style noise buffer
        const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Quantized harsh noise for that retro crunch
            data[i] = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.8 + 0.2);
        }
        
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        // Lowpass filter drops sharply to simulate crumbling mass
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noiseSource.start(now);
    }

    playDamage() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playVictory() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.08, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
        });
    }

    playFireball() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        // Snappy short high sweep down
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.10);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.10);
    }
}
const synth = new AudioSynth();


// ----------------------------------------------------
// 4. INPUT CONTROLLERS & KEYBOARD ACTIONS (Shooting Added)
// ----------------------------------------------------
class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this.down = false;
        this.jump = false;
        this.jumpPressed = false;
        this.shootPressed = false;
        this.shootHeld = false;
        this.pausePressed = false;
        this.restartPressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = true;
        if (code === 'ArrowRight' || code === 'KeyD') this.right = true;
        if (code === 'ArrowDown' || code === 'KeyS') this.down = true;
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
            if (!this.jump) this.jumpPressed = true;
            this.jump = true;
        }
        if (code === 'KeyP') this.pausePressed = true;
        if (code === 'KeyR') this.restartPressed = true;
        
        // Z, J, or Left Shift for Shooting Fireballs and Sprinting
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft') {
            if (!this.shootHeld) this.shootPressed = true;
            this.shootHeld = true;
        }

        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = false;
        if (code === 'ArrowRight' || code === 'KeyD') this.right = false;
        if (code === 'ArrowDown' || code === 'KeyS') this.down = false;
        if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') this.jump = false;
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft') this.shootHeld = false;
    }

    clearFrameTriggers() {
        this.jumpPressed = false;
        this.shootPressed = false;
        this.pausePressed = false;
        this.restartPressed = false;
    }
}


// ----------------------------------------------------
// 5. TILE ENGINE & MAP LAYOUT (12 Rows, Negative Space Fixed)
// ----------------------------------------------------
const TILE_SIZE = 45; // 45px Tiles (12 Rows fits exactly 540px Height)
const TILES = {
    EMPTY: 0,
    GROUND: 1,
    PLATFORM: 2,
    BREAKABLE: 3,
    REWARD: 4,
    LAVA: 5,
    PORTAL: 6,
    SPENT_REWARD: 11,
    BOSS: 13,
    FALLING_PLATFORM: 14
};

// 12-Row Map Data (7 = Coin, 8 = Skelly Bug, 9 = Winged Skull, 10 = Spine Crawler, 12 = Lava Flower Powerup)
const LEVEL_DATA = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,7,0,0,0,0,0,0,7,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,3,4,3,0,0,0,0,0,0,2,2,2,0,0,0,9,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,3,0,0,0,0,0,3,4,3,0,0,0,0,0,0,0,0,0,0,0,14,0,0,14,0,0,14,0,0,0,0,0,14,0,0,14,0,0,14,0,0,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,14,0,0,14,0,0,0,0,0,0,0,0,14,0,0,14,0,0,14,0,0,14,0,0,0,0,0,14,0,0,14,0,0,14,0,0,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,8,0,0,7,0,0,0,0,10,0,0,0,0,8,0,9,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,10,0,0,7,0,0,0,8,0,0,9,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,8,0,0,0,0,0,0,9,0,0,0,0,0,10,8,1,1,1,1,1,1,1,1,1,0,0,0,0,8,0,0,0,0,0,0,10,0,0,0,0,8,0,0,0,0,0,0,8,0,9,14,10,0,14,0,0,14,0,0,0,0,0,14,0,0,14,0,0,0,0,9,14,0,9,0,0,0,14,0,0,14,0,0,14,9,0,14,9,0,14,0,9,0,0,9,14,0,10,0,0,0,0,10,0,0,8,0,0,10,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,1,1,1,1,0,2,2,2,2,2,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,5,5,5,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// ----------------------------------------------------
// 6. RETRO DYNAMIC PARTICLES ENGINE
// ----------------------------------------------------
class Particle {
    constructor(x, y, vx, vy, color, size, life, type = 'ember') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.type = type;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.type === 'ember') {
            this.vy -= 0.02;
            this.vx += (Math.random() - 0.5) * 0.1;
        } else if (this.type === 'debris') {
            this.vy += 0.25;
        } else if (this.type === 'dust') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        }
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(this.x - cameraX - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(p) {
        if (this.particles.length > 200) this.particles.shift();
        this.particles.push(p);
    }

    spawnEmber(x, y) {
        const colors = ['#f95700', '#f7be00', '#e61e29'];
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.8, -Math.random() * 0.7 - 0.3, colors[Math.floor(Math.random() * colors.length)], Math.random() * 3 + 1, Math.random() * 80 + 40, 'ember'));
    }

    spawnLavaBubble(x, y) {
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.3, -Math.random() * 0.4 - 0.2, '#f95700', Math.random() * 4 + 2, Math.random() * 50 + 20, 'dust'));
    }

    spawnStompExplosion(x, y) {
        const colors = ['#ffffff', '#f7be00', '#e61e29'];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.5 + 1.5;
            this.add(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, colors[Math.floor(Math.random() * colors.length)], Math.random() * 4 + 2, Math.random() * 25 + 15, 'dust'));
        }
    }

    spawnBlockDebris(x, y) {
        const colors = ['#1a110a', '#e61e29', '#f95700'];
        for (let i = 0; i < 8; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 4, -Math.random() * 3 - 2, colors[Math.floor(Math.random() * colors.length)], Math.random() * 6 + 3, Math.random() * 30 + 15, 'debris'));
        }
    }

    spawnJumpDust(x, y) {
        // More prominent jump dust cloud! (24 dynamic particles with brighter colors and larger spreads)
        for (let i = 0; i < 12; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 3.5, -Math.random() * 1.5 - 0.2, 'rgba(255, 180, 100, 0.6)', Math.random() * 9 + 6, Math.random() * 25 + 15, 'dust'));
            this.add(new Particle(x, y, (Math.random() - 0.5) * 2.0, -Math.random() * 0.8 - 0.1, 'rgba(200, 70, 0, 0.5)', Math.random() * 7 + 4, Math.random() * 20 + 10, 'dust'));
        }
    }

    spawnVictoryConfetti(x, y) {
        const colors = ['#ff6a00', '#f7be00', '#ff0055', '#ff5a67', '#ffffff'];
        for (let i = 0; i < 4; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 5, -Math.random() * 5 - 2, colors[Math.floor(Math.random() * colors.length)], Math.random() * 5 + 3, Math.random() * 80 + 40, 'debris'));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life <= 0 || p.y > 560) this.particles.splice(i, 1);
        }
    }

    draw(ctx, cameraX) {
        this.particles.forEach(p => p.draw(ctx, cameraX));
    }
}
const particles = new ParticleSystem();


// ----------------------------------------------------
// 7. FIREBALL & LAVA FLOWER ENTITIES (Power-up Core)
// ----------------------------------------------------
class LavaFlower {
    constructor(x, y) {
        this.x = x + TILE_SIZE / 2 - 15;
        this.y = y;
        this.startY = y;
        this.collected = false;
        this.vy = -1.5; // Pop up slowly
        this.floatingTimer = 0;
    }

    update() {
        // Pop out of block then float in place
        if (this.y > this.startY - 35) {
            this.y += this.vy;
        } else {
            this.floatingTimer += 0.08;
            this.y = (this.startY - 35) + Math.sin(this.floatingTimer) * 3;
        }
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        if (powerupImgLoaded) {
            // Draw with a gentle bob glow effect
            ctx.save();
            ctx.shadowColor = '#ff6a00';
            ctx.shadowBlur = 14;
            ctx.drawImage(powerupImg, drawX - 5, drawY - 5, 40, 40);
            ctx.restore();
        } else if (flameImgLoaded) {
            ctx.drawImage(flameImg, drawX, drawY, 30, 30);
        } else {
            drawPixelMatrix(ctx, drawX, drawY, SPRITES.FLOWER, false, 3.0);
        }
    }
}

class Fireball {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 12;
        this.height = 12;
        this.bounces = 0;
        this.dead = false;
    }

    update(engine) {
        const levelGrid = engine.levelGrid;
        const enemies = engine.enemies;
        const player = engine.player;

        this.vy += 0.45; // Snappy fireball gravity
        
        // Spawn realistic flame particle trail (molten embers and rising volcanic smoke!)
        if (Math.random() < 0.65) {
            const colors = ['#f95700', '#f7be00', '#e61e29', '#544e47']; 
            const trailColor = colors[Math.floor(Math.random() * colors.length)];
            const px = this.x + this.width / 2 + (Math.random() - 0.5) * 4;
            const py = this.y + this.height / 2 + (Math.random() - 0.5) * 4;
            particles.add(new Particle(
                px, py, 
                -this.vx * 0.2 + (Math.random() - 0.5) * 0.5, 
                (Math.random() - 0.5) * 0.5, 
                trailColor, 
                Math.random() * 3 + 1, 
                Math.random() * 15 + 10, 
                'ember'
            ));
        }
        
        // Solve Horizontal (shrink vertical check bounds by 2px to prevent false positive wall hits with the floor when sliding/bouncing!)
        this.x += this.vx;
        let bounds = this.getTileBounds(this.x, this.y + 2, this.width, this.height - 4);
        if (this.isHitSolid(bounds, levelGrid)) {
            this.dead = true;
            // Spawn explosion sparks
            for (let i = 0; i < 6; i++) {
                particles.spawnEmber(this.x + this.width/2, this.y + this.height/2);
            }
            return;
        }

        // Solve Vertical
        this.y += this.vy;
        bounds = this.getTileBounds(this.x, this.y, this.width, this.height);
        
        for (let row = bounds.minY; row <= bounds.maxY; row++) {
            for (let col = bounds.minX; col <= bounds.maxX; col++) {
                const tile = this.getTile(col, row, levelGrid);
                if (tile === TILES.GROUND || tile === TILES.PLATFORM || tile === TILES.BREAKABLE || tile === TILES.REWARD || tile === TILES.SPENT_REWARD) {
                    if (this.vy > 0) {
                        // Falling, bounce up
                        this.y = row * TILE_SIZE - this.height;
                        this.vy = -4.5; // Snappy bouncy!
                        this.bounces++;
                        if (this.bounces > 4) {
                            this.dead = true;
                        }
                    } else if (this.vy < 0) {
                        this.dead = true;
                    }
                }
            }
        }

        // Check enemy collisions
        enemies.forEach(enemy => {
            if (enemy.dead || this.dead) return;
            const hitX = this.x < enemy.x + enemy.width && this.x + this.width > enemy.x;
            const hitY = this.y < enemy.y + enemy.height && this.y + this.height > enemy.y;
            
            if (hitX && hitY) {
                // Destroy Skeleton Enemy!
                enemy.dead = true;
                this.dead = true;
                player.score += 150;
                synth.playStomp();
                engine.updateHUD();
                particles.spawnStompExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
            }
        });

        // Boundary checks
        if (this.y > 540 || this.x < 0 || this.x > levelGrid[0].length * TILE_SIZE) {
            this.dead = true;
        }
    }

    draw(ctx, cameraX) {
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        if (fireballImgLoaded) {
            ctx.save();
            ctx.shadowColor = '#ffaa00';
            ctx.shadowBlur = 16;
            // Draw centered on the fireball hitbox
            ctx.drawImage(fireballImg, drawX - 10, drawY - 10, 32, 32);
            ctx.restore();
        } else {
            drawPixelMatrix(ctx, drawX, drawY, SPRITES.FIREBALL, false, 2.0);
        }
    }

    getTile(col, row, levelGrid) {
        if (col < 0 || col >= levelGrid[0].length || row < 0 || row >= 12) return TILES.EMPTY;
        return levelGrid[row][col];
    }

    getTileBounds(x, y, w, h) {
        return {
            minX: Math.floor(x / TILE_SIZE),
            maxX: Math.floor((x + w - 0.01) / TILE_SIZE),
            minY: Math.floor(y / TILE_SIZE),
            maxY: Math.floor((y + h - 0.01) / TILE_SIZE)
        };
    }

    isHitSolid(bounds, levelGrid) {
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r, levelGrid);
                if (t === TILES.GROUND || t === TILES.PLATFORM || t === TILES.BREAKABLE || t === TILES.REWARD || t === TILES.SPENT_REWARD) {
                    return true;
                }
            }
        }
        return false;
    }
}


// ----------------------------------------------------
// 7b. ENEMY FIREBALL — straight left flight, phases through tiles, only hits Hexly
// ----------------------------------------------------
class EnemyFireball {
    constructor(x, y, speed) {
        this.x      = x;
        this.y      = y;
        this.vx     = -speed;   // constant leftward — no gravity, no bouncing
        this.width  = 56;
        this.height = 40;
        this.dead   = false;
    }

    update(engine) {
        if (this.dead) return;
        const player = engine.player;

        // Straight left — no physics, no tile checks
        this.x += this.vx;

        // Ember trail off the right edge
        if (Math.random() < 0.6) {
            const colors = ['#ff4400', '#ff8800', '#ffcc00', '#ff2200'];
            particles.add(new Particle(
                this.x + this.width + Math.random() * 6,
                this.y + this.height / 2 + (Math.random() - 0.5) * 10,
                Math.random() * 1.5 + 0.3,
                (Math.random() - 0.5) * 0.6,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 4 + 2,
                Math.random() * 16 + 8,
                'ember'
            ));
        }

        // Player hit check only
        if (player.invulTimer <= 0) {
            const hitX = this.x < player.x + player.width  && this.x + this.width  > player.x;
            const hitY = this.y < player.y + player.height && this.y + this.height > player.y;
            if (hitX && hitY) {
                this.dead = true;
                this.spawnExplosion();
                engine.damagePlayer();
                return;
            }
        }

        // Despawn off left edge
        if (this.x + this.width < engine.camera.x - 60) {
            this.dead = true;
        }
    }

    spawnExplosion() {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd   = Math.random() * 3.5 + 1;
            particles.add(new Particle(
                this.x + this.width  / 2,
                this.y + this.height / 2,
                Math.cos(angle) * spd,
                Math.sin(angle) * spd,
                ['#ff4400', '#ff8800', '#ffdd00', '#ffffff'][Math.floor(Math.random() * 4)],
                Math.random() * 5 + 3,
                Math.random() * 25 + 12,
                'debris'
            ));
        }
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.save();
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur  = 18;
        if (enemyFireballImgLoaded) {
            ctx.drawImage(enemyFireballImg, Math.round(this.x), Math.round(this.y), this.width, this.height);
        } else {
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}


// ----------------------------------------------------
// 8. TILE-COLLECTABLES AND SKELETON ENEMIES
// ----------------------------------------------------
class SoulCoin {
    constructor(x, y) {
        this.x = x + TILE_SIZE / 2;
        this.y = y + TILE_SIZE / 2;
        this.baseY = this.y;
        this.collected = false;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update(frame) {
        this.y = this.baseY + Math.sin(frame * 0.08 + this.bobOffset) * 4;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        
        // Draw the soul shard crystal beautifully auto-trimmed and scaled
        const dw = 22;
        const dh = 40;
        const dx = this.x - dw / 2;
        const dy = this.y - dh / 2;
        
        if (soulShardImgLoaded) {
            ctx.save();
            ctx.shadowColor = '#cc00ff';
            ctx.shadowBlur = 15;
            drawSpriteAutoTrimmed(ctx, soulShardImg, dx, dy, dw, dh, false);
            ctx.restore();
        } else {
            // Fallback to original retro coin if image hasn't loaded yet
            const drawX = Math.round(this.x - 15);
            const drawY = Math.round(this.y - 15);
            drawPixelMatrix(ctx, drawX, drawY, SPRITES.COIN, false, 3.0);
        }
    }
}

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = type === 'SKULL_BUG' ? 0.9 : type === 'HORNED_BLOB' ? 0.5 : 0;
        this.vy = 0;
        this.direction = 1;
        this.dead = false;

        // Set dimensions based on type
        if (type === 'SKULL_BUG') {
            this.width  = 54;
            this.height = 68;
        } else if (type === 'HORNED_BLOB') {
            this.width  = 54;  // same skeleton sprite
            this.height = 68;
        } else {
            // FIRE_IMP — flying skeleton is wide with wings
            this.width  = 98; // Larger menacing size
            this.height = 70;
        }

        if (type === 'FIRE_IMP') {
            this.startY = y;
            this.bounceTimer = Math.random() * Math.PI * 2;
        }

        // Walk animation state (for ground enemies)
        this.animFrame = 0;   // 0 = walk1, 1 = walk2
        this.animTimer = 0;   // counts up each update tick
        this.animSpeed = 12;  // ticks per frame
    }

    update(engine) {
        if (this.dead) return;
        const levelGrid = engine.levelGrid;
        const player = engine.player;

        if (this.type === 'SKULL_BUG' || this.type === 'HORNED_BLOB') {
            this.vy += 0.8;
            this.x += this.vx * this.direction;

            // Simple wall collision checking
            const checkX = this.direction === 1 ? this.x + this.width : this.x;
            const tileX = Math.floor(checkX / TILE_SIZE);
            const tileY1 = Math.floor(this.y / TILE_SIZE);
            const tileY2 = Math.floor((this.y + this.height - 2) / TILE_SIZE);

            let hitWall = false;
            if (levelGrid[tileY1] && levelGrid[tileY1][tileX] && levelGrid[tileY1][tileX] !== TILES.EMPTY && levelGrid[tileY1][tileX] !== TILES.LAVA) hitWall = true;
            if (levelGrid[tileY2] && levelGrid[tileY2][tileX] && levelGrid[tileY2][tileX] !== TILES.EMPTY && levelGrid[tileY2][tileX] !== TILES.LAVA) hitWall = true;

            // Platform Edge Turnaround detection
            let walkingOnLedge = true;
            const footX = this.direction === 1 ? this.x + this.width + 4 : this.x - 4;
            const footY = Math.floor((this.y + this.height + 4) / TILE_SIZE);
            const nextTileX = Math.floor(footX / TILE_SIZE);
            
            if (levelGrid[footY] && (levelGrid[footY][nextTileX] === TILES.EMPTY || levelGrid[footY][nextTileX] === TILES.LAVA)) {
                walkingOnLedge = false;
            }

            if (hitWall || !walkingOnLedge) {
                this.direction *= -1;
            }

            this.y += this.vy;
            const checkTileY = Math.floor((this.y + this.height) / TILE_SIZE);
            const checkTileX1 = Math.floor(this.x / TILE_SIZE);
            const checkTileX2 = Math.floor((this.x + this.width - 1) / TILE_SIZE);

            if (levelGrid[checkTileY]) {
                const t1 = levelGrid[checkTileY][checkTileX1];
                const t2 = levelGrid[checkTileY][checkTileX2];
                if ((t1 && t1 !== TILES.EMPTY && t1 !== TILES.LAVA) || (t2 && t2 !== TILES.EMPTY && t2 !== TILES.LAVA)) {
                    this.y = checkTileY * TILE_SIZE - this.height;
                    this.vy = 0;
                }
            }
        } 
        else if (this.type === 'FIRE_IMP') {
            this.bounceTimer += 0.05;
            this.y = this.startY + Math.sin(this.bounceTimer) * 55;
            
            // Look left unless Hexly passes them to the right
            if (player.x > this.x + this.width / 2) {
                this.direction = 1;
            } else {
                this.direction = -1;
            }
        }

        // Advance walk/flight animation for all enemies
        this.animTimer++;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = 1 - this.animFrame; // toggle 0 <-> 1
        }
        // Guard against overflow of animTimer (unlikely but safe)
        if (this.animTimer > 1000) this.animTimer = 0;
    }

    draw(ctx, cameraX, player = null) {
        if (this.dead) return;

        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);

        if (this.type === 'FIRE_IMP') {
            // Flying skeleton demon
            const frame1Ready = flyingSkeletonImgLoaded;
            const frame2Ready = flyingSkeleton2ImgLoaded;

            let facingScale = 1;
            if (player) {
                // Look left natively (1). If player is to the right, scale -1 (facing right).
                facingScale = (player.x + player.width / 2 > this.x + this.width / 2) ? -1 : 1;
            }

            if (frame1Ready && frame2Ready) {
                ctx.save();
                ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
                ctx.scale(facingScale, 1);
                const frameImg = this.animFrame === 0 ? flyingSkeletonImg : flyingSkeleton2Img;
                ctx.drawImage(frameImg,
                    -this.width / 2, -this.height / 2,
                    this.width, this.height);
                ctx.restore();
            } else if (flyingSkeletonImgLoaded) {
                ctx.save();
                ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
                ctx.scale(facingScale, 1);
                ctx.drawImage(flyingSkeletonImg,
                    -this.width / 2, -this.height / 2,
                    this.width, this.height);
                ctx.restore();
            } else {
                drawPixelMatrix(ctx, drawX, drawY, SPRITES.SKELETONS.WINGED_SKULL, facingScale === -1, 3.0);
            }

        } else {
            // SKULL_BUG and HORNED_BLOB — 2-frame walk animation
            const walk1Ready = skeletonWalk1ImgLoaded;
            const walk2Ready = skeletonWalk2ImgLoaded;

            // Target visual size: 54x68
            const drawW = 54;
            const drawH = 68;
            const dx = this.x + this.width / 2 - drawW / 2;
            const dy = this.y + this.height - drawH + 5; // Shift down by 5px to align with visual floor surface (black border)

            if (walk1Ready && walk2Ready) {
                // Pick the current walk frame
                const frameImg = this.animFrame === 0 ? skeletonWalk1Img : skeletonWalk2Img;
                // Draw beautifully auto-trimmed at a constant size!
                drawSpriteAutoTrimmed(ctx, frameImg, dx, dy, drawW, drawH, this.direction === 1);
            } else if (skeletonImgLoaded) {
                // Fallback to static skeleton
                drawSpriteAutoTrimmed(ctx, skeletonImg, dx, dy, drawW, drawH, this.direction === 1);
            } else {
                const matrix = this.type === 'SKULL_BUG'
                     ? SPRITES.SKELETONS.SKELLY_SCUTTLER
                     : SPRITES.SKELETONS.SPINE_CRAWLER;
                drawPixelMatrix(ctx, drawX, drawY, matrix, this.direction === -1, 3.0);
            }
        }
    }
}


// ----------------------------------------------------
// 9. CLEAN 2-LAYER WASTELAND PARALLAX ENGINE
// ----------------------------------------------------
class ParallaxBackground {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
    }

    draw(ctx, cameraX) {
        if (bgImgLoaded) {
            // Draw your gorgeous custom pixel art background scrolling at 20% speed
            // Use 2x width scroll modulus so the full mirror-pair can repeat seamlessly
            const scrollX = (cameraX * 0.2) % (this.width * 2);
            
            ctx.save();
            ctx.translate(-scrollX, 0);
            
            // 1. Draw primary background scaled to canvas size (Normal)
            ctx.drawImage(bgImg, 0, 0, this.width, this.height);
            
            // 2. Draw wrapping duplicate background image (Mirrored horizontally to stitch perfectly)
            ctx.save();
            ctx.translate(this.width * 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(bgImg, 0, 0, this.width, this.height);
            ctx.restore();

            // 3. Draw third duplicate background image (Normal) to complete the 2-tile loop seamlessly
            ctx.drawImage(bgImg, this.width * 2, 0, this.width, this.height);
            
            ctx.restore();
        } else {
            // Flat Spooky Underworld Sky (Crimson-Obsidian) Fallback
            const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
            skyGrad.addColorStop(0, '#000000');
            skyGrad.addColorStop(0.6, '#180305');
            skyGrad.addColorStop(1, '#47050a');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, this.width, this.height);

            // Layer 1: Wasteland Volcanic Silhouette Peaks (Scroll 10%)
            ctx.fillStyle = '#0f0205';
            const mountOffset = -(cameraX * 0.10) % 400;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const mx = mountOffset + i * 400;
                ctx.moveTo(mx - 100, 540);
                ctx.lineTo(mx + 80, 290); // Jagged mountains
                ctx.lineTo(mx + 220, 420);
                ctx.lineTo(mx + 310, 310);
                ctx.lineTo(mx + 450, 540);
            }
            ctx.closePath();
            ctx.fill();

            // Layer 2: Craggy Ash Cliffs & Horizons (Scroll 30%)
            ctx.fillStyle = '#260408';
            const cliffOffset = -(cameraX * 0.30) % 300;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const cx = cliffOffset + i * 300;
                ctx.moveTo(cx - 50, 540);
                ctx.lineTo(cx + 80, 410); // Spooky jagged volcanic horizons
                ctx.lineTo(cx + 180, 450);
                ctx.lineTo(cx + 250, 380);
                ctx.lineTo(cx + 350, 540);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}


// ----------------------------------------------------
// 10. MAIN HIGH-DEFINITION RETRO GAME LOOP ENGINE
// ----------------------------------------------------
class FallingPlatformEntity {
    constructor(c, r) {
        this.x = c * TILE_SIZE;
        this.y = r * TILE_SIZE;
        this.vy = 0;
        this.dead = false;
    }
    update() {
        this.vy += 0.25; // gravity
        this.y += this.vy;
        if (this.y > 700) this.dead = true;
    }
    draw(ctx) {
        drawPixelMatrix(ctx, this.x, this.y, SPRITES.TILES.PLATFORM, false, 4.5);
    }
}

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 180;
        this.vx = -1.5;
        this.vy = 0;
        this.grounded = false;
        this.frameCounter = 0;
        this.fireballTimer = 120;
        this.jumpTimer = 180;
        this.dead = false;
    }
    update(engine) {
        this.frameCounter++;
        this.fireballTimer--;
        this.jumpTimer--;
        
        // Pacing
        if (this.x < engine.player.x - 200) this.vx = 1.5;
        if (this.x > engine.player.x + 200) this.vx = -1.5;
        
        // Jump to allow player under
        if (this.jumpTimer <= 0 && this.grounded) {
            this.vy = -16;
            this.grounded = false;
            this.jumpTimer = 180 + Math.random() * 60;
        }
        
        // Shoot fireball
        if (this.fireballTimer <= 0) {
            this.fireballTimer = 120 + Math.random() * 60;
            if (this.x - engine.player.x < 600) {
                // Shoot towards player
                const dir = this.x > engine.player.x ? -1 : 1;
                engine.enemyFireballs.push(new Fireball(this.x + this.width/2, this.y + this.height/2, dir * 5, 0.5));
            }
        }
        
        // Physics
        this.vy += engine.physics.gravity;
        this.y += this.vy;
        this.x += this.vx;
        
        // Floor collision
        if (this.y + this.height >= 9 * TILE_SIZE) {
            this.y = 9 * TILE_SIZE - this.height;
            this.vy = 0;
            this.grounded = true;
        }
    }
    draw(ctx, cameraX) {
        if (!bossImg1Loaded || !bossImg2Loaded) return;
        const img = Math.floor(this.frameCounter / 15) % 2 === 0 ? bossImg1 : bossImg2;
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        ctx.save();
        if (this.vx > 0) {
            ctx.translate(drawX + this.width, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(img, drawX, drawY, this.width, this.height);
        }
        ctx.restore();
    }
}

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();

        this.width = 960;
        this.height = 540;
        this.timeLimit = 300;
        this.state = 'TITLE';

        this.camera = { x: 0, targetX: 0 };
        this.frameCounter = 0;
        
        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.fireballs = [];
        this.enemyFireballs = [];  // Bowser-style hazard fireballs
        this.flowers = []; // Collectible powerups array
        this.enemyFireballTimer = 0;  // Countdown to next enemy fireball spawn
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];

        // Hexly configuration parameters (Size 78x90px - Super-sized 2 tiles tall!)
        this.player = {
            x: 0,
            y: 0,
            width: 78,
            height: 90,
            vx: 0,
            vy: 0,
            grounded: false,
            health: 3,
            maxHealth: 3,
            score: 0,
            coins: 0,
            poweredUp: false, // Morphing Fire Hexly state
            coyoteTimer: 0,
            jumpBufferTimer: 0,
            invulTimer: 0,
            hurtTimer: 0,
            direction: 1,
            lastSafeX: 80,
            lastSafeY: 300,
            animTime: 0,
            crouching: false
        };

        this.physics = {
            gravity: 0.52,
            acceleration: 0.38,
            friction: 0.85,
            maxSpeedX: 4.2,
            jumpForce: -15.0,
            maxFallSpeed: 10.0,
            coyoteDuration: 9,
            jumpBufferDuration: 6
        };

        this.background = new ParallaxBackground(this.width, this.height);

        this.screens = {
            title: document.getElementById('title-screen'),
            pause: document.getElementById('pause-screen'),
            gameover: document.getElementById('game-over-screen'),
            victory: document.getElementById('victory-screen'),
            hud: document.getElementById('hud-overlay')
        };

        this.setupMenuTriggers();
        this.initializeMap();
    }

    setupMenuTriggers() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.audioSetup();
            this.startGame();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });

        const resetHandler = () => {
            synth.resume();
            this.resetGame();
        };
        document.getElementById('pause-reset-btn').addEventListener('click', resetHandler);
        document.getElementById('retry-btn').addEventListener('click', resetHandler);
        document.getElementById('victory-retry-btn').addEventListener('click', resetHandler);
    }

    audioSetup() {
        synth.init();
        synth.musicEnabled = true;
    }

    initializeMap() {
        this.levelGrid = [];
        this.enemies = [];
        this.coins = [];
        this.fireballs = [];
        this.enemyFireballs = [];
        this.flowers = [];
        this.enemyFireballTimer = 300; // First spawn after 5 seconds
        this.platformTimers = {};
        this.fallingPlatforms = [];
        this.bosses = [];

        let shardCount = 0;
        
        // Pad the level with 1 empty row at the top to push everything down by 1 row
        this.levelGrid.push(new Array(LEVEL_DATA[0].length).fill(0));

        for (let r = 0; r < LEVEL_DATA.length; r++) {
            const actualRow = r + 1; // Shift down by 1 row
            if (actualRow >= 12) continue; // Keep grid strictly 12 rows tall
            
            this.levelGrid[actualRow] = [];
            for (let c = 0; c < LEVEL_DATA[r].length; c++) {
                const cell = LEVEL_DATA[r][c];
                
                if (cell === 13) {
                    this.bosses.push(new Boss(c * TILE_SIZE, actualRow * TILE_SIZE));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 14) {
                    this.levelGrid[actualRow][c] = TILES.FALLING_PLATFORM;
                } else if (cell === 7) {
                    if (shardCount % 3 === 0) {
                        this.coins.push(new SoulCoin(c * TILE_SIZE, actualRow * TILE_SIZE));
                    }
                    shardCount++;
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 8) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'SKULL_BUG'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 9) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'FIRE_IMP'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else if (cell === 10) {
                    this.enemies.push(new Enemy(c * TILE_SIZE, actualRow * TILE_SIZE, 'HORNED_BLOB'));
                    this.levelGrid[actualRow][c] = TILES.EMPTY;
                } else {
                    this.levelGrid[actualRow][c] = cell;
                }
            }
        }

        // Set maximum coin count dynamically based on the actual spawned shards!
        this.player.maxCoins = this.coins.length || 1;
    }

    startGame() {
        this.state = 'PLAYING';
        this.screens.title.classList.add('hidden');
        this.screens.hud.classList.remove('hidden');
        this.resetGame();
    }

    resetGame() {
        this.state = 'PLAYING';
        this.screens.gameover.classList.add('hidden');
        this.screens.victory.classList.add('hidden');
        this.screens.pause.classList.add('hidden');
        this.screens.hud.classList.remove('hidden');

        this.player.x = 80;
        this.player.y = 300;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.health = 3;
        this.player.score = 0;
        this.player.coins = 0;
        this.player.poweredUp = false; // Reset fireball morph
        this.player.grounded = false;
        this.player.invulTimer = 0;
        this.player.hurtTimer = 0;
        this.player.lastSafeX = 80;
        this.player.lastSafeY = 300;

        this.camera.x = 0;
        this.camera.targetX = 0;
        this.camera.floatX = 0;
        
        this.timeRemaining = this.timeLimit;
        this.initializeMap();
        this.updateHUD();

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state === 'PLAYING') {
                this.timeRemaining--;
                this.updateHUD();
                if (this.timeRemaining <= 0) this.triggerGameOver();
            }
        }, 1000);
    }

    triggerGameOver() {
        this.state = 'GAMEOVER';
        synth.playDamage();
        this.screens.gameover.classList.remove('hidden');
        document.getElementById('go-score').innerText = this.player.score;
        document.getElementById('go-coins').innerText = `${this.player.coins}/${this.player.maxCoins}`;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    triggerVictory() {
        this.state = 'VICTORY';
        synth.playVictory();
        this.screens.victory.classList.remove('hidden');
        
        document.getElementById('vic-score').innerText = String(this.player.score).padStart(6, '0');
        document.getElementById('vic-coins').innerText = `${this.player.coins}/${this.player.maxCoins}`;
        const timeSpent = this.timeLimit - this.timeRemaining;
        const mins = Math.floor(timeSpent / 60);
        const secs = String(timeSpent % 60).padStart(2, '0');
        document.getElementById('vic-time').innerText = `${mins}:${secs}`;
        
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.screens.pause.classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.screens.pause.classList.add('hidden');
            synth.resume();
        }
    }

    updateHUD() {
        const container = document.getElementById('heart-container');
        if (container) {
            container.innerHTML = '';
            for (let i = 0; i < this.player.health; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                container.appendChild(heart);
            }
        }
        
        const scoreVal = document.getElementById('score-val');
        if (scoreVal) {
            scoreVal.innerText = String(this.player.score).padStart(6, '0');
        }
    }

    showToast(message) {
        // No-op: Completely disable all bottom in-game toasts as requested by the user
    }

    // ----------------------------------------------------
    // 11. ENGINE UPDATE CYCLES
    // ----------------------------------------------------
    update() {
        this.frameCounter++;

        if (this.input.restartPressed) {
            this.audioSetup();
            this.resetGame();
            this.input.clearFrameTriggers();
            return;
        }

        if (this.input.pausePressed) {
            this.audioSetup();
            if (this.state === 'PLAYING' || this.state === 'PAUSED') this.togglePause();
            this.input.clearFrameTriggers();
            return;
        }

        // Allow particles + rendering to keep running during DYING (death animation plays out)
        if (this.state === 'DYING') {
            particles.update();
            this.frameCounter++;
            this.input.clearFrameTriggers();
            return;
        }

        if (this.state !== 'PLAYING') {
            this.input.clearFrameTriggers();
            return;
        }

        particles.update();
        // 1. Core Player Timers
        if (this.player.invulTimer > 0) this.player.invulTimer--;
        if (this.player.hurtTimer > 0) this.player.hurtTimer--;
        if (this.player.coyoteTimer > 0) this.player.coyoteTimer--;
        if (this.player.jumpBufferTimer > 0) this.player.jumpBufferTimer--;

        const p = this.player;
        const input = this.input;

        // Slow down walk cycle and instantly freeze to static pose when input keys are released
        if ((input.left || input.right) && p.grounded && !p.crouching) {
            p.animTime += 0.048 * Math.abs(p.vx); // Quadrupled animation speed for a faster walk cycle
        } else {
            p.animTime = 0;
        }
        // Prevent animTime from growing without bound (which can cause floating‑point slowdown)
        if (p.animTime > 1000) p.animTime = 0;

        // Crouch State Machine
        let wantCrouch = input.down && p.grounded;
        
        if (p.crouching) {
            if (!wantCrouch) {
                // Standing up height clearance check
                const testY = p.y - 45;
                const testH = 90;
                let blocked = false;
                
                const bounds = this.getTileBounds(p.x, testY, p.width, testH);
                for (let r = bounds.minY; r <= bounds.maxY; r++) {
                    for (let c = bounds.minX; c <= bounds.maxX; c++) {
                        const t = this.getTile(c, r);
                        if (this.isSolid(t)) {
                            blocked = true;
                            break;
                        }
                    }
                    if (blocked) break;
                }
                
                if (blocked) {
                    wantCrouch = true;
                } else {
                    p.crouching = false;
                    p.height = 90;
                    p.y -= 45;
                }
            }
        } else {
            if (wantCrouch) {
                p.crouching = true;
                p.height = 45;
                p.y += 45;
            }
        }

        // 2. Horizontal physics calculations (Mario-style Sprint Support)
        const isSprinting = input.shootHeld;
        const currentAccel = isSprinting ? 0.55 : this.physics.acceleration;
        const currentMaxSpeed = isSprinting ? 6.5 : this.physics.maxSpeedX;

        if (p.crouching) {
            p.vx *= 0.82; // slide to halt with heavy sliding friction
        } else {
            if (input.left) {
                p.vx -= currentAccel;
                p.direction = -1;
            } else if (input.right) {
                p.vx += currentAccel;
                p.direction = 1;
            } else {
                p.vx *= this.physics.friction;
            }
        }

        p.vx = Math.max(-currentMaxSpeed, Math.min(p.vx, currentMaxSpeed));

        // 3. Jumps physics calculations
        if (this.input.jumpPressed) {
            this.player.jumpBufferTimer = this.physics.jumpBufferDuration;
        }

        this.player.vy += this.physics.gravity;
        if (this.player.grounded) {
            this.player.coyoteTimer = this.physics.coyoteDuration;
        } else {
            this.player.coyoteTimer--;
        }

        if (this.player.jumpBufferTimer > 0 && this.player.coyoteTimer > 0) {
            synth.playJump();
            this.player.vy = this.physics.jumpForce;
            this.player.grounded = false;
            this.player.coyoteTimer = 0;
            this.player.jumpBufferTimer = 0;
            particles.spawnJumpDust(this.player.x + this.player.width / 2, this.player.y + this.player.height);
        }

        if (!this.input.jump && this.player.vy < -2.0) {
            this.player.vy = -2.0;
        }

        if (this.player.vy > this.physics.maxFallSpeed) {
            this.player.vy = this.physics.maxFallSpeed;
        }

        // 4. Bouncing Fireball shooting logic
        if (this.input.shootPressed && this.player.poweredUp) {
            if (this.fireballs.length < 2) { // Max 2 active fireballs
                synth.playFireball();
                const fx = this.player.x + (this.player.direction === 1 ? this.player.width : -12);
                const fy = this.player.y + 15;
                this.fireballs.push(new Fireball(fx, fy, this.player.direction * 6.5, 1.0));
            }
        }

        this.resolveCollisions();

        // 5. Ambient embers and bubbling lava
        if (this.frameCounter % 15 === 0) {
            const rColX = Math.floor(Math.random() * this.levelGrid[0].length);
            for (let y = 9; y < 12; y++) {
                if (this.levelGrid[y] && this.levelGrid[y][rColX] === TILES.LAVA) {
                    particles.spawnLavaBubble(rColX * TILE_SIZE + Math.random() * TILE_SIZE, y * TILE_SIZE + 2);
                    break;
                }
            }
        }
        if (this.frameCounter % 6 === 0) {
            const sX = this.camera.x + Math.random() * this.width;
            particles.spawnEmber(sX, 100 + Math.random() * 300);
        }

        // 6. Entity Updates
        this.coins.forEach(coin => coin.update(this.frameCounter));
        this.enemies.forEach(enemy => enemy.update(this));
        this.flowers.forEach(flower => flower.update());

        for (const key in this.platformTimers) {
            this.platformTimers[key]--;
            if (this.platformTimers[key] <= 0) {
                const [c, r] = key.split(',').map(Number);
                this.levelGrid[r][c] = TILES.EMPTY;
                this.fallingPlatforms.push(new FallingPlatformEntity(c, r));
                delete this.platformTimers[key];
            }
        }
        for (let i = this.fallingPlatforms.length - 1; i >= 0; i--) {
            const p = this.fallingPlatforms[i];
            p.update();
            if (p.dead) this.fallingPlatforms.splice(i, 1);
        }
        for (let i = this.bosses.length - 1; i >= 0; i--) {
            const b = this.bosses[i];
            b.update(this);
            if (b.dead) this.bosses.splice(i, 1);
        }

        
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fb = this.fireballs[i];
            fb.update(this);
            if (fb.dead) this.fireballs.splice(i, 1);
        }

        // 6b. Enemy fireball spawning (Bowser-style, every 4-8 seconds)
        this.enemyFireballTimer--;
        if (this.enemyFireballTimer <= 0) {
            // Spawn from right edge of current viewport + offset
            const spawnX = this.camera.x + this.width + 40;
            // Pick a random Y in the upper 2/3 of the level so it has room to arc down
            const spawnY = 80 + Math.random() * 280;
            const speed = 2.8 + Math.random() * 1.5;
            this.enemyFireballs.push(new EnemyFireball(spawnX, spawnY, speed));
            // Next fireball in 4-8 seconds (240-480 frames)
            this.enemyFireballTimer = 240 + Math.floor(Math.random() * 240);
        }

        // Check if Hexly's fireballs destroy enemy fireballs
        for (let i = this.enemyFireballs.length - 1; i >= 0; i--) {
            const ef = this.enemyFireballs[i];
            ef.update(this);
            if (ef.dead) {
                this.enemyFireballs.splice(i, 1);
                continue;
            }
            // Player fireballs can destroy enemy fireballs
            for (let j = this.fireballs.length - 1; j >= 0; j--) {
                const pf = this.fireballs[j];
                if (pf.dead) continue;
                const hitX = pf.x < ef.x + ef.width && pf.x + pf.width > ef.x;
                const hitY = pf.y < ef.y + ef.height && pf.y + pf.height > ef.y;
                if (hitX && hitY) {
                    ef.dead = true;
                    pf.dead = true;
                    this.player.score += 200;
                    this.updateHUD();
                    ef.spawnExplosion();
                    break;
                }
            }
        }

        this.resolveInteractions();

        // 7. Stable Lockstep Camera Follow - Hard-locked to player integer position to mathematically eliminate all pixel judder
        const targetX = Math.round(this.player.x) - 441;
        const maxScroll = (this.levelGrid[0].length * TILE_SIZE) - this.width;
        this.camera.x = Math.max(0, Math.min(targetX, maxScroll));

        this.input.clearFrameTriggers();
    }

    resolveCollisions() {
        this.player.x += this.player.vx;
        this.player.grounded = false;

        let bounds = this.getTileBounds(this.player.x, this.player.y, this.player.width, this.player.height);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r);
                if (this.isSolid(t)) {
                    if (this.player.vx > 0) {
                        this.player.x = c * TILE_SIZE - this.player.width;
                        this.player.vx = 0;
                    } else if (this.player.vx < 0) {
                        this.player.x = (c + 1) * TILE_SIZE;
                        this.player.vx = 0;
                    }
                }
            }
        }

        this.player.y += this.player.vy;
        bounds = this.getTileBounds(this.player.x, this.player.y, this.player.width, this.player.height);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const t = this.getTile(c, r);
                if (this.isSolid(t)) {
                    if (this.player.vy > 0) {
                        this.player.y = r * TILE_SIZE - this.player.height;
                        this.player.vy = 0;
                        this.player.grounded = true;

                        if (t === TILES.FALLING_PLATFORM && !this.platformTimers[`${c},${r}`]) {
                            this.platformTimers[`${c},${r}`] = 120; // 2 seconds
                        }

                        if (t !== TILES.LAVA && t !== TILES.PLATFORM && t !== TILES.FALLING_PLATFORM) {
                            this.player.lastSafeX = this.player.x;
                            this.player.lastSafeY = this.player.y;
                        }
                    } else if (this.player.vy < 0) {
                        this.player.y = (r + 1) * TILE_SIZE;
                        this.player.vy = 0;
                        this.triggerCeilingBump(c, r);
                    }
                }
            }
        }

        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.vx = 0;
        }
        if (this.player.y > 540) this.damagePlayer();
    }

    triggerCeilingBump(col, row) {
        const tile = this.levelGrid[row][col];
        if (tile === TILES.BREAKABLE) {
            this.levelGrid[row][col] = TILES.EMPTY;
            synth.playCrunch();
            particles.spawnBlockDebris(col * TILE_SIZE + TILE_SIZE/2, row * TILE_SIZE + TILE_SIZE/2);
            this.player.score += 15;
            this.updateHUD();
        } 
        else if (tile === TILES.REWARD) {
            this.levelGrid[row][col] = TILES.SPENT_REWARD;
            
            // Strike block: pop out Lava Flower powerup (or coin occasionally)
            const cx = col * TILE_SIZE;
            const cy = row * TILE_SIZE;
            
            if (!this.player.poweredUp) {
                synth.playVictory();
                this.flowers.push(new LavaFlower(cx, cy));
                this.showToast("POWERUP RELEASED!");
            } else {
                synth.playCollect();
                this.player.coins++;
                this.player.score += 100;
                for (let i = 0; i < 8; i++) particles.spawnEmber(cx + TILE_SIZE/2, cy);
                this.updateHUD();
                this.showToast("+1 BONUS SOUL!");
            }
        }
    }

    damagePlayer() {
        if (this.player.invulTimer > 0) return;

        // If powered up, lose fireball power but stay alive! (Nintendo style)
        if (this.player.poweredUp) {
            this.player.poweredUp = false;
            synth.playDamage();
            this.player.invulTimer = 90;
            this.player.hurtTimer = 25;
            this.player.vy = -6.0;
            this.player.vx = -this.player.direction * 3.5;
            this.player.grounded = false;
            this.showToast("POWER LOST!");
            return;
        }

        this.player.health--;
        this.updateHUD();
        synth.playDamage();
        this.player.invulTimer = 90;
        this.player.hurtTimer = 25;
        
        this.player.vy = -6.0;
        this.player.vx = -this.player.direction * 3.5;
        this.player.grounded = false;

        const cabinet = document.getElementById('arcade-cabinet');
        cabinet.classList.add('pulse');
        setTimeout(() => cabinet.classList.remove('pulse'), 400);

        // Vaporize Hexly!
        for (let i = 0; i < 25; i++) {
            const colors = ['#ff6a00', '#f7be00', '#ff9900', '#f95700'];
            particles.add(new Particle(
                this.player.x + Math.random() * this.player.width,
                this.player.y + Math.random() * this.player.height,
                (Math.random() - 0.5) * 2.0, // Gentle drift
                (Math.random() * -2.5) - 0.5, // Slow upward bias
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 5 + 2,
                Math.random() * 40 + 20,
                'ember'
            ));
        }

        if (this.player.health <= 0) {
            this.triggerGameOver();
        } else {
            // Mario-style: restart the whole level from the beginning after a brief death pause
            this.state = 'DYING';
            setTimeout(() => {
                if (this.state === 'DYING') {
                    // Preserve health & score but reinitialize map and start position
                    const savedHealth = this.player.health;
                    const savedScore  = this.player.score;
                    this.initializeMap();
                    this.player.health = savedHealth;
                    this.player.score  = savedScore;
                    this.player.coins  = 0; // Reset collected coins so they match the fully respawned shards on the map!
                    this.player.poweredUp = false;
                    this.player.x = 80;
                    this.player.y = 300;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.player.invulTimer = 120; // 2-second grace period
                    this.player.hurtTimer  = 0;
                    this.player.grounded   = false;
                    this.camera.x = 0;
                    this.camera.targetX = 0;
                    this.state = 'PLAYING';
                    this.updateHUD();
                    this.showToast('BACK TO START!');
                }
            }, 900);
        }
    }

    resolveInteractions() {
        const px = this.player.x;
        const py = this.player.y;
        const pw = this.player.width;
        const ph = this.player.height;

        // 1. Soul Shard collections
        this.coins.forEach(coin => {
            if (coin.collected) return;
            // Generous AABB collision detection to make collection feel natural and responsive
            const hitX = px < coin.x + 18 && px + pw > coin.x - 18;
            const hitY = py < coin.y + 24 && py + ph > coin.y - 24;
            if (hitX && hitY) {
                coin.collected = true;
                this.player.coins++;
                this.player.score += 50;
                synth.playCollect();
                this.updateHUD();
                for (let i = 0; i < 6; i++) particles.spawnEmber(coin.x, coin.y);
            }
        });


        this.bosses.forEach(boss => {
            if (!boss.dead && !this.player.poweredUp) {
                const hitX = px < boss.x + boss.width - 20 && px + pw > boss.x + 20;
                const hitY = py < boss.y + boss.height - 20 && py + ph > boss.y + 20;
                if (hitX && hitY) {
                    this.damagePlayer();
                }
            }
        });

        // 2. Lava Flower collections (Fire Suit Power-up)
        this.flowers.forEach(flower => {
            if (flower.collected) return;
            // AABB overlapping
            const hitX = px < flower.x + 30 && px + pw > flower.x;
            const hitY = py < flower.y + 30 && py + ph > flower.y;
            if (hitX && hitY) {
                flower.collected = true;
                this.player.poweredUp = true;
                this.player.score += 500;
                synth.playVictory(); // Epic chime chords
                this.updateHUD();
                this.showToast("FIRE HEXLY MORPHED!");

                
                // Spawn sparkling embers
                for (let i = 0; i < 15; i++) {
                    particles.spawnEmber(flower.x + 15, flower.y + 15);
                }
            }
        });

        // 3. Enemy stomping checking
        this.enemies.forEach(enemy => {
            if (enemy.dead || this.state !== 'PLAYING') return;

            const hitX = px < enemy.x + enemy.width && px + pw > enemy.x;
            const hitY = py < enemy.y + enemy.height && py + ph > enemy.y;

            if (hitX && hitY) {
                const falling = this.player.vy > 0;
                const hitTop = (py + ph - this.player.vy) <= (enemy.y + 10);
                
                if (falling && hitTop) {
                    enemy.dead = true;
                    this.player.vy = -7.5;
                    this.player.score += 150;
                    synth.playStomp();
                    this.updateHUD();
                    particles.spawnStompExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                } else {
                    this.damagePlayer();
                }
            }
        });

        // 4. Portal Goal check
        const bounds = this.getTileBounds(px, py, pw, ph);
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.PORTAL) {
                    this.triggerVictory();
                    return;
                }
            }
        }

        // 5. Lava Hazard intersection checks
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.LAVA) {
                    this.damagePlayer();
                    return;
                }
            }
        }
    }

    getTile(col, row) {
        if (col < 0 || col >= this.levelGrid[0].length || row < 0 || row >= 12) return TILES.EMPTY;
        return this.levelGrid[row][col];
    }

    isSolid(tile) {
        return tile === TILES.GROUND || 
               tile === TILES.PLATFORM || 
               tile === TILES.FALLING_PLATFORM ||
               tile === TILES.BREAKABLE || 
               tile === TILES.REWARD || 
               tile === TILES.SPENT_REWARD;
    }

    getTileBounds(x, y, w, h) {
        return {
            minX: Math.floor(x / TILE_SIZE),
            maxX: Math.floor((x + w - 0.01) / TILE_SIZE),
            minY: Math.floor(y / TILE_SIZE),
            maxY: Math.floor((y + h - 0.01) / TILE_SIZE)
        };
    }

    // ----------------------------------------------------
    // 12. CANVAS DRAW RENDER PIPELINE
    // ----------------------------------------------------
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2-Layer Wasteland Background scrolling
        this.background.draw(this.ctx, Math.round(this.camera.x));

        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), 0);

        // Draw physical grid blocks (Scale 4.5x = 45px grids!)
        this.drawTiles();

        this.coins.forEach(coin => {
            if (!coin.collected) coin.draw(this.ctx, this.camera.x);
        });

        this.flowers.forEach(flower => {
            if (!flower.collected) flower.draw(this.ctx, this.camera.x);
        });

        this.fireballs.forEach(fb => fb.draw(this.ctx, this.camera.x));
        this.enemyFireballs.forEach(ef => ef.draw(this.ctx));
        this.fallingPlatforms.forEach(p => p.draw(this.ctx));
        this.bosses.forEach(b => b.draw(this.ctx, this.camera.x));

        this.enemies.forEach(enemy => {
            if (!enemy.dead) enemy.draw(this.ctx, this.camera.x, this.player);
        });

        particles.draw(this.ctx, 0);

        this.drawHexly();

        this.ctx.restore();
    }

    drawTiles() {
        const startCol = Math.floor(this.camera.x / TILE_SIZE);
        const endCol = Math.ceil((this.camera.x + this.width) / TILE_SIZE);
        
        for (let r = 0; r < 12; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const tile = this.getTile(c, r);
                if (tile !== TILES.EMPTY) {
                    this.drawSingleTile(c * TILE_SIZE, r * TILE_SIZE, tile);
                }
            }
        }
    }

    drawSingleTile(x, y, type) {
        let matrix = null;
        if (type === TILES.GROUND) matrix = SPRITES.TILES.GROUND;
        else if (type === TILES.PLATFORM) matrix = SPRITES.TILES.PLATFORM;
        else if (type === TILES.FALLING_PLATFORM) {
            let dx = x;
            let dy = y;
            const c = Math.round(x / TILE_SIZE);
            const r = Math.round(y / TILE_SIZE);
            const timer = this.platformTimers[`${c},${r}`];
            if (timer && timer < 60) {
                dx += (Math.random() - 0.5) * 4;
                dy += (Math.random() - 0.5) * 4;
            }
            drawPixelMatrix(this.ctx, dx, dy, SPRITES.TILES.PLATFORM, false, 4.5);
            return;
        }
        else if (type === TILES.BREAKABLE) matrix = SPRITES.TILES.BREAKABLE;
        else if (type === TILES.REWARD) {
            // Draw the ground-brown base tile first
            drawPixelMatrix(this.ctx, x, y, SPRITES.TILES.REWARD, false, 4.5);

            const pulse = (Math.sin(this.frameCounter * 0.12) + 1) / 2; // 0..1 oscillation
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.globalAlpha = 0.10 + pulse * 0.22; // 0.10 → 0.32 breathing range
            const grd = this.ctx.createRadialGradient(
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2,
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE * 0.7
            );
            grd.addColorStop(0,   'rgba(255, 220, 80, 1)');
            grd.addColorStop(0.4, 'rgba(255, 100, 0, 0.9)');
            grd.addColorStop(1,   'rgba(180, 20, 0, 0)');
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            // Pulsing border glow
            this.ctx.globalAlpha = 0.08 + pulse * 0.14;
            this.ctx.strokeStyle = '#ff8800';
            this.ctx.lineWidth = 2 + pulse * 2;
            this.ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            this.ctx.restore();
            return;
        }
        else if (type === TILES.SPENT_REWARD) matrix = SPRITES.TILES.SPENT;
        else if (type === TILES.LAVA) {
            // Slow 3-frame downward waterfall animation (18 ticks per frame = sluggish lava)
            const frame = Math.floor(this.frameCounter / 18) % 3;
            if (frame === 0) matrix = SPRITES.TILES.LAVA_A;
            else if (frame === 1) matrix = SPRITES.TILES.LAVA_B;
            else matrix = SPRITES.TILES.LAVA_C;

            // Draw the base lava first
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
            
            // Pulsing hot-orange glow overlay using 'lighter' composite
            const pulse = (Math.sin(this.frameCounter * 0.1) + 1) / 2; // 0..1 oscillation
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.globalAlpha = 0.15 + pulse * 0.25; // 0.15 to 0.40 breathing range
            const grd = this.ctx.createRadialGradient(
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2,
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE * 0.8
            );
            grd.addColorStop(0,   'rgba(255, 200, 50, 1)');
            grd.addColorStop(0.5, 'rgba(255, 60, 0, 0.8)');
            grd.addColorStop(1,   'rgba(180, 0, 0, 0)');
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.restore();
            
            return; // Lava handled — skip matrix draw at the end
        }
        else if (type === TILES.PORTAL) {
            if (portalImgLoaded) {
                const pw = 150;
                const ph = 240;
                const px2 = x + (TILE_SIZE - pw) / 2;
                // The portal tile is at row 2, ground is at row 4. 
                // We add 2 * TILE_SIZE (90px) to anchor its bottom exactly to the ground.
                const py2 = y - ph + (TILE_SIZE * 2);

                // --- 2-frame color-dodge glow animation ---
                // Frame 0 (ticks 0-19): base hot-red glow
                // Frame 1 (ticks 20-39): bright energy surge with lighter blend
                const glowFrame = Math.floor(this.frameCounter / 20) % 2;

                // Smooth pulse factor using sine wave (0→1→0 over 40 ticks)
                const pulseSin = (Math.sin(this.frameCounter * (Math.PI / 20)) + 1) / 2; // 0..1

                this.ctx.save();

                // Layer 1 – base portal image with animated shadow glow
                this.ctx.shadowColor = glowFrame === 0 ? '#ff3300' : '#ff9900';
                this.ctx.shadowBlur  = 20 + pulseSin * 30; // pulses 20→50
                this.ctx.drawImage(portalImg, px2, py2, pw, ph);

                // Layer 2 – color-dodge bright inner light overlay on frame 1
                if (glowFrame === 1) {
                    this.ctx.globalCompositeOperation = 'lighter';
                    this.ctx.globalAlpha = 0.18 + pulseSin * 0.22; // 0.18→0.40
                    // Draw a radial inner-glow ellipse over the portal aperture
                    const grd = this.ctx.createRadialGradient(
                        px2 + pw * 0.42, py2 + ph * 0.52, 2,
                        px2 + pw * 0.42, py2 + ph * 0.52, pw * 0.55
                    );
                    grd.addColorStop(0,   'rgba(255,255,220,1)');
                    grd.addColorStop(0.3, 'rgba(255,160,30,0.8)');
                    grd.addColorStop(0.7, 'rgba(255,40,0,0.4)');
                    grd.addColorStop(1,   'rgba(0,0,0,0)');
                    this.ctx.fillStyle = grd;
                    this.ctx.fillRect(px2, py2, pw, ph);
                }

                this.ctx.restore();
            } else {
                matrix = SPRITES.TILES.PORTAL;
            }
            return; // Portal handled — skip matrix draw
        }

        if (matrix) {
            // Draw blocks pixelated (Scale 4.5 = 45px)
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
        }
    }

    drawHexly() {
        const p = this.player;
        if (this.state === 'DYING' || this.state === 'GAME_OVER') return;
        if (p.invulTimer > 0 && Math.floor(p.invulTimer / 4) % 2 === 0) return;

        const ctx = this.ctx;

        if (hexlyImgLoaded) {
            ctx.save();
            
            // 1. Pick the correct animation frame image (custom jump/crouch frames included)
            let currentHexlyImg = hexlyImg;
            if (p.crouching && hexlyCrouchImgLoaded) {
                currentHexlyImg = hexlyCrouchImg;
            } else if (!p.grounded && hexlyJumpImgLoaded) {
                currentHexlyImg = hexlyJumpImg;
            } else if (p.grounded && Math.abs(p.vx) > 0.2 && hexlyWalk2ImgLoaded) {
                const walkFrame = Math.floor(p.animTime) % 2;
                currentHexlyImg = walkFrame === 0 ? hexlyImg : hexlyWalk2Img;
            }
            
            // 2. Set visual size: Hexly is drawn at 82px high normally, or 55px when crouching
            const drawH = p.crouching ? 55 : 82;
            
            // Cache trim bounds and calculate dynamic width keeping natural visual proportions
            if (!currentHexlyImg.trimBounds) {
                currentHexlyImg.trimBounds = getSpriteTrimBounds(currentHexlyImg);
            }
            const b = currentHexlyImg.trimBounds || { x: 0, y: 0, w: currentHexlyImg.naturalWidth || 690, h: currentHexlyImg.naturalHeight || 860 };
            
            const sourceW = b.w > 0 ? b.w : 690;
            const sourceH = b.h > 0 ? b.h : 860;
            const drawW = drawH * (sourceW / sourceH);
            
            let dx = p.x + p.width / 2 - drawW / 2;
            let dy = p.y + p.height - drawH + 5; // Shift down by 5px to align with visual floor surface (black border)

            // 5. Apply Invulnerability translucent flash
            if (p.invulTimer > 0 && Math.floor(p.invulTimer / 4) % 2 === 0) {
                ctx.restore();
                return;
            }
            if (p.invulTimer > 0) {
                ctx.globalAlpha = 0.6;
            }
            
            // 5. Apply dynamic floor-anchored animations
            let scaleSaved = false;
            if (p.hurtTimer > 0) {
                // Rotate around the bottom center
                ctx.save();
                ctx.translate(p.x + p.width / 2, p.y + p.height);
                ctx.rotate(p.direction * 0.15);
                ctx.translate(-(p.x + p.width / 2), -(p.y + p.height));
                scaleSaved = true;
            } 
            else if (this.state === 'VICTORY') {
                const bounce = Math.abs(Math.sin(p.animTime * 2.2)) * 8;
                dy -= Math.round(bounce);
            }
            
            // 6. Draw Hexly beautifully auto-trimmed and auto-aligned!
            // If powered up, draw molten aura under him
            if (p.poweredUp) {
                ctx.save();
                ctx.shadowColor = '#ff5a00';
                ctx.shadowBlur = 12 + Math.sin(p.animTime * 1.2) * 8;
                drawSpriteAutoTrimmed(ctx, currentHexlyImg, dx, dy, drawW, drawH, p.direction === -1);
                ctx.restore();
            } else {
                drawSpriteAutoTrimmed(ctx, currentHexlyImg, dx, dy, drawW, drawH, p.direction === -1);
            }
            
            if (scaleSaved) ctx.restore();
            
            // Restore any rotation/scale saves
            if (scaleSaved) {
                ctx.restore();
            }
            
            ctx.restore();
        } else {
            // Bulletproof Fallback: if PNG fails/hasn't loaded, draw the high-def 26x30 matrix
            let frame = SPRITES.HEXLY.IDLE;
            if (p.hurtTimer > 0) {
                frame = SPRITES.HEXLY.HURT;
            } else if (this.state === 'VICTORY') {
                frame = SPRITES.HEXLY.WIN;
            } else if (p.crouching) {
                frame = SPRITES.HEXLY.JUMP; // Fallback representation of crouching
            } else if (!p.grounded) {
                frame = SPRITES.HEXLY.JUMP;
            } else if (Math.abs(p.vx) > 0.2) {
                const runCycle = Math.floor(p.animTime * 2.5) % 2;
                frame = runCycle === 0 ? SPRITES.HEXLY.RUN_A : SPRITES.HEXLY.RUN_B;
            }

            const drawX = Math.round(p.x);
            const drawY = Math.round(p.y);
            
            // Draw original colors base matrix normally
            drawPixelMatrix(ctx, drawX, drawY, frame, p.direction === -1, 3.0);

            // Matrix rendering already handles base appearance.
        }
    }
}


// Start loop with bulletproof readyState check
function initGame() {
    const engine = new GameEngine();
    function gameLoop() {
        engine.update();
        engine.render();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
} else {
    window.addEventListener('DOMContentLoaded', initGame);
}
