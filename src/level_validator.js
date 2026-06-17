// ============================================================
// LEVEL VALIDATOR — src/level_validator.js
// Runs before any level loads. Returns { valid, error, info }
// DEV: Also used by dev menu to show status on each card.
// SHIP: Delete this file when dev menu is removed.
// ============================================================

const LEVEL_VALIDATOR = {
    // Expected rows for every level
    EXPECTED_ROWS: 12,
    // Minimum columns before we consider a layout "real"
    MIN_COLS: 50,

    validate(level) {
        if (!level) {
            return { valid: false, error: 'Level object is null or undefined' };
        }

        if (level.stub) {
            return { valid: false, stub: true, error: 'Not built yet' };
        }

        if (!level.layout) {
            return { valid: false, error: 'Missing layout property' };
        }

        if (!Array.isArray(level.layout)) {
            return { valid: false, error: 'layout is not an array' };
        }

        const rows = level.layout.length;
        if (rows !== this.EXPECTED_ROWS) {
            return { valid: false, error: `Expected ${this.EXPECTED_ROWS} rows, got ${rows}` };
        }

        const cols = level.layout[0].length;
        if (cols < this.MIN_COLS) {
            return { valid: false, error: `Layout too narrow: ${cols} cols (min ${this.MIN_COLS})` };
        }

        // Check all rows are the same length
        for (let r = 0; r < rows; r++) {
            if (!Array.isArray(level.layout[r])) {
                return { valid: false, error: `Row ${r} is not an array` };
            }
            if (level.layout[r].length !== cols) {
                return { valid: false, error: `Row ${r} has ${level.layout[r].length} cols, expected ${cols}` };
            }
        }

        if (!level.name) {
            return { valid: false, error: 'Missing name property' };
        }

        if (typeof level.id !== 'number') {
            return { valid: false, error: 'Missing or invalid id property' };
        }

        return {
            valid: true,
            error: null,
            info: `${rows} rows × ${cols} cols`
        };
    }
};
