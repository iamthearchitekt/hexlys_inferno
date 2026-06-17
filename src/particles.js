// 6. RETRO DYNAMIC PARTICLES ENGINE
// ----------------------------------------------------
class Particle {
    constructor(x, y, vx, vy, color, size, life, type = 'ember') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.type = type;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.type === 'ember') {
            this.vy -= 0.02;
            this.vx += (Math.random() - 0.5) * 0.1;
        } else if (this.type === 'debris') {
            this.vy += 0.25;
        } else if (this.type === 'dust') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        }
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        if (this.type === 'haze') {
            ctx.globalAlpha = alpha * 0.4;
            const radius = this.size * 12; // Large fog radius
            
            ctx.translate(Math.floor(this.x - cameraX), Math.floor(this.y));
            ctx.scale(1, 0.35); // Squish the circle into a low-lying oval (slightly thicker to envelop Hexly)
            
            // Convert HEX to RGBA dynamically for smooth fading
            let r = 155, g = 161, b = 38; // Default mustard swamp green
            if (this.color && this.color.startsWith('#')) {
                const hex = this.color.replace('#', '');
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }

            const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
            grd.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.5)`);
            grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.fillStyle = grd;
            ctx.globalCompositeOperation = 'screen'; // Soft misty glow when overlapping — won't bleed red into soul shards
            
            // Add a heavy blur filter for true fog/vapor effect
            ctx.filter = 'blur(12px)';
            
            ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        } else {
            ctx.globalAlpha = alpha;
            if (this.type === 'crystal') {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
            }
            ctx.fillRect(Math.floor(this.x - cameraX - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
        }
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(p) {
        if (this.particles.length > 200) this.particles.shift();
        this.particles.push(p);
    }

    spawnEmber(x, y) {
        const colors = ['#f95700', '#f7be00', '#e61e29'];
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.8, -Math.random() * 0.7 - 0.3, colors[Math.floor(Math.random() * colors.length)], Math.random() * 3 + 1, Math.random() * 80 + 40, 'ember'));
    }

    spawnSoulSpark(x, y) {
        const colors = ['#cc00ff', '#e066ff', '#8a00e6'];
        this.add(new Particle(x, y, (Math.random() - 0.5) * 1.5, -Math.random() * 1.5 - 0.5, colors[Math.floor(Math.random() * colors.length)], Math.random() * 4 + 2, Math.random() * 50 + 30, 'ember'));
    }

    spawnHaze(x, y) {
        // Sickly mustard-yellow fog colors to match the background sky
        const colors = ['#a3a828', '#868a21', '#656919'];
        // vy is near zero so the mist stays low instead of floating away into the sky
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.05, colors[Math.floor(Math.random() * colors.length)], Math.random() * 4 + 2, Math.random() * 100 + 50, 'haze'));
    }

    spawnLavaBubble(x, y) {
        this.add(new Particle(x, y, (Math.random() - 0.5) * 0.3, -Math.random() * 0.4 - 0.2, '#f95700', Math.random() * 4 + 2, Math.random() * 50 + 20, 'dust'));
    }

    spawnStompExplosion(x, y) {
        const colors = ['#ffffff', '#f7be00', '#e61e29'];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.5 + 1.5;
            this.add(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, colors[Math.floor(Math.random() * colors.length)], Math.random() * 4 + 2, Math.random() * 25 + 15, 'dust'));
        }
    }

    spawnSlimeExplosion(x, y) {
        const colors = ['#4caf50', '#8bc34a', '#388e3c', '#2e7d32']; // Sludge greens
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.0 + 1.0;
            this.add(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, colors[Math.floor(Math.random() * colors.length)], Math.random() * 5 + 3, Math.random() * 30 + 20, 'slime'));
        }
    }

    spawnMistExplosion(x, y) {
        const colors = ['#888888', '#aaaaaa', '#cccccc', '#e0e0e0'];
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.5;
            this.add(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.5, colors[Math.floor(Math.random() * colors.length)], Math.random() * 4 + 2, Math.random() * 30 + 20, 'dust'));
        }
    }

    spawnBlockDebris(x, y) {
        const colors = ['#555555', '#777777', '#999999', '#333333'];
        for (let i = 0; i < 8; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 4, -Math.random() * 3 - 2, colors[Math.floor(Math.random() * colors.length)], Math.random() * 6 + 3, Math.random() * 30 + 15, 'debris'));
        }
    }

    spawnFireExplosion(x, y) {
        const colors = ['#ff4400', '#ff8800', '#ffdd00', '#ffffff'];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd   = Math.random() * 3.5 + 1;
            this.add(new Particle(
                x, y,
                Math.cos(angle) * spd,
                Math.sin(angle) * spd,
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 5 + 3,
                Math.random() * 25 + 12,
                'debris'
            ));
        }
    }

    spawnJumpDust(x, y) {
        // More prominent jump dust cloud! (24 dynamic particles with brighter colors and larger spreads)
        for (let i = 0; i < 12; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 3.5, -Math.random() * 1.5 - 0.2, 'rgba(255, 180, 100, 0.6)', Math.random() * 9 + 6, Math.random() * 25 + 15, 'dust'));
            this.add(new Particle(x, y, (Math.random() - 0.5) * 2.0, -Math.random() * 0.8 - 0.1, 'rgba(200, 70, 0, 0.5)', Math.random() * 7 + 4, Math.random() * 20 + 10, 'dust'));
        }
    }

    spawnCrystalExplosion(x, y, isBig = false) {
        const count = isBig ? 15 : 6;
        const colors = ['#cc00ff', '#8a2be2', '#da70d6', '#ffffff'];
        for (let i=0; i<count; i++) {
            const vx = (Math.random() - 0.5) * (isBig ? 6 : 4);
            const vy = -Math.random() * (isBig ? 6 : 3) - 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 5 + 2;
            const life = Math.random() * 30 + 15;
            this.add(new Particle(x, y, vx, vy, color, size, life, 'crystal'));
        }
    }

    spawnHexlyVaporizeBlast(x, y, w, h) {
        for (let i = 0; i < 150; i++) {
            const colors = ['#ff6a00', '#f7be00', '#ff9900', '#f95700'];
            this.add(new Particle(
                x + Math.random() * w,
                y + Math.random() * h,
                (Math.random() - 0.5) * 3.0, // Reduced horizontal spread
                (Math.random() * -3.0) - 1.0, // Reduced vertical height
                colors[Math.floor(Math.random() * colors.length)],
                Math.random() * 3 + 1, // smaller pixels
                Math.random() * 15 + 10, // Much shorter lifespan (10 to 25 frames)
                'ember'
            ));
        }
    }

    spawnVictoryConfetti(x, y) {
        const colors = ['#ff6a00', '#f7be00', '#ff0055', '#ff5a67', '#ffffff'];
        for (let i = 0; i < 4; i++) {
            this.add(new Particle(x, y, (Math.random() - 0.5) * 5, -Math.random() * 5 - 2, colors[Math.floor(Math.random() * colors.length)], Math.random() * 5 + 3, Math.random() * 80 + 40, 'debris'));
        }
    }

    update(windSpeed = 0) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx + (windSpeed * 0.8); // Wind affects particles slightly less than player
            p.y += p.vy;
            
            p.life--;
            
            if (p.type === 'ember') {
                p.vy += 0.015; // Embers drift up slower
            } else if (p.type === 'haze') {
                p.vx += Math.sin(p.life * 0.1) * 0.02; // Haze oscillates horizontally
            }
            if (p.life <= 0 || p.y > 560) this.particles.splice(i, 1);
        }
    }

    draw(ctx, cameraX) {
        this.particles.forEach(p => p.draw(ctx, cameraX));
    }
}
const particles = new ParticleSystem();


// ----------------------------------------------------
