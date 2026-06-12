class AudioSynth {
    constructor() {
        this.ctx = null;
        this._musicEnabled = true; // Re-enabled for production!
        this.sfxEnabled = true;
        this.sfxBuffers = {};
        this.musicBuffers = {};
        this.currentMusicKey = 'music_level1';
        this.musicSource = null;
        this.starMusicBuffer = null;
        this.starMusicSource = null;
    }

    get musicEnabled() {
        return this._musicEnabled;
    }

    set musicEnabled(val) {
        this._musicEnabled = val;
        if (val) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this._loadAllSfx();
        this._loadMusic();
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    pause() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
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
            fire:    'sfx/fire.wav',
            ambience1:'sfx/lvl1_ambience.wav?v=2',
            ambience2:'sfx/lvl2_ambience.wav?v=2',
            belltoll:'sfx/bell_toll.wav?v=2',
            deathbell:'sfx/death_bell.wav',
            loselife:'sfx/loselifesound.wav',
            gameover:'sfx/gameover_sound.wav'
        };
        Object.entries(files).forEach(([key, path]) => {
            fetch(path)
                .then(r => r.arrayBuffer())
                .then(ab => this.ctx.decodeAudioData(ab))
                .then(buf => { 
                    this.sfxBuffers[key] = buf; 
                    if (this._pendingSfx && this._pendingSfx[key] !== undefined) {
                        this._playBuffer(key, this._pendingSfx[key]);
                        delete this._pendingSfx[key];
                    }
                    if (key.startsWith('ambience') && this._pendingAmbiencePlay === key) {
                        this.playAmbience(key === 'ambience2' ? 1 : 0);
                    }
                })
                .catch(err => console.warn("Failed to load SFX:", key, err));
        });
    }

    _loadMusic() {
        const loadTrack = (path, key) => {
            fetch(path)
                .then(r => r.arrayBuffer())
                .then(ab => this.ctx.decodeAudioData(ab))
                .then(buf => {
                    this.musicBuffers[key] = buf;
                    if (this._musicEnabled && this.currentMusicKey === key && !this.starMusicSource) {
                        this.startMusic(key);
                    }
                })
                .catch(err => console.warn("Failed to load music track:", key, err));
        };

        loadTrack('music/game_music.wav', 'music_level1');
        loadTrack('music/game_musiclvl2.wav', 'music_level2');
        loadTrack('music/game_musiclvl3.wav', 'music_level3');
            
        fetch('music/star_music.wav')
            .then(r => r.arrayBuffer())
            .then(ab => this.ctx.decodeAudioData(ab))
            .then(buf => {
                this.starMusicBuffer = buf;
            })
            .catch(err => console.warn("Failed to load star music:", err));
    }

    startMusic(key) {
        if (key) this.currentMusicKey = key;
        const targetKey = this.currentMusicKey;
        
        if (!this.ctx || !this.musicBuffers[targetKey] || !this._musicEnabled) return;
        if (this.musicSource) this.stopMusic();

        this.musicSource = this.ctx.createBufferSource();
        this.musicSource.buffer = this.musicBuffers[targetKey];
        this.musicSource.loop = true;
        
        const gain = this.ctx.createGain();
        
        // Level 1 music is mastered louder, so we lower it to match 2 & 3
        if (targetKey === 'music_level1') {
            gain.gain.value = 0.15; 
        } else {
            gain.gain.value = 0.4;
        }
        
        this.musicSource.connect(gain);
        gain.connect(this.ctx.destination);
        
        this.musicSource.start();
    }

    stopMusic() {
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
            this.musicSource = null;
        }
    }
    
    playStarMusic() {
        if (!this.ctx || !this.starMusicBuffer || !this._musicEnabled) return;
        this.stopMusic(); // Stop regular music
        if (this.starMusicSource) {
            this.starMusicSource.stop();
            this.starMusicSource.disconnect();
        }
        this.starMusicSource = this.ctx.createBufferSource();
        this.starMusicSource.buffer = this.starMusicBuffer;
        this.starMusicSource.loop = true;
        const gain = this.ctx.createGain();
        gain.gain.value = 0.2; // Lowered to be more restrained and match other tracks
        this.starMusicSource.connect(gain);
        gain.connect(this.ctx.destination);
        this.starMusicSource.start();
    }
    
    stopStarMusic() {
        if (this.starMusicSource) {
            this.starMusicSource.stop();
            this.starMusicSource.disconnect();
            this.starMusicSource = null;
        }
        if (this._musicEnabled) {
            this.startMusic(); // Resume normal music
        }
    }

    _playBuffer(key, volume = 1.0) {
        console.log("_playBuffer called for", key);
        if (!this.ctx || !this.sfxEnabled) return;
        const buf = this.sfxBuffers[key];
        if (!buf) {
            console.log("_playBuffer pending for", key);
            this._pendingSfx = this._pendingSfx || {};
            this._pendingSfx[key] = volume;
            return;
        }
        console.log("_playBuffer executing for", key);
        const source = this.ctx.createBufferSource();
        source.buffer = this.sfxBuffers[key];
        const gain = this.ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.ctx.state === 'suspended') this.ctx.resume();
        source.start();
        return true;
    }

    // --- SFX API ---
    playJump()     { this._playBuffer('jump', 0.6); }
    playFireball() { this._playBuffer('fireball', 0.6); }
    playFire()     { this._playBuffer('fire', 0.7); }
    playStomp()    { this._playBuffer('stomp', 0.8); }
    playCollect()  { this._playBuffer('collect', 0.7); }
    playCrunch()   { this._playBuffer('crunch', 0.8); }
    playVictory()  { this._playBuffer('victory', 0.8); }
    playDamage()   { this._playBuffer('damage', 0.5); }
    playOneUp()    { this._playBuffer('oneup', 0.8); }
    playLoseLife() { this._playBuffer('loselife', 0.4); }
    playGameOver() { 
        this._playBuffer('gameover', 0.5); 
        this._playBuffer('deathbell', 1.0);
    }
    playBellToll() { 
        console.log("playBellToll called");
        this._playBuffer('belltoll', 1.0); 
    }
    
    playAmbience(levelIndex = 0) {
        console.log("playAmbience called for level", levelIndex);
        if (!this.ctx || !this.sfxEnabled) {
            console.log("playAmbience aborted: no ctx or sfx disabled");
            return;
        }
        
        const trackKey = levelIndex === 1 ? 'ambience2' : 'ambience1';
        
        if (!this.sfxBuffers[trackKey]) {
            console.log("playAmbience pending: buffer not loaded", trackKey);
            this._pendingAmbiencePlay = trackKey;
            return;
        }
        
        console.log("playAmbience executing", trackKey);
        this._pendingAmbiencePlay = null;
        this.stopAmbience();
        
        this.ambienceSource = this.ctx.createBufferSource();
        this.ambienceSource.buffer = this.sfxBuffers[trackKey];
        this.ambienceSource.loop = true;
        
        const gain = this.ctx.createGain();
        gain.gain.value = trackKey === 'ambience2' ? 0.5 : 1.0; 
        
        this.ambienceSource.connect(gain);
        gain.connect(this.ctx.destination);
        
        // Use ctx.resume() to ensure playback starts if suspended
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.ambienceSource.start();
    }
    
    stopAmbience() {
        if (this.ambienceSource) {
            this.ambienceSource.stop();
            this.ambienceSource.disconnect();
            this.ambienceSource = null;
        }
    }
}