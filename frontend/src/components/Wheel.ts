/**
 * Roulette Wheel Component
 * Renders the European roulette wheel with spin animation
 */

import Phaser from 'phaser';
import { WHEEL_ORDER, getNumberColor, getColorHex } from '../constants/roulette';

export class Wheel {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private wheelGraphics: Phaser.GameObjects.Graphics;
  private ballGraphics: Phaser.GameObjects.Graphics;
  private currentRotation: number = 0;
  private readonly WHEEL_RADIUS = 300; // Adjusted to 300 for better fit
  private readonly INNER_RADIUS = 160; // Adjusted from 170
  private readonly SEGMENT_COUNT = 37;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.wheelGraphics = scene.add.graphics();
    this.ballGraphics = scene.add.graphics();

    this.container.add([this.wheelGraphics, this.ballGraphics]);

    this.drawWheel();
    this.drawBall(0); // Start ball at 0
  }

  private drawWheel(): void {
    const graphics = this.wheelGraphics;
    graphics.clear();

    // Outer ring (gold border with bezel effect)
    graphics.lineStyle(16, 0xDAA520, 1); // GoldenRod
    graphics.strokeCircle(0, 0, this.WHEEL_RADIUS + 8);
    graphics.lineStyle(4, 0xB8860B, 1); // DarkGoldenRod inner detail
    graphics.strokeCircle(0, 0, this.WHEEL_RADIUS + 8);

    // Draw segments
    const segmentAngle = (Math.PI * 2) / this.SEGMENT_COUNT;

    for (let i = 0; i < this.SEGMENT_COUNT; i++) {
      const number = WHEEL_ORDER[i];
      const color = getColorHex(getNumberColor(number));

      const startAngle = i * segmentAngle - Math.PI / 2 + this.currentRotation;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      graphics.fillStyle(color, 1);
      graphics.slice(0, 0, this.WHEEL_RADIUS, startAngle, endAngle, false);
      graphics.fillPath();

      // Draw segment border
      graphics.lineStyle(2, 0xFFD700, 0.3);
      graphics.slice(0, 0, this.WHEEL_RADIUS, startAngle, endAngle, false);
      graphics.strokePath();

      // Draw number text
      const midAngle = startAngle + segmentAngle / 2;
      const textRadius = this.WHEEL_RADIUS - 35; // Moved slightly inward
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;

      // Add number text
      const text = this.scene.add.text(textX, textY, number.toString(), {
        fontFamily: 'Georgia',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);
      text.setRotation(midAngle + Math.PI / 2);
      this.container.add(text);
    }

    // Inner circle (center)
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillCircle(0, 0, this.INNER_RADIUS);

    // Inner ring decoration (Metallic effect)
    graphics.lineStyle(8, 0xC0C0C0, 1); // Silver
    graphics.strokeCircle(0, 0, this.INNER_RADIUS - 4);
    graphics.lineStyle(2, 0xFFD700, 1); // Gold accent
    graphics.strokeCircle(0, 0, this.INNER_RADIUS);

    // Center decoration (Hub)
    graphics.fillStyle(0xDAA520, 1); // Gold
    graphics.fillCircle(0, 0, 40);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(0, 0, 30);
    graphics.fillStyle(0xC0C0C0, 1); // Silver center
    graphics.fillCircle(0, 0, 15);

    // Draw pointer/marker at top
    const pointerGraphics = this.scene.add.graphics();
    pointerGraphics.fillStyle(0xFFD700, 1);
    pointerGraphics.lineStyle(2, 0x000000, 1);
    pointerGraphics.fillTriangle(
      0, -this.WHEEL_RADIUS - 30,
      -15, -this.WHEEL_RADIUS - 5,
      15, -this.WHEEL_RADIUS - 5
    );
    pointerGraphics.strokeTriangle(
      0, -this.WHEEL_RADIUS - 30,
      -15, -this.WHEEL_RADIUS - 5,
      15, -this.WHEEL_RADIUS - 5
    );
    this.container.add(pointerGraphics);
  }

  private drawBall(targetNumber: number): void {
    const graphics = this.ballGraphics;
    graphics.clear();

    // Find position of number
    const index = WHEEL_ORDER.indexOf(targetNumber);
    const segmentAngle = (Math.PI * 2) / this.SEGMENT_COUNT;
    const angle = index * segmentAngle - Math.PI / 2 + this.currentRotation + segmentAngle / 2;

    const ballRadius = this.WHEEL_RADIUS - 50;
    const ballX = Math.cos(angle) * ballRadius;
    const ballY = Math.sin(angle) * ballRadius;

    // Draw ball shadow
    graphics.fillStyle(0x000000, 0.4);
    graphics.fillCircle(ballX + 4, ballY + 4, 12);

    // Draw ball (white with silver gradient effect)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(ballX, ballY, 12);

    // Ball shading (subtle gradient simulation)
    graphics.lineStyle(1, 0xCCCCCC, 1);
    graphics.strokeCircle(ballX, ballY, 12);

    // Ball highlight
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(ballX - 4, ballY - 4, 5);
  }

  /**
   * Spin the wheel to a specific number
   * Returns a promise that resolves when the animation is complete
   */
  public async spinTo(targetNumber: number): Promise<void> {
    return new Promise((resolve) => {
      // Calculate target rotation
      const targetIndex = WHEEL_ORDER.indexOf(targetNumber);
      const segmentAngle = (Math.PI * 2) / this.SEGMENT_COUNT;

      // We want the target at the top (where the pointer is)
      // Pointer is at -90 degrees (top), so we need to calculate rotation
      const targetAngle = -targetIndex * segmentAngle;

      // Add multiple full rotations for effect (5-8 rotations)
      const fullRotations = 5 + Math.random() * 3;
      const totalRotation = this.currentRotation + (Math.PI * 2 * fullRotations) + targetAngle - this.currentRotation % (Math.PI * 2);

      // Spin duration: 4-5 seconds
      const duration = 4000 + Math.random() * 1000;

      // Animate using Phaser tweens
      this.scene.tweens.add({
        targets: this,
        currentRotation: totalRotation,
        duration: duration,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          this.redrawWheel();
          this.drawBall(targetNumber);
        },
        onComplete: () => {
          this.currentRotation = totalRotation % (Math.PI * 2);
          resolve();
        },
      });
    });
  }

  private redrawWheel(): void {
    // Clear and redraw with new rotation
    this.wheelGraphics.clear();

    // Remove old number texts
    const children = this.container.getAll();
    children.forEach((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });

    // Outer ring (gold border with bezel effect)
    this.wheelGraphics.lineStyle(16, 0xDAA520, 1); // GoldenRod
    this.wheelGraphics.strokeCircle(0, 0, this.WHEEL_RADIUS + 8);
    this.wheelGraphics.lineStyle(4, 0xB8860B, 1); // DarkGoldenRod inner detail
    this.wheelGraphics.strokeCircle(0, 0, this.WHEEL_RADIUS + 8);

    // Draw segments with current rotation
    const segmentAngle = (Math.PI * 2) / this.SEGMENT_COUNT;

    for (let i = 0; i < this.SEGMENT_COUNT; i++) {
      const number = WHEEL_ORDER[i];
      const color = getColorHex(getNumberColor(number));

      const startAngle = i * segmentAngle - Math.PI / 2 + this.currentRotation;
      const endAngle = startAngle + segmentAngle;

      this.wheelGraphics.fillStyle(color, 1);
      this.wheelGraphics.slice(0, 0, this.WHEEL_RADIUS, startAngle, endAngle, false);
      this.wheelGraphics.fillPath();

      this.wheelGraphics.lineStyle(2, 0xFFD700, 0.3);
      this.wheelGraphics.slice(0, 0, this.WHEEL_RADIUS, startAngle, endAngle, false);
      this.wheelGraphics.strokePath();

      // Number text
      const midAngle = startAngle + segmentAngle / 2;
      const textRadius = this.WHEEL_RADIUS - 35; // Moved slightly inward
      const textX = Math.cos(midAngle) * textRadius;
      const textY = Math.sin(midAngle) * textRadius;

      // Add space before number to prevent browser CSS color parsing issues
      const displayNumber = ` ${number}`;
      const text = this.scene.add.text(textX, textY, displayNumber, {
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        padding: { x: 2, y: 2 },
      }).setOrigin(0.5);
      text.setRotation(midAngle + Math.PI / 2);
      this.container.add(text);
    }

    // Inner circle
    this.wheelGraphics.fillStyle(0x1a1a2e, 1);
    this.wheelGraphics.fillCircle(0, 0, this.INNER_RADIUS);

    // Inner ring decoration (Metallic effect)
    this.wheelGraphics.lineStyle(8, 0xC0C0C0, 1); // Silver
    this.wheelGraphics.strokeCircle(0, 0, this.INNER_RADIUS - 4);
    this.wheelGraphics.lineStyle(2, 0xFFD700, 1); // Gold accent
    this.wheelGraphics.strokeCircle(0, 0, this.INNER_RADIUS);

    // Center decoration (Hub)
    this.wheelGraphics.fillStyle(0xDAA520, 1); // Gold
    this.wheelGraphics.fillCircle(0, 0, 40);
    this.wheelGraphics.fillStyle(0x000000, 1);
    this.wheelGraphics.fillCircle(0, 0, 30);
    this.wheelGraphics.fillStyle(0xC0C0C0, 1); // Silver center
    this.wheelGraphics.fillCircle(0, 0, 15);
  }
}
