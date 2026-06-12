/**
 * THE FILTH MIRE — Level 3 Swamp Layout
 * =====================================
 * Features a deep sticky swamp at the bottom instead of lava.
 * The player can fall in without dying, but jumping out is difficult.
 * Low emergency platforms allow them to escape.
 */

const fs  = require('fs');
const E=0,GR=1,CH=2,BK=3,RW=4,LV=5,PR=6,SH=7,SK=8,IM=9,CR=10,BS=13,FL=14,UP=15,SW=16;

const grid = Array.from({length:12}, () => Array(320).fill(E));
const s  = (r,c,t) => { if(r>=0&&r<12&&c>=0&&c<320) grid[r][c]=t; };
const row = (r,c0,c1,t) => { for(let c=c0;c<=c1;c++) s(r,c,t); };
const box = (r0,r1,c0,c1,t) => { for(let r=r0;r<=r1;r++) row(r,c0,c1,t); };

// ── Ground Islands & Swamp ──────────────────────────────────────────────────
// Base swamp liquid
box(10,11, 11,270, SW);

// Start platform bank
box(8,11,  0, 15, GR);          

// End Boss Arena bank
box(8,11,271,319, GR);          
s(7, 312, PR);                  

// Instead of floating platforms, we generate solid muddy islands (GR)
// that rise out of the swamp.
const ISLANDS = [
    // [top_row, col_start, col_end, stair_col]
    [8,  22,  30, 28], // gap 15-22 (7)
    [7,  36,  43, -1], // gap 29-36 (7)
    [6,  51,  58, 51], // gap 43-51 (8)
    [8,  64,  75, 73], // gap 57-64 (7)
    [7,  83,  90, -1], // gap 75-83 (8)
    [6,  97, 106, 97], // gap 90-97 (7)
    [5, 112, 118, -1], // gap 104-112 (8)
    [8, 126, 137, 135], // gap 118-126 (8)
    [7, 145, 153, -1], // gap 137-145 (8)
    [7, 161, 168, -1], // gap 153-161 (8)
    [6, 176, 185, 176], // gap 168-176 (8)
    [8, 192, 203, 201], // gap 184-192 (8)
    [6, 211, 219, -1], // gap 203-211 (8)
    [5, 227, 233, -1], // gap 219-227 (8)
    [4, 241, 248, 241], // gap 233-241 (8)
    [6, 256, 262, -1], // gap 248-256 (8)
    [8, 268, 271, -1], // gap 262-268 (6) -> step to boss at 272
];

// Draw islands down to the swamp floor (row 11) to make them solid landmasses
ISLANDS.forEach(([r, c0, c1, stair]) => {
    box(r, 11, c0, c1, GR);
    if (stair && stair !== -1) {
        box(r-1, 11, stair, stair+1, GR); // Add a staircase step
    }
});

// Emergency Swamp Escapes
// Wading in the swamp heavily nerfs jump height. These low row 9 and 10 mudbanks 
// allow the player to climb out if they miss a massive 8-tile gap.
for (let c = 18; c < 265; c += 12) {
    if (grid[9][c] === SW) { // Only place if it's currently swamp (don't overwrite islands)
        box(9, 11, c, c+1, GR);
    }
}

// ── Mid-air Falling Platforms ──────────────────────────────────────────────
// Placed in the center of the massive 7 and 8 tile gaps to allow precision crossing
row(7,  32,  33, FL);
row(6,  46,  47, FL);
row(7,  78,  79, FL);
row(6, 107, 108, FL);
row(7, 140, 141, FL);
row(7, 156, 157, FL);
row(6, 171, 172, FL);
row(6, 206, 207, FL);
row(5, 222, 223, FL);
row(4, 236, 237, FL);

// ── Shard arcs ─────────────────────────────────────────────────────────────
for (let i = 0; i < ISLANDS.length - 1; i++) {
  const [rA,,c1] = ISLANDS[i];
  const [rB,c0]  = ISLANDS[i+1];
  const midC = Math.round((c1 + c0) / 2);
  const arcHeight = Math.min(rA, rB) - 1;
  s(arcHeight, midC-1, SH);
  s(arcHeight, midC+1, SH);
}

// ── Rewards ───────────────────────────────────────────────────────────────
// Raised to provide at least ~50px clearance above the player's 82px tall head
// Max jump is ~5 tiles. So place at (island_row - 4)
s(4,  25, RW); // Island at row 8
s(4,  69, RW); // Island at row 8
s(4, 128, RW); // Island at row 8
s(0, 240, RW); // Highest peak at row 4

// ── Enemies ────────────────────────────────────────────────────────────────
// Skeletons on flat islands (must be at island_row - 1)
s(7,  25, SK); // Island at row 8
s(7,  69, SK); // Island at row 8
s(7, 128, SK); // Island at row 8
s(5, 176, SK); // Island at row 6
s(5, 212, SK); // Island at row 6

// Flying Imps to force tricky jumps over the swamp
s(4,  45, IM); // Gap 42-48
s(4,  90, IM); // Gap 88-93
s(4, 119, IM); // Gap 115-122
s(4, 167, IM); // Gap 164-170
s(5, 201, IM); // Gap 198-205

// ── Boss ───────────────────────────────────────────────────────────────────
s(7, 295, BS);

// ── Write to levels.js ─────────────────────────────────────────────────────
const file = fs.readFileSync('levels.js', 'utf8');
const needle = 'name: "The Filth Mire",\n        background: "background3.jpg",\n        disableEnemyFireballs: true,\n        startX: 80,\n        startY: 300,\n        layout: ';
const idx = file.indexOf(needle);
if (idx === -1) { console.error('Cannot find Level 3 block!'); process.exit(1); }
const after = idx + needle.length;

// Find where the layout array ends
let open=0, end=-1;
for (let i=after; i<file.length; i++) {
  if (file[i]==='[') open++;
  else if (file[i]===']') { 
      open--; 
      if(open===0){
          end=i+1;
          break;
      } 
  }
}

const fmt = '[\n'+grid.map(r=>'            ['+r.join(',')+']').join(',\n')+'\n        ]';
fs.writeFileSync('levels.js', file.slice(0,after)+fmt+file.slice(end), 'utf8');

// Summary
const counts={};
for(let r=0;r<12;r++) for(let c=0;c<320;c++){const t=grid[r][c];counts[t]=(counts[t]||0)+1;}
console.log('✓ Level 3 Swamp Layout written');
console.log('  Swamp tiles: ', counts[SW]||0);
console.log('  Platforms: CHAIN=%d  FALLING=%d', counts[2]||0, counts[14]||0);
