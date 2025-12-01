import Phaser from 'phaser';

export class ChipRenderer {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.container = container;
    }

    public drawChip(x: number, y: number, value: number): void {
        // Determine chip color based on value
        const colors: Record<number, number> = {
            1: 0xffffff,
            5: 0xB00000, // Deep Red
            10: 0x0066ff,
            25: 0x008000, // Deep Green
            100: 0x111111, // Almost Black
        };

        const chipColor = colors[value] || 0xffffff;
        const radius = 14;

        const graphics = this.scene.add.graphics();

        // Chip shadow
        graphics.fillStyle(0x000000, 0.4);
        graphics.fillCircle(x + 2, y + 2, radius);

        // Chip body (Main Color)
        graphics.fillStyle(chipColor, 1);
        graphics.fillCircle(x, y, radius);

        // Dashed/Striped Edge Effect
        graphics.lineStyle(4, 0xFFFFFF, 0.7);
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const startX = x + Math.cos(angle) * (radius - 4);
            const startY = y + Math.sin(angle) * (radius - 4);
            const endX = x + Math.cos(angle) * radius;
            const endY = y + Math.sin(angle) * radius;

            const stripeGraphics = this.scene.add.graphics();
            stripeGraphics.lineStyle(3, 0xFFFFFF, 0.8);
            stripeGraphics.beginPath();
            stripeGraphics.moveTo(startX, startY);
            stripeGraphics.lineTo(endX, endY);
            stripeGraphics.strokePath();
            this.container.add(stripeGraphics);
        }

        // Inner white circle for value
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(x, y, radius - 5);

        // Inner ring border
        graphics.lineStyle(1, 0x000000, 0.2);
        graphics.strokeCircle(x, y, radius - 5);

        // Outer Border
        graphics.lineStyle(1, 0xFFFFFF, 0.5);
        graphics.strokeCircle(x, y, radius);

        this.container.add(graphics);

        // Chip value text
        const text = this.scene.add.text(x, y, value.toString(), {
            fontFamily: 'Arial',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#000000', // Always black on white center
        }).setOrigin(0.5);

        this.container.add(text);
    }

    public clear(): void {
        this.container.removeAll(true);
    }
}
