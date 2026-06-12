// 4. INPUT CONTROLLERS & KEYBOARD ACTIONS (Shooting Added)
// ----------------------------------------------------
class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this.down = false;
        this.jump = false;
        this.jumpPressed = false;
        this.shootPressed = false;
        this.shootHeld = false;
        this.pausePressed = false;
        this.restartPressed = false;
        this.screenshotPressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = true;
        if (code === 'ArrowRight' || code === 'KeyD') this.right = true;
        if (code === 'ArrowDown' || code === 'KeyS') this.down = true;
        if (code === 'ArrowUp' || code === 'KeyW') {
            if (!this.jump) this.jumpPressed = true;
            this.jump = true;
        }
        if (code === 'Escape') this.pausePressed = true;
        if (code === 'KeyP') this.screenshotPressed = true;
        if (code === 'KeyR') this.restartPressed = true;
        
        // Z, J, Left Shift, or Space for Shooting Fireballs and Sprinting
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft' || code === 'Space') {
            if (!this.shootHeld) this.shootPressed = true;
            this.shootHeld = true;
        }

        if (code.startsWith('Digit') && code.length === 6) {
            const num = parseInt(code.replace('Digit', ''));
            if (!isNaN(num)) this['digit' + num] = true;
        }

        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = false;
        if (code === 'ArrowRight' || code === 'KeyD') this.right = false;
        if (code === 'ArrowDown' || code === 'KeyS') this.down = false;
        if (code === 'ArrowUp' || code === 'KeyW') this.jump = false;
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft' || code === 'Space') this.shootHeld = false;
    }

    clearFrameTriggers() {
        this.jumpPressed = false;
        this.shootPressed = false;
        this.pausePressed = false;
        this.restartPressed = false;
        this.screenshotPressed = false;
    }
}


// ----------------------------------------------------
