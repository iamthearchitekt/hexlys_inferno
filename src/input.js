// 4. INPUT CONTROLLERS & KEYBOARD ACTIONS (Shooting & Gamepad Added)
// ----------------------------------------------------
class InputHandler {
    constructor() {
        // Final unified state
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

        // Raw Keyboard State
        this.keyLeft = false;
        this.keyRight = false;
        this.keyDown = false;
        this.keyJump = false;
        this.keyShoot = false;
        
        this.prevGamepadButtons = {};

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.keyLeft = true;
        if (code === 'ArrowRight' || code === 'KeyD') this.keyRight = true;
        if (code === 'ArrowDown' || code === 'KeyS') this.keyDown = true;
        if (code === 'ArrowUp' || code === 'KeyW') {
            if (!this.keyJump) this.jumpPressed = true;
            this.keyJump = true;
        }
        if (code === 'Escape') this.pausePressed = true;
        if (code === 'KeyP') this.screenshotPressed = true;
        if (code === 'KeyR') this.restartPressed = true;
        
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft' || code === 'Space') {
            if (!this.keyShoot) this.shootPressed = true;
            this.keyShoot = true;
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
        if (code === 'ArrowLeft' || code === 'KeyA') this.keyLeft = false;
        if (code === 'ArrowRight' || code === 'KeyD') this.keyRight = false;
        if (code === 'ArrowDown' || code === 'KeyS') this.keyDown = false;
        if (code === 'ArrowUp' || code === 'KeyW') this.keyJump = false;
        if (code === 'KeyZ' || code === 'KeyJ' || code === 'ShiftLeft' || code === 'Space') this.keyShoot = false;
    }

    updateGamepad() {
        let gpLeft = false, gpRight = false, gpDown = false, gpJump = false, gpShoot = false;
        
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        // Support the first connected controller
        const gp = Array.from(gamepads).find(pad => pad !== null);
        
        if (gp) {
            const threshold = 0.5;
            gpLeft = (gp.axes[0] < -threshold) || (gp.buttons[14] && gp.buttons[14].pressed);
            gpRight = (gp.axes[0] > threshold) || (gp.buttons[15] && gp.buttons[15].pressed);
            gpDown = (gp.axes[1] > threshold) || (gp.buttons[13] && gp.buttons[13].pressed);
            const gpUp = (gp.axes[1] < -threshold) || (gp.buttons[12] && gp.buttons[12].pressed);
            
            // Typical 6-button arcade pad layout (A, B, C, X, Y, Z) maps loosely to standard gamepad indices
            gpJump = gpUp || (gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[1] && gp.buttons[1].pressed);
            gpShoot = (gp.buttons[2] && gp.buttons[2].pressed) || (gp.buttons[3] && gp.buttons[3].pressed) || (gp.buttons[4] && gp.buttons[4].pressed) || (gp.buttons[5] && gp.buttons[5].pressed);
            
            const startBtn = gp.buttons[9] && gp.buttons[9].pressed;
            const selectBtn = gp.buttons[8] && gp.buttons[8].pressed;

            if (gpJump && !this.prevGamepadButtons.jump) this.jumpPressed = true;
            if (gpShoot && !this.prevGamepadButtons.shoot) this.shootPressed = true;
            if (startBtn && !this.prevGamepadButtons.start) this.pausePressed = true;
            if (selectBtn && !this.prevGamepadButtons.select) this.restartPressed = true;

            this.prevGamepadButtons.jump = gpJump;
            this.prevGamepadButtons.shoot = gpShoot;
            this.prevGamepadButtons.start = startBtn;
            this.prevGamepadButtons.select = selectBtn;
        }

        // Combine Keyboard and Gamepad states
        this.left = this.keyLeft || gpLeft;
        this.right = this.keyRight || gpRight;
        this.down = this.keyDown || gpDown;
        this.jump = this.keyJump || gpJump;
        this.shootHeld = this.keyShoot || gpShoot;
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
