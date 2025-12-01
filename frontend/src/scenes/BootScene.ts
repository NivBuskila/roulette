/**
 * Boot Scene
 * Loads assets and initializes the game
 */

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Show loading progress
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading background
    const bg = this.add.graphics();
    bg.fillStyle(0x0f3460, 1);
    bg.fillRect(0, 0, width, height);

    // Casino-style loading text
    const titleText = this.add.text(width / 2, height / 2 - 80, '🎰 ROULETTE 🎰', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(width / 2, height / 2 + 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffd700, 1);
      progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 8);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      titleText.destroy();
      bg.destroy();
    });

    // Fake a small load to show the loading screen
    this.load.image('__preload__', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  }

  create(): void {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}
