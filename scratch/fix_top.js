const fs = require('fs');

const missingHeader = `/**
 * HEXLY'S INFERNO ESCAPE - 16-Bit SNES Super Size & Fireball Overhaul
 * A complete retro platformer engine built in HTML5 Canvas and Web Audio API.
 * Features 45px tiles (12 rows), skeletal enemies, Fire power-up, and 2-layer parallax.
 */

// ----------------------------------------------------
// 1. RETRO 16-BIT NINTENDO COLOR PALETTE & RENDERER
// ----------------------------------------------------
const hexlyImg = new Image();
let hexlyImgLoaded = false;
hexlyImg.onload = () => { hexlyImgLoaded = true; };
hexlyImg.src = 'hexly.png';

const hexlyWalk2Img = new Image();
let hexlyWalk2ImgLoaded = false;
hexlyWalk2Img.onload = () => { hexlyWalk2ImgLoaded = true; };
hexlyWalk2Img.src = 'hexly_walk2.png';

const hexlyJumpImg = new Image();
let hexlyJumpImgLoaded = false;
hexlyJumpImg.onload = () => { hexlyJumpImgLoaded = true; };
hexlyJumpImg.src = 'hexly_jump.png';

const hexlyCrouchImg = new Image();
let hexlyCrouchImgLoaded = false;
hexlyCrouchImg.onload = () => { hexlyCrouchImgLoaded = true; };
hexlyCrouchImg.src = 'hexly_crouch.png';

const hexlyProjectileImg = new Image();
let hexlyProjectileImgLoaded = false;
hexlyProjectileImg.onload = () => { hexlyProjectileImgLoaded = true; };
hexlyProjectileImg.src = 'hexly_projectile.png';

const skeletonImg = new Image();
let skeletonImgLoaded = false;
skeletonImg.onload = () => { skeletonImgLoaded = true; };
skeletonImg.src = 'skeleton.png';

const bgImg = new Image();
let bgImgLoaded = false;
bgImg.onload = () => { bgImgLoaded = true; };
bgImg.src = 'background.png';

const flameImg = new Image();
let flameImgLoaded = false;
flameImg.onload = () => { flameImgLoaded = true; };
flameImg.src = 'flame.png';

const portalImg = new Image();
let portalImgLoaded = false;
portalImg.onload = () => { portalImgLoaded = true; };
`;

let content = fs.readFileSync('game.js', 'utf8');

// if the top of the file already has the comment block, we shouldn't double prepend.
// But we know it starts exactly at portalImg.src = 'portal.png';
if (content.startsWith("portalImg.src = 'portal.png';")) {
    fs.writeFileSync('game.js', missingHeader + content);
    console.log("Successfully repaired game.js top.");
} else {
    console.log("game.js doesn't start with portalImg.src. Let's not blindly prepend.");
}
