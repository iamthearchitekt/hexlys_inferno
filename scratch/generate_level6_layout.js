/**
 * THE BURNING NECROPOLIS — Level 6 Layout
 * ========================================
 * Lava hazards, breakable mausoleums, and skeletons firing projectiles.
 */

const fs  = require('fs');
const E=0,GR=1,CH=2,BK=3,RW=4,LV=5,PR=6,SH=7,SK=8,IM=9,CR=10,BS=13,FL=14,UP=15,SW=16;

const grid = Array.from({length:12}, () => Array(320).fill(E));
const s  = (r,c,t) => { if(r>=0&&r<12&&c>=0&&c<320) grid[r][c]=t; };
const row = (r,c0,c1,t) => { for(let c=c0;c<=c1;c++) s(r,c,t); };
const box = (r0,r1,c0,c1,t) => { for(let r=r0;r<=r1;r++) row(r,c0,c1,t); };

// ── Lava Floor ──────────────────────────────────────────────────────────────
box(10, 11, 0, 319, LV);

// Start Area
box(8, 11, 0, 17, GR);
box(7, 11, 14, 17, GR); // stair

// ── Section 1: The Mausoleum Entrances (cols 20-90) ────────────────────────
// Solid ground with breakable walls and skeleton guards
box(8, 11, 22, 45, GR);
box(7, 11, 22, 24, GR); // stair
// Mausoleum 1
box(5, 7, 28, 28, BK); // Left Breakable Door
box(4, 4, 28, 36, GR); // Roof
box(5, 7, 36, 36, BK); // Right Breakable Door
s(7, 32, SK); // Skeleton inside
s(7, 42, SK); // Skeleton outside

box(8, 11, 55, 87, GR);
box(7, 11, 84, 87, GR); // stair down
// Mausoleum 2 (Two floors)
box(3, 4, 60, 60, BK); // Top left breakable door
box(6, 7, 60, 60, BK); // Bottom left breakable door
box(2, 2, 60, 71, GR); // Top roof
box(5, 5, 61, 70, GR); // Middle floor
box(3, 4, 71, 71, BK); // Top right breakable door
box(6, 7, 71, 71, BK); // Bottom right breakable door
s(7, 66, SK); // Skeleton bottom
s(4, 66, SK); // Skeleton top

// ── Section 2: Falling Ash Over Lava (cols 90-155) ─────────────────────────
row(8, 92, 94, FL);
row(7, 99, 101, FL);
row(6, 106, 108, FL);
s(3, 102, IM);
row(5, 113, 115, FL);
row(4, 120, 122, FL);
row(5, 127, 129, FL);
s(3, 124, IM);
row(6, 134, 136, FL);
row(7, 141, 143, FL);
row(8, 148, 150, FL);
row(8, 155, 157, FL);

// ── Section 3: The Grand Tombs (cols 160-230) ──────────────────────────────
box(8, 11, 162, 180, GR);
box(7, 11, 162, 164, GR); // stair
// Huge Tomb
box(3, 7, 165, 166, BK); // Left Huge breakable door
box(2, 2, 165, 177, GR); // Roof
box(3, 7, 176, 177, BK); // Right Huge breakable door
s(7, 170, SK);
s(7, 173, SK);

box(8, 11, 190, 230, GR);
// Skeletons patrolling
s(7, 195, SK);
s(7, 210, SK);
s(7, 225, SK);

// Hovering Imps above the tomb roofs
s(2, 185, IM);
s(2, 205, IM);

// ── Section 4: Crumbling Bridges (cols 235-295) ────────────────────────────
row(8, 235, 238, FL);
row(8, 243, 246, FL);
row(8, 251, 254, FL);
s(4, 245, IM);

row(7, 259, 262, FL);
row(7, 267, 270, FL);
row(7, 275, 278, FL);
s(3, 268, IM);

row(6, 283, 286, FL);
row(6, 291, 294, FL);

// ── End Boss Arena (cols 300+) ─────────────────────────────────────────────
box(8, 11, 300, 319, GR);
s(7, 312, PR); 
s(7, 295, BS);

// ── Rewards (Soul Shards) ──────────────────────────────────────────────────
row(3, 31, 35, SH); // Inside Mausoleum 1
row(6, 104, 106, SH); // Above falling block
row(4, 135, 137, SH);
row(1, 167, 175, SH); // On top of Grand Tomb

// ── Write to levels.js ─────────────────────────────────────────────────────
const file = fs.readFileSync('levels.js', 'utf8');
const searchString = 'name: "The Burning Necropolis",';
const idx = file.indexOf(searchString);
if (idx === -1) { console.error('Cannot find Level 6 block!'); process.exit(1); }

const layoutIdx = file.indexOf('layout: ', idx);
const after = layoutIdx + 'layout: '.length;

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

console.log('✓ Level 6 Necropolis Layout written');
