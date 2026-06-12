// Audio Engine Init
const synth = new AudioSynth();
window.synth = synth;

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
        // SWAMP_A/B/C: Highly detailed 3-frame animated bubbling toxic slime.
        SWAMP_A: [
            "tuuvtttvut",
            "uvzvuuvutu",
            "vzzzvuttuv",
            "uvzvuuttvk",
            "tuuuttvvzz",
            "vuttuvtvzv",
            "kvuuttutvv",
            "vvuutuuutu",
            "tuuvttkuvv",
            "vttuutvkvt"
        ],
        SWAMP_B: [
            "tuuvtttvut",
            "ukzkuuvutu",
            "kzzzkuttuv",
            "ukzkuuttvz",
            "tuuuttvkzz",
            "vuttuvtzzv",
            "vvuuttutkz",
            "uvuutuuutu",
            "tuuvttzuvv",
            "vttuutvzvt"
        ],
        SWAMP_C: [
            "tuuvtttvut",
            "uvvvuuvutu",
            "vvkvvuttuv",
            "uvvvuuttvv",
            "tuuuttvuvv",
            "vuttuvtvvv",
            "uuuuttutuv",
            "tuuutuuutu",
            "tuuvttvuvv",
            "vttuutvvvt"
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

// 5. TILE ENGINE & MAP LAYOUT (12 Rows, Negative Space Fixed)
// ----------------------------------------------------
const ghostIdleImg = new Image();
ghostIdleImg.src = 'sprites/ghost_idle.png';
const ghostMoveImg = new Image();
ghostMoveImg.src = 'sprites/ghost_move.png';

const TILE_SIZE = 45; // 45px Tiles (12 Rows fits exactly 540px Height)
const TILES = {
    EMPTY: 0,
    GROUND: 1,
    PLATFORM: 2,
    BREAKABLE: 3,
    REWARD: 4,
    LAVA: 5,
    PORTAL: 6,
    GHOST: 15,
    SPENT_REWARD: 11,
    BOSS: 13,
    FALLING_PLATFORM: 14,
    SWAMP: 16,
    BOG_ZOMBIE: 17,
    ONE_UP: 18
};

// 12-Row Map Data (7 = Coin, 8 = Skelly Bug, 9 = Winged Skull, 10 = Spine Crawler, 12 = Lava Flower Powerup)
const activeLevel = [
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
