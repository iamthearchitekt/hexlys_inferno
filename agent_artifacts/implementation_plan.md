# Implementation Plan - Retro Adjustments for Falling Platforms, Winged Imps, Boss Boundary, and Seamless Parallax

This plan outlines changes to `game.js` to refine the falling platform width, winged imp scaling, boss activation/boundaries, and seamless parallax background stitching.

## User Review Required

> [!IMPORTANT]
> **Surgical Sprite Outline Cleaning:** We are introducing a pixel-level image preprocessor (`cleanSpriteCanvas`) that runs on the Canvas after Hexly's sprites and other character frames load. It scans the pixels, detects light/white anti-aliasing halo pixels (RGB > 200) adjacent to transparent boundaries (alpha < 50), and sets their opacity to 0. Since Hexly's white eyes are fully enclosed by solid black lines, they will remain untouched, while all outer white outlines will be surgically deleted.
>
> **Parallax Seamless Stitching:** We are introducing a 1-pixel overlap (`this.width + 1` and corresponding coordinate shifts) when drawing the parallax background layers on the Canvas. This prevents sub-pixel gaps or rendering artifacts (flickering lines) from showing at the seams during camera movement.
>
> **Falling Platforms Width:** We are replacing the single-tile falling platforms in `LEVEL_DATA` with two-tile wide platforms. To make them feel cohesive, standing on either tile will trigger both tiles to shake and fall simultaneously as a single platform.
>
> **Boss Activation & Boundary:** The boss is spawned at $x = 8550$px. We will keep him completely invisible and inactive until Hexly approaches $x = 8000$px (entering the boss arena approach). Once active, the boss's movement will be strictly restricted to $x \ge 8450$px to prevent him from pacing back into the rest of the level.

## Proposed Changes

### Platformer Mechanics & Rendering

#### [MODIFY] [game.js](file:///C:/Users/archi/.gemini/antigravity/scratch/hexlys_inferno/game.js)

1. **Surgical Sprite Preprocessor:**
   - Implement `cleanSpriteCanvas(image)` which takes a loaded `Image`, draws it offscreen, scans for light/white edge pixels (RGB > 200) adjacent to transparency (alpha < 50), and removes them.
   - Integrate this preprocessor in `drawSpriteAutoTrimmed(ctx, image, ...)` so that it processes Hexly's sprite frames (`hexly.png`, `hexly_walk2.png`, `hexly_jump.png`, `hexly_crouch.png`) and other relevant character sprites once on load, caching the clean Canvas representation.

2. **Double-width Falling Platforms in `LEVEL_DATA`:**
   - In the rows containing falling platforms (`LEVEL_DATA` rows 3, 4, and 5), replace single `14` tiles with adjacent `14, 14` tiles.
   - For example, in row 3, change `..., 14, 0, 0, 14, 0, 0, 14, ...` to `..., 14, 14, 0, 14, 14, 0, 14, 14, ...`.

3. **Unified Falling Platform Timer Trigger:**
   - In `resolveCollisions()` when checking `t === TILES.FALLING_PLATFORM`, if `platformTimers[`c,r`]` is started, automatically scan and start the timer for horizontally adjacent falling platform tiles `(c-1, r)` and `(c+1, r)`.
   - In `update()`, when the timer for `(c, r)` expires, also check and expire the timer for horizontally adjacent tiles so they convert to `FallingPlatformEntity` simultaneously.
   - Slightly increase the delay before dropping from 120 frames (2 seconds) to 150 frames (2.5 seconds) to accommodate the longer platform size.

4. **Enlarge Winged Imp Sprites:**
   - In the `Enemy` class constructor, for `FIRE_IMP`, increase `this.width` from `98` to `120` and `this.height` from `70` to `86`.

5. **Boss Arena Restrictions (Invisible & Boundary Constraint):**
   - In the `Boss` class `update()` method:
     - Check if `engine.player.x < 8000`. If so, skip updating (keeping the boss completely static and inactive).
     - Once active (`player.x >= 8000`), enforce a lower boundary limit on `this.x` so it cannot go left of `8450` (`this.x = Math.max(8450, this.x)`).
   - In the `Boss` class `draw()` method, only render the boss if `player.x >= 8000`.

6. **Seamless Parallax Background Stitching:**
   - In the `ParallaxBackground` class `draw()` method:
     - Apply a 1-pixel overlap when rendering adjacent tiling background images.
     - Specifically, change the width of the drawn images to `this.width + 1` and draw the third image at `this.width * 2 - 1` to close any sub-pixel gap line during movement.

---

## Verification Plan

### Automated Tests
- Run `py -m http.server 8000` (already active in the background).
- Check browser console logs for any syntax or reference errors.

### Manual Verification
1. **Surgical Outline Cleaning:**
   - Observe Hexly's walk and jump animations. Verify that the white aliased edges have disappeared while his eyes remain white and undamaged.
2. **Seamless Parallax Stitching:**
   - Scroll back and forth through the level. Confirm that no vertical flicker or seam lines appear at the background boundaries.
3. **Falling Platforms:**
   - Land on the falling platforms in the lava section. Confirm they are 2 tiles wide.
   - Verify that standing on either half triggers the entire platform to shake and fall together.
4. **Winged Imps:**
   - Observe the flying skeleton enemies. Confirm they are visibly larger.
5. **Boss Encounter:**
   - Play through the level. Confirm the boss is invisible and does not throw fireballs or move during the early/mid-level sections.
   - Reach $x = 8000$px. Confirm the boss becomes visible, active, and starts fighting.
   - Walk far to the left after activating the boss. Verify the boss paces back and forth but stops at the edge of the arena ($x = 8450$px) and does not pursue you into the rest of the level.
