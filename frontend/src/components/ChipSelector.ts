  /**
   * Chip Selector Component
   * Allows players to select chip denomination
   */

  import Phaser from 'phaser';
  import { CHIP_VALUES, ChipValue } from '../constants/roulette';

  export class ChipSelector {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private selectedChip: ChipValue;
    private chipButtons: Map<ChipValue, Phaser.GameObjects.Container> = new Map();
    private onChipSelected: (value: ChipValue) => void;

    constructor(scene: Phaser.Scene, x: number, y: number, onChipSelected: (value: ChipValue) => void) {
      this.scene = scene;
      this.selectedChip = CHIP_VALUES[0];
      this.onChipSelected = onChipSelected;
      this.container = scene.add.container(x, y);

      this.createChips();
    }

    private createChips(): void {
      // Label
      const label = this.scene.add.text(0, -60, 'SELECT CHIP', { // Moved closer to chips (-75 -> -60)
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#ffd700',
      }).setOrigin(0.5);
      this.container.add(label);

      // Create chip buttons
      const chipColors: Record<number, number> = {
        1: 0xffffff,
        5: 0xB00000, // Deep Red
        10: 0x0066ff,
        25: 0x008000, // Deep Green
        100: 0x000000,
      };

      const spacing = 90; // Increased from 70
      const startX = -((CHIP_VALUES.length - 1) * spacing) / 2;

      CHIP_VALUES.forEach((value, index) => {
        const chipX = startX + index * spacing;
        const chipContainer = this.scene.add.container(chipX, 0);

        const graphics = this.scene.add.graphics();

        // Draw chip
        this.drawChip(graphics, 0, 0, chipColors[value], value === this.selectedChip);

        // Chip value
        const text = this.scene.add.text(0, 0, value.toString(), {
          fontFamily: 'Arial',
          fontSize: '22px',
          fontStyle: 'bold',
          color: '#000000', // Always black on white center
        }).setOrigin(0.5);

        chipContainer.add([graphics, text]);
        chipContainer.setSize(80, 80); // Increased from 60, 60
        chipContainer.setInteractive({ useHandCursor: true });

        chipContainer.on('pointerdown', () => {
          this.selectChip(value);
        });

        this.container.add(chipContainer);
        this.chipButtons.set(value, chipContainer);
      });
    }

    private drawChip(graphics: Phaser.GameObjects.Graphics, x: number, y: number, color: number, selected: boolean): void {
      graphics.clear();

      const radius = 35; // Large radius for selector

      // Selection glow
      if (selected) {
        graphics.fillStyle(0xffd700, 0.4);
        graphics.fillCircle(x, y, radius + 8);
      }

      // Shadow
      graphics.fillStyle(0x000000, 0.4);
      graphics.fillCircle(x + 4, y + 4, radius);

      // Chip body (Main Color)
      graphics.fillStyle(color, 1);
      graphics.fillCircle(x, y, radius);

      // Dashed/Striped Edge Effect
      graphics.lineStyle(6, 0xFFFFFF, 0.8);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const startX = x + Math.cos(angle) * (radius - 8);
        const startY = y + Math.sin(angle) * (radius - 8);
        const endX = x + Math.cos(angle) * radius;
        const endY = y + Math.sin(angle) * radius;

        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();
      }

      // Inner white circle for value
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(x, y, radius - 12);

      // Inner ring border
      graphics.lineStyle(1, 0x000000, 0.2);
      graphics.strokeCircle(x, y, radius - 12);

      // Outer Border
      graphics.lineStyle(selected ? 3 : 1, selected ? 0xffd700 : 0xFFFFFF, 0.8);
      graphics.strokeCircle(x, y, radius);
    }

    private selectChip(value: ChipValue): void {
      this.selectedChip = value;
      this.onChipSelected(value);

      // Redraw all chips
      const chipColors: Record<number, number> = {
        1: 0xffffff,
        5: 0xff0000,
        10: 0x0066ff,
        25: 0x00cc00,
        100: 0x000000,
      };

      this.chipButtons.forEach((container, chipValue) => {
        const graphics = container.getAt(0) as Phaser.GameObjects.Graphics;
        this.drawChip(graphics, 0, 0, chipColors[chipValue], chipValue === value);
      });
    }
  }
