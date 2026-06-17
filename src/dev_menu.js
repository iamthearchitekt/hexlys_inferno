// ============================================================
// DEV MENU — src/dev_menu.js
// Open with backtick (~) at any time, or START on the title screen.
// ESC / backtick / ✕ button / click-outside all close it.
// SHIP: Delete this file and remove the hook in engine.js.
// ============================================================

class DevMenu {
    constructor(engine) {
        this.engine = engine;
        this.overlay = null;
        this.build();
    }

    build() {
        const existing = document.getElementById('dev-menu-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'dev-menu-overlay';
        overlay.innerHTML = `
            <div class="dev-menu-inner">
                <div class="dev-menu-header">
                    <div class="dev-menu-header-row">
                        <span class="dev-tag">⚡ DEV BUILD</span>
                        <button class="dev-close-btn" id="dev-close-btn" title="Close (ESC or ~)">✕</button>
                    </div>
                    <h1 class="dev-menu-title">HEXLY'S INFERNO</h1>
                    <p class="dev-menu-subtitle">Select a level to load &nbsp;·&nbsp; <kbd>~</kbd> or <kbd>ESC</kbd> to close</p>
                </div>
                <div class="dev-menu-grid" id="dev-level-grid">
                </div>
                <div class="dev-menu-footer">
                    God mode active &nbsp;|&nbsp; Tile editor: DEV MODE button (top-right) &nbsp;|&nbsp; Quick warp: keys 1–9
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;

        // Click-outside-to-close: click on the dark overlay backdrop, not the inner panel
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.hide();
        });

        // Close button
        overlay.querySelector('#dev-close-btn').addEventListener('click', () => this.hide());

        this.renderCards();
    }

    renderCards() {
        const grid = document.getElementById('dev-level-grid');
        if (!grid) return;
        grid.innerHTML = '';

        LEVELS.forEach((level, index) => {
            const result = LEVEL_VALIDATOR.validate(level);
            const card = document.createElement('div');
            card.className = 'dev-level-card' + (result.valid ? ' dev-card-valid' : result.stub ? ' dev-card-stub' : ' dev-card-error');
            card.dataset.levelIndex = index;

            const statusIcon = result.valid ? '✅' : result.stub ? '🚧' : '❌';
            const statusText = result.valid ? result.info : result.error;
            const btnDisabled = result.valid ? '' : 'disabled';

            card.innerHTML = `
                <div class="dev-card-num">${level.id}</div>
                <div class="dev-card-info">
                    <div class="dev-card-name">${level.name || 'Unnamed'}</div>
                    <div class="dev-card-status">${statusIcon} ${statusText}</div>
                </div>
                <button class="dev-card-btn" ${btnDisabled} data-index="${index}">
                    ${result.valid ? 'LOAD' : result.stub ? 'NOT BUILT' : 'INVALID'}
                </button>
            `;

            if (result.valid) {
                card.querySelector('.dev-card-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadLevel(index, level);
                });
            }

            grid.appendChild(card);
        });
    }

    loadLevel(index, level) {
        const result = LEVEL_VALIDATOR.validate(level);
        if (!result.valid) {
            this.showLoadError(index, result.error);
            return;
        }

        // Switch to PLAY mode: disable the tile editor so Hexly is visible
        // and arrows control movement instead of panning the camera.
        // devGodMode stays true so the player can't die.
        this.engine.isDevMode = false;

        this.hide();

        this.engine.audioSetup();
        this.engine.resetGame(false, index);

        if (typeof synth !== 'undefined' && synth.startMusic && LEVELS[index].music) {
            synth.startMusic(LEVELS[index].music);
        }
    }

    showLoadError(index, message) {
        const grid = document.getElementById('dev-level-grid');
        if (!grid) return;
        const cards = grid.querySelectorAll('.dev-level-card');
        if (cards[index]) {
            const statusEl = cards[index].querySelector('.dev-card-status');
            if (statusEl) {
                statusEl.textContent = '❌ ' + message;
                statusEl.style.color = '#ff4444';
            }
        }
    }

    show() {
        if (!this.overlay) this.build();
        this.renderCards();
        this.overlay.classList.add('dev-menu-visible');
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('dev-menu-visible');
        }
    }

    isVisible() {
        return this.overlay && this.overlay.classList.contains('dev-menu-visible');
    }
}
