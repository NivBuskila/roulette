import Phaser from 'phaser';
import {
    getNumberColor,
    getColorHex,
    COLUMNS
} from '../../constants/roulette';

export class TableRenderer {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;

    public readonly CELL_WIDTH = 60;
    public readonly CELL_HEIGHT = 80;

    // Map to store cell coordinates for highlighting
    public numberCells: Map<number, { x: number, y: number, width: number, height: number }> = new Map();

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.container = container;
    }

    public draw(): void {
        const graphics = this.scene.add.graphics();
        this.container.add(graphics);

        this.drawBackground(graphics);
        this.drawZero(graphics);
        this.drawNumberGrid(graphics);
        this.drawOutsideBets(graphics);
    }

    private drawBackground(graphics: Phaser.GameObjects.Graphics): void {
        // Table background dimensions calculation
        // Width: Padding(5) + Zero(1) + Gap(5) + Numbers(12) + Gap(5) + 2to1(1) + Padding(5)
        const totalWidth = this.CELL_WIDTH * 14 + 20;

        // Height: Padding(5) + Grid(3) + Gap(10) + Dozens(50px) + Gap(5) + EvenMoney(50px) + Padding(5)
        const totalHeight = this.CELL_HEIGHT * 3 + 125;

        // Main table border/background
        graphics.fillStyle(0x0f3460, 1);
        graphics.fillRoundedRect(-15, -15, totalWidth + 30, totalHeight + 30, 15);
        graphics.lineStyle(4, 0xFFD700, 1); // Gold border
        graphics.strokeRoundedRect(-15, -15, totalWidth + 30, totalHeight + 30, 15);

        // Green felt texture effect
        graphics.fillStyle(0x35654d, 1); // Casino Green
        graphics.fillRoundedRect(0, 0, totalWidth, totalHeight, 8);
    }

    private drawZero(graphics: Phaser.GameObjects.Graphics): void {
        // Zero cell (spans 3 rows on the left)
        const zeroWidth = this.CELL_WIDTH;
        const zeroHeight = this.CELL_HEIGHT * 3;

        this.numberCells.set(0, { x: 5, y: 5, width: zeroWidth, height: zeroHeight });

        graphics.fillStyle(0x008000, 0.9); // Deep Green
        graphics.fillRect(5, 5, zeroWidth, zeroHeight);

        // Inner highlight
        graphics.lineStyle(1, 0xFFFFFF, 0.2);
        graphics.strokeRect(6, 6, zeroWidth - 2, zeroHeight - 2);

        graphics.lineStyle(2, 0xffd700, 1);
        graphics.strokeRect(5, 5, zeroWidth, zeroHeight);

        const zeroText = this.scene.add.text(
            5 + zeroWidth / 2,
            5 + zeroHeight / 2,
            ' 0',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#ffffff',
                padding: { x: 2, y: 2 },
                shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
            }
        ).setOrigin(0.5);
        this.container.add(zeroText);
    }

    private drawNumberGrid(graphics: Phaser.GameObjects.Graphics): void {
        const startX = 5 + this.CELL_WIDTH + 5;
        const startY = 5;

        // Numbers 1-36 arranged in 12 columns x 3 rows
        for (let col = 0; col < 12; col++) {
            for (let row = 0; row < 3; row++) {
                // Numbers go 3, 2, 1 from top to bottom
                const number = col * 3 + (3 - row);
                const x = startX + col * this.CELL_WIDTH;
                const y = startY + row * this.CELL_HEIGHT;

                this.numberCells.set(number, { x, y, width: this.CELL_WIDTH, height: this.CELL_HEIGHT });

                const color = getColorHex(getNumberColor(number));

                // Draw cell background with slight transparency for felt effect
                graphics.fillStyle(color, 0.9);
                graphics.fillRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);

                // Add a subtle inner shadow/highlight for depth
                graphics.lineStyle(1, 0xFFFFFF, 0.2);
                graphics.strokeRect(x + 1, y + 1, this.CELL_WIDTH - 2, this.CELL_HEIGHT - 2);

                // Gold border for the cell
                graphics.lineStyle(1, 0xffd700, 0.5);
                graphics.strokeRect(x, y, this.CELL_WIDTH, this.CELL_HEIGHT);

                const text = this.scene.add.text(
                    x + this.CELL_WIDTH / 2,
                    y + this.CELL_HEIGHT / 2,
                    ` ${number}`,
                    {
                        fontFamily: 'Arial',
                        fontSize: '24px',
                        fontStyle: 'bold',
                        color: '#ffffff',
                        padding: { x: 2, y: 2 },
                        shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
                    }
                ).setOrigin(0.5);
                this.container.add(text);
            }
        }
    }

    private drawOutsideBets(graphics: Phaser.GameObjects.Graphics): void {
        const startX = 5 + this.CELL_WIDTH + 5;
        const startY = 5 + this.CELL_HEIGHT * 3 + 10;

        // Row for Dozens
        const dozenWidth = this.CELL_WIDTH * 4;
        const outsideHeight = 50;

        // 1st 12, 2nd 12, 3rd 12
        const dozenLabels = ['1st 12', '2nd 12', '3rd 12'];
        for (let i = 0; i < 3; i++) {
            const x = startX + i * dozenWidth;
            graphics.fillStyle(0x1a1a2e, 0.9);
            graphics.fillRect(x, startY, dozenWidth, outsideHeight);

            // Inner highlight
            graphics.lineStyle(1, 0xFFFFFF, 0.1);
            graphics.strokeRect(x + 1, startY + 1, dozenWidth - 2, outsideHeight - 2);

            graphics.lineStyle(1, 0xffd700, 0.5);
            graphics.strokeRect(x, startY, dozenWidth, outsideHeight);

            const text = this.scene.add.text(
                x + dozenWidth / 2,
                startY + outsideHeight / 2,
                dozenLabels[i],
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff',
                    shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
                }
            ).setOrigin(0.5);
            this.container.add(text);
        }

        // Row for even money bets
        const evenMoneyY = startY + outsideHeight + 5;
        const evenMoneyWidth = this.CELL_WIDTH * 2;
        const evenMoneyLabels = ['1-18', 'EVEN', '🔴', '⚫', 'ODD', '19-36'];
        const evenMoneyColors = [0x1a1a2e, 0x1a1a2e, 0xB00000, 0x000000, 0x1a1a2e, 0x1a1a2e];

        for (let i = 0; i < 6; i++) {
            const x = startX + i * evenMoneyWidth;
            graphics.fillStyle(evenMoneyColors[i], 0.9);
            graphics.fillRect(x, evenMoneyY, evenMoneyWidth, outsideHeight);

            // Inner highlight
            graphics.lineStyle(1, 0xFFFFFF, 0.1);
            graphics.strokeRect(x + 1, evenMoneyY + 1, evenMoneyWidth - 2, outsideHeight - 2);

            graphics.lineStyle(1, 0xffd700, 0.5);
            graphics.strokeRect(x, evenMoneyY, evenMoneyWidth, outsideHeight);

            const text = this.scene.add.text(
                x + evenMoneyWidth / 2,
                evenMoneyY + outsideHeight / 2,
                evenMoneyLabels[i],
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff',
                    shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
                }
            ).setOrigin(0.5);
            this.container.add(text);
        }

        // Column bets (on the right side)
        const colX = startX + 12 * this.CELL_WIDTH + 5;
        const colLabels = ['2:1', '2:1', '2:1'];
        for (let i = 0; i < 3; i++) {
            const y = 5 + i * this.CELL_HEIGHT;
            graphics.fillStyle(0x1a1a2e, 0.9);
            graphics.fillRect(colX, y, this.CELL_WIDTH, this.CELL_HEIGHT);

            // Inner highlight
            graphics.lineStyle(1, 0xFFFFFF, 0.1);
            graphics.strokeRect(colX + 1, y + 1, this.CELL_WIDTH - 2, this.CELL_HEIGHT - 2);

            graphics.lineStyle(1, 0xffd700, 0.5);
            graphics.strokeRect(colX, y, this.CELL_WIDTH, this.CELL_HEIGHT);

            const text = this.scene.add.text(
                colX + this.CELL_WIDTH / 2,
                y + this.CELL_HEIGHT / 2,
                colLabels[i],
                {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#ffd700',
                    shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 2, fill: true }
                }
            ).setOrigin(0.5);
            this.container.add(text);
        }
    }
}
