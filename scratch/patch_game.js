const fs = require('fs');

let gameCode = fs.readFileSync('game.js', 'utf8').replace(/\r\n/g, '\n');

// Helper to replace exactly one occurrence and throw if not found or found multiple
function replaceExactly(target, replacement, label) {
    const normTarget = target.replace(/\r\n/g, '\n');
    const normReplacement = replacement.replace(/\r\n/g, '\n');
    const idx = gameCode.indexOf(normTarget);
    if (idx === -1) {
        throw new Error(`Target not found for: ${label}`);
    }
    const nextIdx = gameCode.indexOf(normTarget, idx + 1);
    if (nextIdx !== -1) {
        throw new Error(`Multiple matches found for: ${label}`);
    }
    gameCode = gameCode.replace(normTarget, normReplacement);
    console.log(`✓ Patched: ${label}`);
}

// 1. Load tree images
const treeLoaders = `const tree1Img = new Image();
let tree1ImgLoaded = false;
tree1Img.onload = () => { tree1ImgLoaded = true; };
tree1Img.src = 'tree1.png';

const tree2Img = new Image();
let tree2ImgLoaded = false;
tree2Img.onload = () => { tree2ImgLoaded = true; };
tree2Img.src = 'tree2.png';

class AudioSynth {`;

replaceExactly('class AudioSynth {', treeLoaders, 'Tree images loading');

// 2. WAV-powered AudioSynth class replacement
const audioSynthStart = gameCode.indexOf('class AudioSynth {');
const audioSynthEnd = gameCode.indexOf('const synth = new AudioSynth();');
if (audioSynthStart === -1 || audioSynthEnd === -1) {
    throw new Error('AudioSynth class or synth instance not found');
}

const newAudioSynthClass = `class AudioSynth {
    constructor() {
        this.ctx = null;
        this._musicEnabled = true;
        this.sfxEnabled = true;
        this.sfxBuffers = {};
        this.musicBuffer = null;
        this.musicSource = null;
        this.musicGain = null;
        this.starMusicBuffer = null;
        this.starMusicSource = null;
    }

    get musicEnabled() {
        return this._musicEnabled;
    }

    set musicEnabled(val) {
        this._musicEnabled = val;
        if (val) {
            if (this.starMusicSource) {
                // Keep playing star music if active
            } else {
                this.startMusic();
            }
        } else {
            this.stopMusic();
            this.stopStarMusic();
        }
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this._loadAllSfx();
        this._loadMusic();
    }

    _loadAllSfx() {
        const files = {
            jump:    'sfx/jump.wav',
            fireball:'sfx/fireball.wav',
            stomp:   'sfx/stompswim.wav',
            collect: 'sfx/coin.wav',
            crunch:  'sfx/brick.wav',
            victory: 'sfx/powerup.wav',
            damage:  'sfx/pipepowerdown.wav',
            oneup:   'sfx/1up.wav',
            fire:    'sfx/fire.wav'
        };
        Object.entries(files).forEach(([key, path]) => {
            fetch(path)
                .then(r => r.arrayBuffer())
                .then(ab => this.ctx.decodeAudioData(ab))
                .then(buf => { this.sfxBuffers[key] = buf; })
                .catch(err => console.warn("Failed to load SFX:", key, err));
        });
    }

    _loadMusic() {
        // Load main music
        fetch('game_music.wav')
            .then(r => r.arrayBuffer())
            .then(ab => this.ctx.decodeAudioData(ab))
            .then(buf => {
                this.musicBuffer = buf;
                if (this._musicEnabled && !this.starMusicSource) {
                    this.startMusic();
                }
            })
            .catch(err => console.warn("Failed to load game music:", err));
        
        // Load star music
        fetch('star_music.wav')
            .then(r => r.arrayBuffer())
            .then(ab => this.ctx.decodeAudioData(ab))
            .then(buf => {
                this.starMusicBuffer = buf;
            })
            .catch(err => console.warn("Failed to load star music:", err));
    }

    startMusic() {
        if (!this.ctx || !this.musicBuffer || !this._musicEnabled) return;
        if (this.musicSource) return; // Already playing!
        
        this.musicSource = this.ctx.createBufferSource();
        this.musicSource.buffer = this.musicBuffer;
        this.musicSource.loop = true;
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime); // standard gain 0.4
        
        this.musicSource.connect(this.musicGain);
        this.musicGain.connect(this.ctx.destination);
        this.musicSource.start(0);
    }

    stopMusic() {
        if (this.musicSource) {
            try {
                this.musicSource.stop(0);
            } catch (e) {}
            this.musicSource = null;
        }
    }

    playStarMusic() {
        if (!this.ctx || !this.starMusicBuffer || !this._musicEnabled) return;
        this.resume();
        this.stopStarMusic(); // make sure it's clean
        
        // Mute or stop regular music
        this.stopMusic();
        
        this.starMusicSource = this.ctx.createBufferSource();
        this.starMusicSource.buffer = this.starMusicBuffer;
        this.starMusicSource.loop = true;
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        
        this.starMusicSource.connect(gain);
        gain.connect(this.ctx.destination);
        this.starMusicSource.start(0);
    }

    stopStarMusic() {
        if (this.starMusicSource) {
            try {
                this.starMusicSource.stop(0);
            } catch (e) {}
            this.starMusicSource = null;
        }
        // Restart regular music if enabled
        if (this._musicEnabled) {
            this.startMusic();
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    _playBuffer(key, volume = 1.0) {
        if (!this.ctx || !this.sfxBuffers[key]) return false;
        const source = this.ctx.createBufferSource();
        source.buffer = this.sfxBuffers[key];
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(0);
        return true;
    }

    playJump() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('jump', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCollect() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('collect', 0.6)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        osc1.frequency.exponentialRampToValueAtTime(3520, now + 0.3);
        osc2.frequency.setValueAtTime(1108, now);
        osc2.frequency.exponentialRampToValueAtTime(2217, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(4434, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    }

    playStomp() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('stomp', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playCrunch() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('crunch', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.8 + 0.2);
        }
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noiseSource.start(now);
    }

    playDamage() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('damage', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playVictory() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('victory', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.08, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
        });
    }

    playFireball() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('fireball', 0.8)) return;
        
        // Synth fallback
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.10);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.10);
    }

    playOneUp() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('oneup', 0.8)) return;
        
        // Synth fallback (magical chime arpeggio)
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playFire() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.resume();
        if (this._playBuffer('fire', 0.8)) return;
        
        // Synth fallback (deep burning low pitch sweep)
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }
}
`;

gameCode = gameCode.substring(0, audioSynthStart) + newAudioSynthClass + gameCode.substring(audioSynthEnd);
console.log('✓ Patched: AudioSynth class');

// 3. InputHandler additions
const targetInputInit = `        this.pausePressed = false;
        this.restartPressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));`;
const replacementInputInit = `        this.pausePressed = false;
        this.restartPressed = false;
        this.anyPressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));`;
replaceExactly(targetInputInit, replacementInputInit, 'InputHandler initialization');

const targetKeyDown = `    handleKeyDown(e) {
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = true;`;
const replacementKeyDown = `    handleKeyDown(e) {
        const code = e.code;
        this.anyPressed = true;
        if (code === 'ArrowLeft' || code === 'KeyA') this.left = true;`;
replaceExactly(targetKeyDown, replacementKeyDown, 'InputHandler handleKeyDown anyPressed');

const targetClearFrame = `    clearFrameTriggers() {
        this.jumpPressed = false;
        this.shootPressed = false;
        this.pausePressed = false;
        this.restartPressed = false;
    }`;
const replacementClearFrame = `    clearFrameTriggers() {
        this.jumpPressed = false;
        this.shootPressed = false;
        this.pausePressed = false;
        this.restartPressed = false;
        this.anyPressed = false;
    }`;
replaceExactly(targetClearFrame, replacementClearFrame, 'InputHandler clearFrameTriggers anyPressed');

// 4. SPRITES.TILES additions
const targetGroundSprite = `        GROUND: [
            "bbbbbbbbbb",
            "bqqfffqqeb",
            "bqfhhhfheb",
            "bqfheehfeb",
            "bqfhhhfheb",
            "bqfeeeffeb",
            "bqfhhhhheb",
            "bqfeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],`;
const replacementGroundSprite = `        GROUND: [
            "bbbbbbbbbb",
            "bqqfffqqeb",
            "bqfhhhfheb",
            "bqfheehfeb",
            "bqfhhhfheb",
            "bqfeeeffeb",
            "bqfhhhhheb",
            "bqfeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],
        GROUND2: [
            "bbbbbbbbbb",
            "bqqfeeebqb",
            "bqfeehfeeb",
            "bqhhhfeeeb",
            "bfeeebbffb",
            "bfhbbhhhfb",
            "bfehfffeeb",
            "bqfehheeeb",
            "bheebeehhb",
            "bbbbbbbbbb"
        ],
        GROUND3: [
            "bbbbbbbbbb",
            "beeeeeeeeb",
            "befhhhhfeb",
            "behhqqhheb",
            "befhqhhfeb",
            "behhqqhheb",
            "befhhhhfeb",
            "beeeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],`;
replaceExactly(targetGroundSprite, replacementGroundSprite, 'GROUND2/GROUND3 sprite matrices');

const targetSpentSprite = `        SPENT: [
            "bbbbbbbbbb",
            "beeffffebb",
            "behheeeheb",
            "behheeeheb",
            "behhheeehb",
            "beeeffeeeb",
            "behhhhhheb",
            "beeeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],`;
const replacementSpentSprite = `        SPENT: [
            "bbbbbbbbbb",
            "beeffffebb",
            "behheeeheb",
            "behheeeheb",
            "behhheeehb",
            "beeeffeeeb",
            "behhhhhheb",
            "beeeeeeeeb",
            "bheeeeeehb",
            "bbbbbbbbbb"
        ],
        ONEUP: [
            "bbbbbbbbbb",
            "brrrbrrrrb",
            "brrbrbrrrb",
            "bbbbbbbbbb",
            "brrbrbrrrb",
            "brbrrrbrrb",
            "brbrrrbrrb",
            "bbrrrrrbbb",
            "brrrrrrrrb",
            "bbbbbbbbbb"
        ],`;
replaceExactly(targetSpentSprite, replacementSpentSprite, 'ONEUP sprite matrix');

// 5. isSolid(tile) update
const targetIsSolid = `    isSolid(tile) {
        return tile === TILES.GROUND || 
               tile === TILES.PLATFORM || 
               tile === TILES.FALLING_PLATFORM ||
               tile === TILES.BREAKABLE || 
               tile === TILES.REWARD || 
               tile === TILES.SPENT_REWARD;
    }`;
const replacementIsSolid = `    isSolid(tile) {
        return tile === TILES.GROUND || 
               tile === TILES.PLATFORM || 
               tile === TILES.FALLING_PLATFORM ||
               tile === TILES.BREAKABLE || 
               tile === TILES.REWARD || 
               tile === TILES.SPENT_REWARD ||
               tile === TILES.ONEUP;
    }`;
replaceExactly(targetIsSolid, replacementIsSolid, 'isSolid TILES.ONEUP check');

// 6. Particle System additions
const targetParticleUpdate = `        if (this.type === 'ember') {
            this.vy -= 0.02;
            this.vx += (Math.random() - 0.5) * 0.1;
        } else if (this.type === 'debris') {
            this.vy += 0.25;
        } else if (this.type === 'dust') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        }`;
const replacementParticleUpdate = `        if (this.type === 'ember') {
            this.vy -= 0.02;
            this.vx += (Math.random() - 0.5) * 0.1;
        } else if (this.type === 'debris') {
            this.vy += 0.25;
        } else if (this.type === 'dust') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        } else if (this.type === 'gas') {
            this.vx += (Math.random() - 0.5) * 0.05; // Wobbly drift
            this.size *= 1.01; // Expand slightly as it rises
        } else if (this.type === 'rain') {
            // moves straight with vx/vy
        }`;
replaceExactly(targetParticleUpdate, replacementParticleUpdate, 'Particle type update logic');

const targetParticleDraw = `    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(this.x - cameraX - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
        ctx.restore();
    }`;
const replacementParticleDraw = `    draw(ctx, cameraX) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const drawX = Math.floor(this.x - cameraX);
        const drawY = Math.floor(this.y);

        if (this.type === 'gas') {
            // Render smooth, glowing vapor clouds instead of blocky pixels
            ctx.globalCompositeOperation = 'lighter';
            const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.size);
            grd.addColorStop(0, \`rgba(\${this.color}, 0.6)\`);
            grd.addColorStop(1, \`rgba(\${this.color}, 0)\`);
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'rain') {
            // Draw diagonal rain streaks
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX + this.vx * 1.5, drawY + this.vy * 1.5);
            ctx.stroke();
        } else {
            // Standard retro blocky particles
            ctx.fillStyle = this.color;
            ctx.fillRect(drawX - this.size / 2, drawY - this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
    }`;
replaceExactly(targetParticleDraw, replacementParticleDraw, 'Particle draw method');

const targetLavaBubble = `    spawnLavaBubble(x, y) {
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.3, -Math.random() * 0.4 - 0.2, '#f95700', Math.random() * 4 + 2, Math.random() * 50 + 20, 'dust'));
    }`;
const replacementLavaBubble = `    spawnLavaBubble(x, y) {
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.3, -Math.random() * 0.4 - 0.2, '#f95700', Math.random() * 4 + 2, Math.random() * 50 + 20, 'dust'));
    }

    spawnOneUpEmber(x, y) {
        const colors = ['#00ff66', '#aeff00', '#00ffcc'];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.5;
            this.add(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, colors[Math.floor(Math.random() * colors.length)], Math.random() * 3 + 2, Math.random() * 60 + 30, 'dust'));
        }
    }

    spawnSlideDust(x, y) {
        // Volcanic hot sliding friction dust sparks!
        for (let i = 0; i < 2; i++) {
            this.add(new Particle(
                x, y - 2, 
                (Math.random() - 0.5) * 1.5, 
                -Math.random() * 0.8, 
                'rgba(255, 90, 0, 0.6)', 
                Math.random() * 5 + 3, 
                Math.random() * 15 + 10, 
                'dust'
            ));
            this.add(new Particle(
                x, y - 2, 
                (Math.random() - 0.5) * 1.2, 
                -Math.random() * 0.4, 
                'rgba(255, 200, 50, 0.7)', 
                Math.random() * 3 + 1, 
                Math.random() * 10 + 5, 
                'ember'
            ));
        }
    }

    spawnSwampGas(x, y, isBlood = false) {
        // Use raw RGB strings so we can inject them into a radial gradient with custom alpha
        const colors = isBlood 
            ? ['255, 50, 50', '200, 0, 0', '255, 100, 100'] 
            : ['150, 255, 50', '50, 200, 0', '200, 255, 100'];
        this.add(new Particle(
            x, y, 
            (Math.random() - 0.5) * 0.5, 
            -Math.random() * 0.8 - 0.2,  
            colors[Math.floor(Math.random() * colors.length)], 
            Math.random() * 12 + 6,       // Larger size for smooth clouds
            Math.random() * 120 + 60,    
            'gas'
        ));
    }

    spawnRain(cameraX, viewportWidth) {
        // Spawn off-screen top/right so it blows diagonally down-left (matching The Black Gale)
        const x = cameraX + Math.random() * (viewportWidth + 400); 
        const y = -20;
        const vx = -6 - Math.random() * 4; // Fast wind blowing left
        const vy = 15 + Math.random() * 8; // Falling fast
        this.add(new Particle(
            x, y, 
            vx, vy, 
            'rgba(200, 220, 255, 0.25)', 
            Math.random() * 2 + 1, 
            Math.random() * 40 + 20, 
            'rain'
        ));
    }`;
replaceExactly(targetLavaBubble, replacementLavaBubble, 'ParticleSystem new particle emitters');

// 7. Fireball additions
const targetFireballUpdateCol = `                if (tile === TILES.GROUND || tile === TILES.PLATFORM || tile === TILES.BREAKABLE || tile === TILES.REWARD || tile === TILES.SPENT_REWARD) {`;
const replacementFireballUpdateCol = `                if (tile === TILES.GROUND || tile === TILES.PLATFORM || tile === TILES.BREAKABLE || tile === TILES.REWARD || tile === TILES.SPENT_REWARD || tile === TILES.ONEUP) {`;
replaceExactly(targetFireballUpdateCol, replacementFireballUpdateCol, 'Fireball update vertical collision');

const targetFireballIsHitCol = `                if (t === TILES.GROUND || t === TILES.PLATFORM || t === TILES.BREAKABLE || t === TILES.REWARD || t === TILES.SPENT_REWARD) {`;
const replacementFireballIsHitCol = `                if (t === TILES.GROUND || t === TILES.PLATFORM || t === TILES.BREAKABLE || t === TILES.REWARD || t === TILES.SPENT_REWARD || t === TILES.ONEUP) {`;
replaceExactly(targetFireballIsHitCol, replacementFireballIsHitCol, 'Fireball isHitSolid check');

// 8. Title Screen Spacebar Start listener
const targetStartBtn = `        document.getElementById('start-btn').addEventListener('click', () => {
            this.audioSetup();
            this.startGame();
        });`;
const replacementStartBtn = `        document.getElementById('start-btn').addEventListener('click', () => {
            this.audioSetup();
            this.startGame();
        });

        window.addEventListener('keydown', (e) => {
            if (this.state === 'TITLE' && e.code === 'Space') {
                this.audioSetup();
                this.startGame();
            }
        });`;
replaceExactly(targetStartBtn, replacementStartBtn, 'setupMenuTriggers spacebar key listener');

// 9. Level 5 Trees initialization in initializeMap()
const targetMaxCoins = `        // Set maximum coin count dynamically based on the actual spawned shards!
        this.player.maxCoins = this.coins.length || 1;
    }`;
const replacementMaxCoins = `        // Set maximum coin count dynamically based on the actual spawned shards!
        this.player.maxCoins = this.coins.length || 1;

        // Populate background trees for Level 5 (Swamp)
        this.trees = [];
        if (this.currentLevelIndex === 4) {
            // Commit to exactly 5 deterministic tree placements evenly spaced across the level
            const treePlacements = [
                { targetCol: 35, type: 1 },
                { targetCol: 100, type: 2 },
                { targetCol: 165, type: 1 },
                { targetCol: 225, type: 2 },
                { targetCol: 290, type: 1 }
            ];
            
            for (const placement of treePlacements) {
                let foundCol = -1;
                let foundRow = -1;
                
                // Search near the target column for the closest solid ground floor tile
                for (let offset = 0; offset <= 20; offset++) {
                    for (const sign of [1, -1]) {
                        if (offset === 0 && sign === -1) continue;
                        
                        const c = placement.targetCol + (offset * sign);
                        if (c < 0 || c >= this.levelGrid[0].length) continue;
                        
                        for (let r = 0; r < this.levelGrid.length; r++) {
                            const tile = this.levelGrid[r][c];
                            if (tile === TILES.GROUND && r >= 8) {
                                foundCol = c;
                                foundRow = r;
                                break;
                            } else if (tile !== TILES.EMPTY) {
                                break; // Hit swamp or platform, column invalid
                            }
                        }
                        if (foundCol !== -1) break;
                    }
                    if (foundCol !== -1) break;
                }
                
                if (foundCol !== -1) {
                    this.trees.push({
                        col: foundCol,
                        x: foundCol * TILE_SIZE,
                        y: foundRow * TILE_SIZE,
                        type: placement.type
                    });
                }
            }
        }
    }`;
replaceExactly(targetMaxCoins, replacementMaxCoins, 'initializeMap Level 5 trees population');

// 10. GameEngine update method top edits (Mouse cursor & Game Over restarts & Rain spawn)
const targetUpdateStart = `    update() {
        this.frameCounter++;

        if (this.input.restartPressed) {`;
const replacementUpdateStart = `    update() {
        // Hide the mouse cursor during gameplay, show it during menus/pause
        document.body.style.cursor = (this.state === 'PLAYING') ? 'none' : 'default';

        if (this.state === 'GAMEOVER' && this.input.anyPressed) {
            this.audioSetup();
            this.resetGame();
            this.input.clearFrameTriggers();
            return;
        }

        // Spawning rain in Level 2 (The Black Gale)
        if (this.currentLevelIndex === 1) {
            particles.spawnRain(this.camera.x, this.width);
        }

        this.frameCounter++;

        if (this.input.restartPressed) {`;
replaceExactly(targetUpdateStart, replacementUpdateStart, 'GameEngine update method start overlays');

// 11. Crouch slide friction and particle trail inside update()
const targetCrouchFriction = `        if (p.crouching) {
            p.vx *= 0.82; // slide to halt with heavy sliding friction
        } else {`;
const replacementCrouchFriction = `        if (p.crouching) {
            if (p.grounded) {
                if (Math.abs(p.vx) > 1.0) {
                    // Crouch Slide: low friction (glide further!)
                    p.vx *= 0.965;
                    
                    // Spawn cool volcanic slide sparks/dust at feet!
                    if (this.frameCounter % 3 === 0) {
                        particles.spawnSlideDust(p.x + p.width / 2, p.y + p.height);
                    }
                } else {
                    p.vx *= 0.82; // normal heavy crouch friction
                }
            }
            // If in mid-air (!p.grounded), we don't apply crouch friction, preserving momentum!
        } else {`;
replaceExactly(targetCrouchFriction, replacementCrouchFriction, 'crouch sliding friction and particle trail');

// 12. Swamp physics inside update() (Struggle jump check)
const targetJumpCoyote = `        if (this.player.jumpBufferTimer > 0 && this.player.coyoteTimer > 0) {
            synth.playJump();
            this.player.vy = this.physics.jumpForce;
            this.player.grounded = false;
            this.player.coyoteTimer = 0;
            this.player.jumpBufferTimer = 0;
            particles.spawnJumpDust(this.player.x + this.player.width / 2, this.player.y + this.player.height);
        }`;
const replacementJumpCoyote = `        if (this.player.jumpBufferTimer > 0) {
            if (this.player.coyoteTimer > 0) {
                synth.playJump();
                this.player.vy = this.physics.jumpForce;
                this.player.grounded = false;
                this.player.coyoteTimer = 0;
                this.player.jumpBufferTimer = 0;
                particles.spawnJumpDust(this.player.x + this.player.width / 2, this.player.y + this.player.height);
            } else if (this.player.inSwamp) {
                // Swamp bursting jump mechanic! Allow a strong double jump to escape the drag
                synth.playJump();
                this.player.vy = this.physics.jumpForce * 1.4; // Massive burst (-23.1) to overcome the 0.85x drag
                this.player.jumpBufferTimer = 0;
                // Burst of toxic gas as they erupt from the sludge
                for (let i = 0; i < 4; i++) {
                    particles.spawnSwampGas(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.currentLevelIndex === 4);
                }
            }
        }`;
replaceExactly(targetJumpCoyote, replacementJumpCoyote, 'swamp swimming / double jump struggling logic');

// 13. Swamp drag inside resolveCollisions()
const targetLavaCollision = `        // 5. Lava Hazard intersection checks
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                if (this.getTile(c, r) === TILES.LAVA) {
                    this.damagePlayer();
                    return;
                }
            }
        }
    }`;
const replacementLavaCollision = `        let inSwamp = false;

        // 5. Hazard intersection checks
        for (let r = bounds.minY; r <= bounds.maxY; r++) {
            for (let c = bounds.minX; c <= bounds.maxX; c++) {
                const tileType = this.getTile(c, r);
                if (tileType === TILES.LAVA) {
                    this.damagePlayer(true); // Instant kill!
                    return;
                } else if (tileType === TILES.SWAMP) {
                    inSwamp = true;
                }
            }
        }
        
        this.player.inSwamp = inSwamp; // Crucial for the swimming mechanic in update()

        if (inSwamp) {
            this.player.vx *= 0.6; // Heavy horizontal drag
            if (this.player.vy > 0) {
                this.player.vy *= 0.7; // Fall slower (thick liquid)
            } else if (this.player.vy < 0) {
                this.player.vy *= 0.85; // Rise slower (resists jumps)
            }
        }
    }`;
replaceExactly(targetLavaCollision, replacementLavaCollision, 'resolveCollisions swamp intersection and drag');

// 14. 1-UP ceiling bump block inside triggerCeilingBump()
const targetFlowerRelease = `            if (!this.player.poweredUp) {
                synth.playVictory();
                this.flowers.push(new LavaFlower(cx, cy));
                this.showToast("POWERUP RELEASED!");
            } else {
                synth.playCollect();
                this.player.coins++;
                this.player.score += 100;
                for (let i = 0; i < 8; i++) particles.spawnEmber(cx + TILE_SIZE/2, cy);
                this.updateHUD();
                this.showToast("+1 BONUS SOUL!");
            }
        }
    }`;
const replacementFlowerRelease = `            if (!this.player.poweredUp) {
                synth.playVictory();
                this.flowers.push(new LavaFlower(cx, cy));
                this.showToast("POWERUP RELEASED!");
            } else {
                synth.playCollect();
                this.player.coins++;
                this.player.score += 100;
                for (let i = 0; i < 8; i++) particles.spawnEmber(cx + TILE_SIZE/2, cy);
                this.updateHUD();
                this.showToast("+1 BONUS SOUL!");
            }
        }
        else if (tile === TILES.ONEUP) {
            this.levelGrid[row][col] = TILES.SPENT_REWARD;
            synth.playOneUp();
            const cx = col * TILE_SIZE;
            const cy = row * TILE_SIZE;
            
            if (this.player.health < this.player.maxHealth) {
                this.player.health = this.player.maxHealth;
                this.showToast("1-UP! HEALTH RESTORED!");
            } else {
                this.player.score += 1000;
                this.showToast("1-UP! +1000 BONUS POINTS!");
            }
            this.updateHUD();
            particles.spawnOneUpEmber(cx + TILE_SIZE/2, cy + TILE_SIZE/2);
            
            // Also kill any enemy standing on top of this block when hit from below (Mario-style)
            const tileTop = row * TILE_SIZE;
            const tileLeft = col * TILE_SIZE;
            const tileRight = tileLeft + TILE_SIZE;
            this.enemies.forEach(enemy => {
                if (enemy.dead) return;
                const enemyBottom = enemy.y + enemy.height;
                const enemyCenterX = enemy.x + enemy.width / 2;
                if (Math.abs(enemyBottom - tileTop) <= 6 && enemyCenterX >= tileLeft - 4 && enemyCenterX <= tileRight + 4) {
                    enemy.dead = true;
                    this.player.score += 150;
                    synth.playStomp();
                    particles.spawnStompExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                }
            });
        }
    }`;
replaceExactly(targetFlowerRelease, replacementFlowerRelease, 'triggerCeilingBump 1-UP block hit and enemy crush');

// 15. Level 5 background trees drawing (Behind Tiles in render())
const targetTilesTranslate = `        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), 0);

        // Draw physical grid blocks (Scale 4.5x = 45px grids!)
        this.drawTiles();`;
const replacementTilesTranslate = `        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), 0);

        // --- DRAW DECORATIVE TREES (Behind Tiles) ---
        if (this.currentLevelIndex === 4 && this.trees) {
            this.trees.forEach(tree => {
                const img = tree.type === 1 ? tree1Img : tree2Img;
                const loaded = tree.type === 1 ? tree1ImgLoaded : tree2ImgLoaded;
                if (loaded) {
                    const tw = 240; // 4 tiles wide
                    const th = 240; // 4 tiles tall
                    // Anchor bottom center of the tree to the top center of the tile
                    const tx = tree.x + (TILE_SIZE / 2) - (tw / 2);
                    // Push down by 30px so roots seamlessly overlap the swamp ground tiles
                    const ty = tree.y - th + 30; 
                    
                    this.ctx.save();
                    // Tint the tree to match the apocalyptic wasteland (dark brightness filter)
                    this.ctx.filter = 'brightness(35%)';
                    this.ctx.drawImage(img, tx, ty, tw, th);
                    this.ctx.restore();
                }
            });
        }

        // Draw physical grid blocks (Scale 4.5x = 45px grids!)
        this.drawTiles();`;
replaceExactly(targetTilesTranslate, replacementTilesTranslate, 'render() background trees drawing with brightness filter');

// 16. GROUND2, GROUND3, ONEUP tile mappings in drawSingleTile()
const targetDrawGroundSingle = `    drawSingleTile(x, y, type) {
        let matrix = null;
        if (type === TILES.GROUND) matrix = SPRITES.TILES.GROUND;`;
const replacementDrawGroundSingle = `    drawSingleTile(x, y, type) {
        let matrix = null;
        if (type === TILES.GROUND) {
            const hash = (Math.round(x / TILE_SIZE) * 17 + Math.round(y / TILE_SIZE) * 31) % 3;
            if (hash === 0) matrix = SPRITES.TILES.GROUND;
            else if (hash === 1) matrix = SPRITES.TILES.GROUND2;
            else matrix = SPRITES.TILES.GROUND3;
        }`;
replaceExactly(targetDrawGroundSingle, replacementDrawGroundSingle, 'drawSingleTile ground matrix variants mapping');

const targetDrawSpentSingle = `        else if (type === TILES.SPENT_REWARD) matrix = SPRITES.TILES.SPENT;
        else if (type === TILES.LAVA) {`;
const replacementDrawSpentSingle = `        else if (type === TILES.SPENT_REWARD) matrix = SPRITES.TILES.SPENT;
        else if (type === TILES.ONEUP) matrix = SPRITES.TILES.ONEUP;
        else if (type === TILES.LAVA) {`;
replaceExactly(targetDrawSpentSingle, replacementDrawSpentSingle, 'drawSingleTile ONEUP matrix mapping');

// 17. Level coloration multiply overlays in drawSingleTile() at the very end
const targetDrawTilesMatrixEnd = `        if (matrix) {
            // Draw blocks pixelated (Scale 4.5 = 45px)
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
        }
    }`;
const replacementDrawTilesMatrixEnd = `        if (matrix) {
            // Draw blocks pixelated (Scale 4.5 = 45px)
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5);
            
            // Level-specific coloration overlays on top of the ground blocks
            if (type === TILES.GROUND && this.currentLevelIndex === 1) {
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'multiply';
                this.ctx.globalAlpha = 0.55;
                this.ctx.fillStyle = '#9944dd'; // Purple haze/gale tint
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.restore();
            }
            else if (type === TILES.GROUND && this.currentLevelIndex === 2) {
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'multiply';
                this.ctx.globalAlpha = 0.65;
                this.ctx.fillStyle = '#668822'; // Swampy green-yellow
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.restore();
            }
            else if (type === TILES.GROUND && this.currentLevelIndex === 3) {
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'color';
                this.ctx.fillStyle = '#888888'; // Grey desaturate
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                
                // Add a subtle darkening multiply layer to make them look like heavy iron/stone
                this.ctx.globalCompositeOperation = 'multiply';
                this.ctx.globalAlpha = 0.4;
                this.ctx.fillStyle = '#444444';
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.restore();
            }
            else if (type === TILES.GROUND && this.currentLevelIndex === 4) {
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'color';
                this.ctx.fillStyle = '#ff2222'; // Vibrant red
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                
                // Add a darkening multiply layer to make it look like wet, dark blood
                this.ctx.globalCompositeOperation = 'multiply';
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillStyle = '#770000';
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.restore();
            }
            else if (type === TILES.GROUND && this.currentLevelIndex === 5) {
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'color';
                this.ctx.fillStyle = '#888888'; // Desaturate
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                
                // Add a heavy darkening multiply layer for dark gothic stone
                this.ctx.globalCompositeOperation = 'multiply';
                this.ctx.globalAlpha = 0.85;
                this.ctx.fillStyle = '#2a2a2a'; // Heavy charcoal
                this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                this.ctx.restore();
            }
        }
    }`;
replaceExactly(targetDrawTilesMatrixEnd, replacementDrawTilesMatrixEnd, 'drawSingleTile level ground multiply/color overlays');

// 18. Swamp rendering logic inside drawSingleTile()
// We place it right after drawSpentSingle replacement (which adds ONEUP)
const targetDrawSwampSingle = `        else if (type === TILES.ONEUP) matrix = SPRITES.TILES.ONEUP;
        else if (type === TILES.LAVA) {`;
const replacementDrawSwampSingle = `        else if (type === TILES.ONEUP) matrix = SPRITES.TILES.ONEUP;
        else if (type === TILES.SWAMP) {
            const frame = Math.floor(this.frameCounter / 18) % 3;
            if (frame === 0) matrix = SPRITES.TILES.LAVA_A;
            else if (frame === 1) matrix = SPRITES.TILES.LAVA_B;
            else matrix = SPRITES.TILES.LAVA_C;

            const isLevel5 = this.currentLevelIndex === 4;
            drawPixelMatrix(this.ctx, x, y, matrix, false, 4.5, isLevel5 ? BLOOD_COLORS : SWAMP_COLORS);
            
            // Add a toxic/blood glowing pulse
            const pulse = (Math.sin(this.frameCounter * 0.05) + 1) / 2;
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.globalAlpha = 0.1 + pulse * 0.15;
            const grd = this.ctx.createRadialGradient(
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2,
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE * 0.8
            );
            
            if (isLevel5) {
                grd.addColorStop(0,   'rgba(255, 50, 50, 1)');
                grd.addColorStop(0.5, 'rgba(200, 0, 0, 0.8)');
                grd.addColorStop(1,   'rgba(100, 0, 0, 0)');
            } else {
                grd.addColorStop(0,   'rgba(150, 255, 50, 1)');
                grd.addColorStop(0.5, 'rgba(50, 200, 0, 0.8)');
                grd.addColorStop(1,   'rgba(0, 100, 0, 0)');
            }
            
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            this.ctx.restore();
            
            // Randomly spawn gas particles from the swamp (low rate to avoid overloading particle engine)
            if (Math.random() < 0.002) {
                particles.spawnSwampGas(x + Math.random() * TILE_SIZE, y + Math.random() * (TILE_SIZE / 2), isLevel5);
            }
            return; // Swamp handled — skip matrix draw
        }
        else if (type === TILES.LAVA) {`;
replaceExactly(targetDrawSwampSingle, replacementDrawSwampSingle, 'drawSingleTile TILES.SWAMP matrix mapping and gas spawn');

// Write out patched code
fs.writeFileSync('game.js', gameCode.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully patched game.js!');
