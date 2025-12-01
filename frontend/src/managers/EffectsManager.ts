import Phaser from 'phaser';

export class EffectsManager {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public createParticleTextures(): void {
        // Gold Coin Texture
        const goldGraphics = this.scene.make.graphics({ x: 0, y: 0 });
        goldGraphics.fillStyle(0xffd700, 1);
        goldGraphics.fillCircle(8, 8, 8);
        goldGraphics.lineStyle(2, 0xB8860B, 1);
        goldGraphics.strokeCircle(8, 8, 8);
        goldGraphics.generateTexture('particle_gold', 16, 16);
        goldGraphics.destroy();

        // Sparkle Texture (Diamond shape)
        const sparkleGraphics = this.scene.make.graphics({ x: 0, y: 0 });
        sparkleGraphics.fillStyle(0xffffff, 1);
        sparkleGraphics.beginPath();
        sparkleGraphics.moveTo(8, 0);
        sparkleGraphics.lineTo(10, 8);
        sparkleGraphics.lineTo(16, 8);
        sparkleGraphics.lineTo(10, 10);
        sparkleGraphics.lineTo(8, 16);
        sparkleGraphics.lineTo(6, 10);
        sparkleGraphics.lineTo(0, 8);
        sparkleGraphics.lineTo(6, 8);
        sparkleGraphics.closePath();
        sparkleGraphics.fillPath();
        sparkleGraphics.generateTexture('particle_sparkle', 16, 16);
        sparkleGraphics.destroy();

        // Warm up particle system to avoid first-spin delay
        this.warmUpParticles();
    }

    private warmUpParticles(): void {
        // Create and immediately destroy particle emitters to preload GPU resources
        const warmupGold = this.scene.add.particles(0, 0, 'particle_gold', {
            x: -1000, y: -1000,
            lifespan: 1,
            quantity: 1,
            emitting: false
        });

        const warmupSparkle = this.scene.add.particles(0, 0, 'particle_sparkle', {
            x: -1000, y: -1000,
            lifespan: 1,
            quantity: 1,
            emitting: false,
            blendMode: 'ADD'
        });

        // Emit one particle offscreen to force GPU compilation
        warmupGold.explode(1);
        warmupSparkle.explode(1);

        // Clean up after a short delay
        this.scene.time.delayedCall(100, () => {
            warmupGold.destroy();
            warmupSparkle.destroy();
        });
    }

    public playWinAnimation(amount: number): void {
        const { width, height } = this.scene.scale;

        // Gold coins explosion
        const goldEmitter = this.scene.add.particles(0, 0, 'particle_gold', {
            x: width / 2,
            y: height / 2,
            speed: { min: 200, max: 600 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0.5 },
            lifespan: 3000,
            gravityY: 400,
            quantity: 40,
            emitting: false
        });

        // Sparkles
        const sparkleEmitter = this.scene.add.particles(0, 0, 'particle_sparkle', {
            x: width / 2,
            y: height / 2,
            speed: { min: 100, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            gravityY: 100,
            quantity: 30,
            emitting: false,
            blendMode: 'ADD'
        });

        goldEmitter.explode(50);
        sparkleEmitter.explode(50);

        // Big Win Text if amount is large (e.g. > 100)
        if (amount >= 100) {
            const winText = this.scene.add.text(width / 2, height / 2, 'BIG WIN!', {
                fontFamily: 'Arial Black',
                fontSize: '64px',
                color: '#ffd700',
                stroke: '#000000',
                strokeThickness: 8,
                shadow: { blur: 10, color: '#ffffff', fill: true }
            }).setOrigin(0.5).setScale(0);

            this.scene.tweens.add({
                targets: winText,
                scale: 1.5,
                duration: 500,
                ease: 'Back.out',
                yoyo: true,
                hold: 1000,
                onComplete: () => winText.destroy()
            });
        }

        // Cleanup emitters
        this.scene.time.delayedCall(4000, () => {
            goldEmitter.destroy();
            sparkleEmitter.destroy();
        });
    }
}
