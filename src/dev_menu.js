// ============================================================
// DEV MENU — src/dev_menu.js
// Shown when you press START on the title screen (dev builds only).
// Lists all 9 levels with validation status. Click to load directly.
// SHIP: Delete this file and remove the hook in engine.js.
// ============================================================

class DevMenu {
    constructor(engine) {
        this.engine = engine;
        this.overlay = null;
        this.build();
    }

    build() {
        // Remove any existing overlay
        const existing = document.getElementById('dev-menu-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'dev-menu-overlay';
        overlay.innerHTML = `
            <div class="dev-menu-inner">
                <div class="dev-menu-header">
                    <span class="dev-tag">⚡ DEV</span>
                    <h1 class="dev-menu-title">HEXLY'S INFERNO</h1>
                    <p class="dev-menu-subtitle">Select a level to load directly</p>
                </div>
                <div class="dev-menu-grid" id="dev-level-grid">
                </div>
                <div class="dev-menu-footer">
                    All levels validated on load &nbsp;|&nbsp; Strip this menu before shipping
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
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
        // Re-validate at load time
        const result = LEVEL_VALIDATOR.validate(level);
        if (!result.valid) {
            this.showLoadError(index, result.error);
            return;
        }

        this.hide();

        // Mirror exactly what the keyboard level-warp does:
        // audioSetup ensures synth is ready, then resetGame handles
        // state, screen visibility, initializeMap, and audio internally.
        this.engine.audioSetup();
        this.engine.resetGame(false, index);

        // Start the correct music (resetGame/initializeMap handles ambience)
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
        // Re-render cards each time (picks up any hot-reload changes)
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
