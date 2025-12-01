/**
 * Balance Display Component
 * Shows current balance and total bet amount
 */

import Phaser from 'phaser';

export class BalanceDisplay {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private balanceText!: Phaser.GameObjects.Text;
  private betText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    this.create();
  }

  private create(): void {
    // Background panel
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x1a1a2e, 0.9);
    graphics.fillRoundedRect(-130, -50, 260, 100, 12);
    graphics.lineStyle(2, 0xffd700, 1);
    graphics.strokeRoundedRect(-130, -50, 260, 100, 12);
    this.container.add(graphics);

    // Balance label
    const balanceLabel = this.scene.add.text(-110, -25, '💰 Balance:', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#aaaaaa',
    }).setOrigin(0, 0.5);
    this.container.add(balanceLabel);

    // Balance value
    this.balanceText = this.scene.add.text(110, -25, '$1000', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#00FF00', // Bright Green
    }).setOrigin(1, 0.5);
    this.container.add(this.balanceText);

    // Bet label
    const betLabel = this.scene.add.text(-110, 25, '🎲 Total Bet:', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#aaaaaa',
    }).setOrigin(0, 0.5);
    this.container.add(betLabel);

    // Bet value
    this.betText = this.scene.add.text(110, 25, '$0', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(1, 0.5);
    this.container.add(this.betText);
  }

  public update(balance: number, totalBet: number): void {
    this.balanceText.setText(`$${balance}`);
    this.betText.setText(`$${totalBet}`);

    // Color based on balance state
    if (balance < 100) {
      this.balanceText.setColor('#dc3545');
    } else if (balance < 500) {
      this.balanceText.setColor('#ffc107');
    } else {
      this.balanceText.setColor('#28a745');
    }
  }
}
