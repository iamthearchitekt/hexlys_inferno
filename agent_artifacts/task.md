# Task List - game.js Updates

- `[x]` 1. Implement Surgical Sprite Preprocessor
  - `[x]` Create `cleanSpriteCanvas` utility function.
  - `[x]` Integrate and cache cleaned canvases in `drawSpriteAutoTrimmed`.
- `[x]` 2. Update Falling Platform Width & Delay in `LEVEL_DATA`
  - `[x]` Replace single `14` tiles with adjacent `14, 14` tiles in `LEVEL_DATA` rows 3, 4, 5.
  - `[x]` Update `platformTimers` delay to 150 frames.
  - `[x]` Implement cohesive adjacent platform trigger in `resolveCollisions`.
  - `[x]` Implement cohesive platform expiry in `update`.
- `[x]` 3. Enlarge Winged Imp Sprites
  - `[x]` Change `width` to `120` and `height` to `86` for `FIRE_IMP` in `Enemy` constructor.
- `[x]` 4. Restrict Boss Arena & Invisibility
  - `[x]` Update `Boss.update` to require `engine.player.x >= 8000` and restrict minimum `x` to `8450`.
  - `[x]` Update `Boss.draw` to hide boss if `player.x < 8000`.
- `[x]` 5. Seamless Parallax Background Stitching
  - `[x]` Apply `this.width + 1` and overlapping drawing coordinates in `ParallaxBackground.draw`.
