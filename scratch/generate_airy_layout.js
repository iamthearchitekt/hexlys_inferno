/**
 * THE BLACK GALE — Level 2 Layout v3
 * ====================================
 * Design: "Three Waves" — the level undulates in 3 clear crests.
 * 
 * Physics:
 *   max jump height ≈ 5 rows (216px)  |  tile = 45px
 *   same-height gap: safe ≤ 4 cols    |  with wind (-0.05/frame)
 *   up-1-row gap:    safe ≤ 3 cols
 *   down-1-row gap:  safe ≤ 5 cols
 *
 * Platform chain: each entry = [row, colStart, colEnd, tileType]
 * Every gap between consecutive platforms is verified against the limits above.
 * Shard arcs are auto-generated at each gap midpoint to act as visual crumbs.
 */

const fs  = require('fs');
const E=0,GR=1,CH=2,BK=3,RW=4,LV=5,PR=6,SH=7,SK=8,IM=9,CR=10,BS=13,FL=14,UP=15;

const grid = Array.from({length:12}, () => Array(320).fill(E));
const s  = (r,c,t) => { if(r>=0&&r<12&&c>=0&&c<320) grid[r][c]=t; };
const row = (r,c0,c1,t) => { for(let c=c0;c<=c1;c++) s(r,c,t); };
const box = (r0,r1,c0,c1,t) => { for(let r=r0;r<=r1;r++) row(r,c0,c1,t); };

// ── Ground anchors ─────────────────────────────────────────────────────────
box(8,11,  0, 13, GR);          // Start
box(8,11,271,319, GR);          // End Boss Arena (49 cols wide)
s(7, 312, PR);                  // Portal
box(9,11, 14,319, LV);          // Lava ocean

// ── Platform chain ─────────────────────────────────────────────────────────
// Each platform is reachable from the previous using verified physics limits.
// The profile forms three gentle waves:
//   Wave 1 (ASCENT cols 14→66):   row 8 ground → row 4
//   Wave 1 (DESCENT cols 67→99):  row 4 → row 6
//   Wave 2 (ASCENT cols 92→131):  row 6 → row 3  ← CREST 1
//   Wave 2 (DESCENT cols 132→153):row 3 → row 5
//   Wave 3 (ASCENT cols 154→187): row 5 → row 3  ← CREST 2
//   Wave 3 (DESCENT cols 188→225):row 3 → row 5
//   FINAL  (ASCENT cols 215→237): row 5 → row 3  ← CREST 3 (grand peak)
//   DESCENT cols 238→270:         row 3 → row 6
const PLATS = [
//  [row, c0,  c1,  type ]   gap  Δrow  check
  [  7,  14,  19,  GR   ],  //  1   -1   trivial first hop from ground
  [  6,  23,  28,  CH   ],  //  3   up1  ✓ (safe ≤3)
  [  5,  32,  37,  CH   ],  //  3   up1  ✓
  [  5,  41,  47,  CH   ],  //  3   =    ✓ (safe ≤4)
  [  4,  51,  56,  CH   ],  //  3   up1  ✓
  [  4,  60,  66,  FL   ],  //  3   =    ✓  ← first FALLING platform
  // descent to valley
  [  5,  71,  77,  CH   ],  //  4   dn1  ✓ (safe ≤5)
  [  6,  82,  88,  CH   ],  //  4   dn1  ✓  valley 1
  // re-ascent to Crest 1
  [  5,  92,  98,  CH   ],  //  3   up1  ✓
  [  4, 102, 108,  CH   ],  //  3   up1  ✓
  [  3, 112, 119,  CH   ],  //  3   up1  ✓  ← CREST 1
  [  3, 124, 131,  CH   ],  //  4   =    ✓  plateau at crest
  // descent to valley 2
  [  4, 136, 142,  FL   ],  //  4   dn1  ✓  ← FALLING descent
  [  5, 147, 153,  CH   ],  //  4   dn1  ✓  valley 2
  // re-ascent to Crest 2
  [  4, 157, 164,  CH   ],  //  3   up1  ✓
  [  3, 168, 175,  CH   ],  //  3   up1  ✓  ← CREST 2
  [  3, 180, 187,  FL   ],  //  4   =    ✓  ← FALLING at crest 2
  // descent to valley 3
  [  4, 192, 199,  CH   ],  //  4   dn1  ✓
  [  5, 204, 211,  CH   ],  //  4   dn1  ✓  valley 3
  // final ascent to Grand Peak
  [  4, 215, 223,  CH   ],  //  3   up1  ✓
  [  3, 227, 237,  CH   ],  //  3   up1  ✓  ← GRAND PEAK (widest)
  // final descent to end ground
  [  4, 242, 249,  CH   ],  //  4   dn1  ✓
  [  5, 254, 260,  CH   ],  //  4   dn1  ✓
  [  6, 264, 269,  CH   ],  //  3   dn1  ✓  step to end ground
];

PLATS.forEach(([r,c0,c1,t]) => row(r,c0,c1,t));

// ── Shard arcs — auto-placed at midpoint of every gap ─────────────────────
// Creates a dotted trail the player's eye can follow to the next platform.
for (let i = 0; i < PLATS.length - 1; i++) {
  const [rA,,c1] = PLATS[i];
  const [rB,c0]  = PLATS[i+1];
  const midC = Math.round((c1 + c0) / 2);
  // Raise shard height closer to jump apex so they don't clip through feet
  const arcHeight = Math.min(rA, rB) - 1;
  s(arcHeight, midC-1, SH);
  s(arcHeight, midC+1, SH);
}
// Guiding shards from the start ground to P1
s(7, 11, SH); s(7, 12, SH);
// Trailing shard from P24 to end ground
s(6, 270, SH);

// ── Reward blocks ─────────────────────────────────────────────────────────
// Rule: place at platform_row - 2 so the player bumps them from below
// while STANDING on that platform. Only placed above wide valley platforms
// where the player has room and a natural urge to jump upward.

// Above P4 (row 5, cols 41-47) → rewards at row 1
s(1, 43, RW); s(1, 46, RW);

// Above P8 — valley 1 (row 6, cols 82-88) → rewards at row 2
// Player rests here and instinctively jumps up to explore above them
s(2, 84, RW); s(2, 87, RW);

// Above P12 — plateau at Crest 1 (row 3, cols 124-131) → rewards at row 0
// Player is at the first peak — a bonus jump reward feels satisfying here
s(0, 126, RW); s(0, 129, RW);

// Above P14 — valley 2 (row 5, cols 147-153) → rewards at row 1
s(1, 149, RW); s(1, 152, RW);

// Above P19 — valley 3 (row 5, cols 204-211) → rewards at row 1
s(1, 206, RW); s(1, 209, RW);

// ── Secret 1-UP ────────────────────────────────────────────────────────────
// Above the grand peak P21 (row 3, cols 227-237) at row 0 midpoint
// The player can jump from the peak and hit it — subtle but findable
s(0, 232, UP);

// ── Enemies ────────────────────────────────────────────────────────────────
// Each enemy placed exactly 1 row ABOVE its platform (platform_row - 1).
// Never more than one enemy per platform — wind is the main challenge.

// P1 (row 7): crawler — teaches enemy avoidance early, easy to dodge
s(6, 17, CR);

// P4 (row 5): skeleton — first proper combat encounter, flat platform = fair
s(4, 44, SK);

// P8 valley (row 6): skeleton — guards the low valley rest spot
s(5, 85, SK);

// P11 crest 1 (row 3): skeleton — reward for reaching the first peak
s(2, 116, SK);

// P17 crest 2 (row 3): skeleton — second peak guardian
s(2, 183, SK);

// P21 grand peak (row 3): skeleton — final ground enemy encounter
s(2, 233, SK);

// Flying imps — suspended mid-air over gaps, can't be avoided only dodged
s(3,  79, IM);   // valley 1 gap (P7→P8)
s(2, 121, IM);   // crest 1 gap  (P11→P12)
s(2, 155, IM);   // valley 2 gap (P14→P15)
s(2, 225, IM);   // grand peak approach (P20→P21)

// ── Boss ───────────────────────────────────────────────────────────────────
// Boss guards the massive flat arena at the end before the portal.
s(7, 295, BS);

// ── Write to levels.js ─────────────────────────────────────────────────────
const file = fs.readFileSync('levels.js', 'utf8');
const needle = 'name: "The Black Gale",\n        background: "background2.jpg",\n        disableEnemyFireballs: true,\n        windForce: -0.05,\n        startX: 80,\n        startY: 300,\n        layout: ';
const idx = file.indexOf(needle);
if (idx === -1) { console.error('Cannot find Level 2 block!'); process.exit(1); }
const after = idx + needle.length;
let open=0, end=-1;
for (let i=after; i<file.length; i++) {
  if (file[i]==='[') open++;
  else if (file[i]===']') { open--; if(open===0){end=i+1;break;} }
}
const fmt = '[\n'+grid.map(r=>'            ['+r.join(',')+']').join(',\n')+'\n        ]';
fs.writeFileSync('levels.js', file.slice(0,after)+fmt+file.slice(end), 'utf8');

// Summary
const counts={};
for(let r=0;r<12;r++) for(let c=0;c<320;c++){const t=grid[r][c];counts[t]=(counts[t]||0)+1;}
console.log('✓ Level 2 written');
console.log('  Platforms: CHAIN=%d  FALLING=%d  GROUND=%d', counts[2]||0, counts[14]||0, counts[1]||0);
console.log('  Enemies:   SK=%d  IMP=%d  CRAWLER=%d', counts[8]||0, counts[9]||0, counts[10]||0);
console.log('  Pickups:   SHARD=%d  REWARD=%d  ONEUP=%d', counts[7]||0, counts[4]||0, counts[15]||0);
console.log('  Portal:', counts[6]||0);
