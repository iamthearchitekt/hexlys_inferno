# Add Mini-Boss Encounter

The goal is to extend the end of the level to include a flat boss arena and introduce an invincible Bowser-style mini-boss using the provided 2-frame skeletal demon sprite animation.

## Proposed Changes

### Level Extension
- Extend the `LEVEL_DATA` matrix (currently 200 columns wide) by roughly 40 columns to create a flat "boss arena".
- Move the `PORTAL` (exit tile) to the very end of this new arena.
- Add a new tile ID (`TILES.BOSS = 13`) to spawn the boss in the middle of the arena, standing between the player and the portal.

### Asset Loading
- Load the provided `boss_frame1.png` and `boss_frame2.png` files in `game.js`.

### Boss Entity Logic
- Create a new `Boss` class in `game.js` with the following mechanics:
  - **Invincible**: The boss cannot be killed by stomps or fireballs (they will be ignored or deflected). The player must bypass him.
  - **Animation**: Toggle between the two loaded images based on a frame counter.
  - **Movement**: Slowly paces back and forth or tracks the player horizontally, occasionally performing high leaps to allow Hexly to run underneath.
  - **Attack**: Periodically shoots fireballs directly at Hexly.
  - **Collision**: Touching the boss damages Hexly.

### Encounter Flow
- Hexly enters the arena.
- The boss acts as an invincible obstacle.
- The player must dodge the boss's fireballs, wait for him to jump (or jump over him), and sprint past him to reach the portal.

## Open Questions

None at this time. The design aligns perfectly with classic Mario mechanics!

## Verification Plan

### Automated Tests
- Verify there are no syntax errors in `game.js`.
- Verify the two new images load correctly.

### Manual Verification
- Launch the local dev server and navigate to the end of the level.
- Confirm the new arena geometry renders correctly with the portal at the far right.
- Verify the boss spawns, animates using both frames, throws fireballs, jumps, and correctly ignores damage from Hexly.
- Bypass the boss and enter the portal to confirm the level can be completed.
