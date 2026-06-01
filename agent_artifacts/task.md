# Task List

- `[x]` 1. Implement Falling Chain Platforms
  - `[x]` Create `FallingPlatform` entity class.
  - `[x]` Update collision logic to spawn entity and remove static tile when stood upon.
  - `[x]` Update Level Data: vary platform heights in the flying enemy section.
- `[x]` 2. Implement Boss Encounter
  - `[x]` Define `TILES.BOSS = 13`.
  - `[x]` Load `boss_frame1.png` and `boss_frame2.png`.
  - `[x]` Create `Boss` entity class (invincible, jumping, pacing, fireball shooting).
  - `[x]` Integrate `Boss` updates and drawing into `GameEngine`.
- `[x]` 3. Extend Level Data
  - `[x]` Extend `LEVEL_DATA` by ~40 columns to create a boss arena.
  - `[x]` Place `TILES.BOSS` in the arena.
  - `[x]` Move `TILES.PORTAL` to the far right of the arena.
