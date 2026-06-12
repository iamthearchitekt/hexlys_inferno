/**
 * THE BLOOD MARSHES — Level 5 Layout
 * ==================================
 * Deep, dangerous blood-swamps mixed with ancient ruins and diverse platforming.
 */

const fs  = require('fs');
const E=0,GR=1,CH=2,BK=3,RW=4,LV=5,PR=6,SH=7,SK=8,IM=9,CR=10,BS=13,FL=14,UP=15,SW=16;

const grid = Array.from({length:12}, () => Array(320).fill(E));
const s  = (r,c,t) => { if(r>=0&&r<12&&c>=0&&c<320) grid[r][c]=t; };
const row = (r,c0,c1,t) => { for(let c=c0;c<=c1;c++) s(r,c,t); };
const box = (r0,r1,c0,c1,t) => { for(let r=r0;r<=r1;r++) row(r,c0,c1,t); };

// ── Blood Swamp Floor ───────────────────────────────────────────────────────
// Most of the floor is a deep swamp, but we'll break it up with solid landmasses
box(9, 11, 0, 319, SW);

// Start Area: Safe landing zone
box(7, 11, 0, 20, GR);

// ── Section 1: The Ruins (cols 30-80) ──────────────────────────────────────
// A solid landmass with walls and empty spaces to jump through
box(8, 11, 30, 80, GR);

// First Ruin Wall
box(4, 7, 40, 42, GR);

// Elevated ruins
row(5, 50, 56, GR);

// Second Ruin Wall
box(4, 7, 75, 78, GR);
box(4, 5, 73, 74, GR); // Solid top over door

// Adding some new stairs here!
box(7, 11, 32, 35, GR); // stair up
box(7, 11, 46, 48, GR); // stair inside ruin
row(3, 56, 60, GR);
s(7, 53, SK);
s(7, 68, SK);
s(7, 75, SK);

// Second Ruin Wall
box(4, 7, 75, 78, GR);

// ── Section 2: Precarious Chains (cols 90-130) ─────────────────────────────
// Deep swamp with no islands, only high chain platforms
row(6,  90,  92, CH);
row(4, 100, 102, CH);
row(5, 110, 112, CH);
row(3, 120, 122, CH);

// Put some shards above the chains
s(4,  91, SH);
s(2, 101, SH);
s(3, 111, SH);
s(1, 121, SH);

// ── Section 3: The Falling Towers (cols 140-190) ───────────────────────────
// Thin columns of ground separated by small gaps, but the tops are falling platforms
box(8, 11, 140, 142, GR);
row(7, 140, 142, FL);

box(8, 11, 150, 152, GR);
row(6, 150, 152, FL);

box(8, 11, 160, 162, GR);
row(5, 160, 162, FL);

box(8, 11, 175, 178, GR);
row(4, 175, 178, FL);

// ── Section 4: The Swamp Gauntlet (cols 200-260) ───────────────────────────
// A long stretch of swamp where the player is forced to use Swamp Burst double jumps
// between low mudbanks while avoiding scattered breakable obstacles
box(9, 11, 200, 204, GR);
box(9, 11, 218, 222, GR);
box(9, 11, 236, 240, GR);
box(9, 11, 254, 258, GR);

// Skeletons on the mudbanks
s(8, 202, SK);
s(8, 220, SK);
s(8, 238, SK);
s(8, 256, SK);

// ── End Boss Arena (cols 270+) ─────────────────────────────────────────────
box(8, 11, 270, 319, GR);
s(7, 312, PR); 
s(7, 295, BS);

// ── Enemies (Flying Imps) ──────────────────────────────────────────────────
// Only place them in the ruins and chain sections so they don't ruin the swamp gauntlet
s(1, 52, IM); // High above the elevated ruins ledge
s(2, 65, IM); // Placed in the flat section between ruins
s(1, 96, IM); // High above the chains
s(2, 115, IM);

// ── Write to levels.js ─────────────────────────────────────────────────────
const file = fs.readFileSync('levels.js', 'utf8');
const searchString = 'name: "The Blood Marshes",';
const idx = file.indexOf(searchString);
if (idx === -1) { console.error('Cannot find Level 5 block!'); process.exit(1); }

const layoutIdx = file.indexOf('layout: ', idx);
const after = layoutIdx + 'layout: '.length;

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

console.log('✓ Level 5 Dynamic Layout written');
