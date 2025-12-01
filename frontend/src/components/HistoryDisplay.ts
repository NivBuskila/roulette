/**
 * History Display Component
 * Shows recent game results
 */

import Phaser from 'phaser';
import { GameHistoryEntry, RouletteColor } from '../types';

export class HistoryDisplay {
  private scene: Phaser.Scene;
  public container: Phaser.GameObjects.Container;
  private historyItems: Phaser.GameObjects.Container[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    this.create();
  }

  private create(): void {
    // Main container background (Glassmorphism effect)
    const graphics = this.scene.add.graphics();

    // Panel Background
    graphics.fillStyle(0x0f1923, 0.95); // Very dark blue/black
    graphics.fillRoundedRect(-125, 0, 250, 460, 16);

    // Header Background
    graphics.fillStyle(0x1a2634, 1);
    graphics.fillRoundedRect(-125, 0, 250, 50, { tl: 16, tr: 16, bl: 0, br: 0 });

    // Border
    graphics.lineStyle(2, 0xFFD700, 0.8); // Gold border
    graphics.strokeRoundedRect(-125, 0, 250, 460, 16);

    // Separator line under headers
    graphics.lineStyle(1, 0xFFFFFF, 0.1);
    graphics.lineBetween(-110, 85, 110, 85);

    this.container.add(graphics);

    // Title with Icon
    const title = this.scene.add.text(0, 25, 'RECENT RESULTS', {
      fontFamily: 'Arial',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#FFD700',
      letterSpacing: 1
    }).setOrigin(0.5);
    this.container.add(title);

    // Column Headers
    const resultHeader = this.scene.add.text(-50, 65, 'RESULT', {
      fontFamily: 'Arial',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#8899A6',
    }).setOrigin(0.5);
    this.container.add(resultHeader);

    const profitHeader = this.scene.add.text(50, 65, 'PROFIT', {
      fontFamily: 'Arial',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#8899A6',
    }).setOrigin(0.5);
    this.container.add(profitHeader);
  }

  public update(history: GameHistoryEntry[]): void {
    // Clear previous items
    this.historyItems.forEach(item => item.destroy());
    this.historyItems = [];

    // Show up to 8 recent results (reduced count for better spacing)
    const recentHistory = history.slice(0, 8);

    recentHistory.forEach((entry, index) => {
      const yPos = 110 + index * 45;
      const itemContainer = this.scene.add.container(0, yPos);

      // Row background (alternating)
      if (index % 2 === 0) {
        const bg = this.scene.add.graphics();
        bg.fillStyle(0xFFFFFF, 0.03);
        bg.fillRoundedRect(-115, -20, 230, 40, 4);
        itemContainer.add(bg);
      }

      // Number circle (Ball style)
      const graphics = this.scene.add.graphics();

      // Determine color based on winning number
      let color = 0x000000;
      if (entry.winningNumber === 0) color = 0x008000; // Green
      else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(entry.winningNumber)) color = 0xB00000; // Red
      else color = 0x111111; // Black

      // Ball shadow
      graphics.fillStyle(0x000000, 0.5);
      graphics.fillCircle(-50 + 2, 2, 16);

      // Ball body
      graphics.fillStyle(color, 1);
      graphics.fillCircle(-50, 0, 16);

      // Ball shine/highlight
      graphics.fillStyle(0xFFFFFF, 0.2);
      graphics.fillCircle(-50 - 4, -4, 6);

      // Ball border
      graphics.lineStyle(1, 0xFFFFFF, 0.3);
      graphics.strokeCircle(-50, 0, 16);

      itemContainer.add(graphics);

      // Number text
      const numberText = this.scene.add.text(-50, 0, `${entry.winningNumber}`, {
        fontFamily: 'Georgia',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
      }).setOrigin(0.5);
      itemContainer.add(numberText);

      // Profit/Loss
      const isWin = entry.netProfit > 0;
      const isLoss = entry.netProfit < 0;

      const profitColor = isWin ? '#4ADE80' : // Soft Green
        isLoss ? '#F87171' : '#FFD700'; // Soft Red or Gold

      const profitSign = entry.netProfit > 0 ? '+' : '';

      // Profit Text
      const profitText = this.scene.add.text(50, 0, `${profitSign}${entry.netProfit}`, {
        fontFamily: 'Consolas, monospace', // Monospace for alignment
        fontSize: '18px',
        fontStyle: 'bold',
        color: profitColor,
      }).setOrigin(0.5);

      itemContainer.add(profitText);

      this.container.add(itemContainer);
      this.historyItems.push(itemContainer);
    });

    // Show "No history" if empty
    if (recentHistory.length === 0) {
      const emptyText = this.scene.add.text(0, 230, 'No games played yet', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#666666',
        fontStyle: 'italic'
      }).setOrigin(0.5);

      const emptyContainer = this.scene.add.container(0, 0);
      emptyContainer.add(emptyText);
      this.container.add(emptyContainer);
      this.historyItems.push(emptyContainer);
    }
  }

  private getColorHex(color: RouletteColor): number {
    switch (color) {
      case 'red': return 0xdc3545;
      case 'black': return 0x212529;
      case 'green': return 0x28a745;
    }
  }
}
