const SPRITES = {
    // HEXLY: { IDLE: [["."]], HURT: [["."]], WIN: [["."]], JUMP: [["."]], RUN_A: [["."]], RUN_B: [["."]] },
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
