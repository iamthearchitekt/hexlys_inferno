/**
 * THE INFERNAL TREASURY — Level 4 Layout
 * ======================================
 * An easy bonus level filled with Skeletons and Soul Shards.
 * Solid ground floor, no abyss, no lava. Shifted 2 tiles higher!
 */

const fs  = require('fs');
const E=0,GR=1,CH=2,BK=3,RW=4,LV=5,PR=6,SH=7,SK=8,IM=9,CR=10,BS=13,FL=14,UP=15,SW=16,BD=18;

const grid = Array.from({length:12}, () => Array(320).fill(E));
const s  = (r,c,t) => { if(r>=0&&r<12&&c>=0&&c<320) grid[r][c]=t; };
const row = (r,c0,c1,t) => { for(let c=c0;c<=c1;c++) s(r,c,t); };
const box = (r0,r1,c0,c1,t) => { for(let r=r0;r<=r1;r++) row(r,c0,c1,t); };

// ── Solid Ground Floor ──────────────────────────────────────────────────────
box(8, 11, 0, 319, GR); // Floor raised by 2 tiles!

// ── Terrain / Stairs ────────────────────────────────────────────────────────
// Add some blocky staircases and platforms to make it look like a forge/mine
box(6, 11, 30, 48, GR);
box(5, 11, 46, 48, GR); // stair down
box(4, 11, 60, 78, GR);
box(3, 11, 60, 62, GR); // stair up
box(6, 11, 90, 108, GR);
box(5, 11, 106, 108, GR); // stair down

// Stepping stones leading up to the vault
box(5, 11, 115, 120, GR); 
box(3, 11, 124, 129, GR); 

box(2, 11, 130, 150, GR); // Big central vault platform

// Stepping stones leading down from the vault
box(3, 11, 151, 156, GR); 
box(5, 11, 160, 165, GR); 

box(6, 11, 180, 210, GR);
box(4, 11, 240, 260, GR);

// ── Reward Blocks ───────────────────────────────────────────────────────────
s(3, 37, RW);
s(1, 67, RW);
s(3, 97, RW);
s(0, 140, RW); // Placed at top edge of vault
s(3, 195, RW);
s(1, 250, RW);

// ── Massive Soul Shard Hoards ──────────────────────────────────────────────
// Floor shards
for (let c = 10; c < 300; c += 2) {
    if (grid[7][c] === E) s(7, c, SH);
}

// Platform shards
row(5, 31, 44, SH);
row(3, 61, 74, SH);
row(5, 91, 104, SH);
row(4, 115, 120, SH); // Stair shards
row(2, 124, 129, SH); // Stair shards
row(1, 131, 149, SH);
row(2, 151, 156, SH); // Stair shards
row(4, 160, 165, SH); // Stair shards
row(5, 181, 209, SH);
row(3, 241, 259, SH);

// Shard Arcs between platforms
row(5, 46, 59, SH);
row(3, 48, 57, SH);

row(3, 76, 89, SH);

row(4, 106, 129, SH);
row(2, 110, 125, SH);

row(4, 151, 179, SH);

row(5, 211, 239, SH);

// ── Skeletons (Lots of them!) ──────────────────────────────────────────────
for (let c = 15; c < 280; c += 10) {
    if (grid[7][c] === SH) {
        s(7, c, SK); // Replace shard with skeleton on floor
    }
}
// Add skeletons to the tops of platforms
s(5, 35, SK);
s(5, 40, SK);
s(3, 65, SK);
s(3, 70, SK);
s(5, 95, SK);
s(5, 100, SK);
s(1, 135, SK);
s(1, 145, SK);
s(5, 190, SK);
s(5, 200, SK);
s(3, 245, SK);
s(3, 255, SK);

// ── End Boss / Portal ──────────────────────────────────────────────────────
s(7, 295, BS);
box(6, 11, 310, 319, GR);
s(5, 315, PR);

// ── Boulders ───────────────────────────────────────────────────────────────
s(5, 45, BD);
s(3, 75, BD);
s(5, 105, BD);
s(1, 148, BD);
s(5, 205, BD);
s(3, 258, BD);

// ── Write to levels.js ─────────────────────────────────────────────────────
const file = fs.readFileSync('levels.js', 'utf8');
const searchString = 'name: "The Infernal Treasury",';
const idx = file.indexOf(searchString);
if (idx === -1) { console.error('Cannot find Level 4 block!'); process.exit(1); }

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

console.log('✓ Level 4 Treasury Layout written');
