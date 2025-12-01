import Phaser from 'phaser';

export class UIManager {
    private scene: Phaser.Scene;
    private _spinButton!: Phaser.GameObjects.Container;
    private _clearButton!: Phaser.GameObjects.Container;
    private _repeatButton!: Phaser.GameObjects.Container;
    private messageText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public createButtons(
        onSpin: () => void,
        onClear: () => void,
        onRepeat: () => void
    ): void {
        const { width, height } = this.scene.scale;
        const isPortrait = height > width;

        let spinX, spinY, clearX, clearY, repeatX, repeatY;

        if (isPortrait) {
            spinX = width * 0.75;
            spinY = height * 0.94;
            clearX = width * 0.25;
            clearY = height * 0.94;
            repeatX = width * 0.5;
            repeatY = height * 0.94;
        } else {
            spinX = width * 0.62;
            spinY = height * 0.90;
            clearX = width * 0.38;
            clearY = height * 0.90;
            repeatX = width * 0.5;
            repeatY = height * 0.90;
        }

        this._spinButton = this.createButton(spinX, spinY, 'SPIN', 0x28a745, onSpin);
        this._clearButton = this.createButton(clearX, clearY, 'CLEAR', 0xdc3545, onClear);
        this._repeatButton = this.createButton(repeatX, repeatY, 'REPEAT', 0x6c757d, onRepeat);
    }

    private createButton(
        x: number,
        y: number,
        text: string,
        color: number,
        onClick: () => void
    ): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        const width = 180;
        const height = 60;
        const radius = 10;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const bg = this.scene.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-halfWidth, -halfHeight, width, height, radius);
        bg.lineStyle(2, 0xffffff, 0.5);
        bg.strokeRoundedRect(-halfWidth, -halfHeight, width, height, radius);

        const label = this.scene.add.text(0, 0, text, {
            fontFamily: 'Arial',
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#ffffff',
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(color, 0.8);
            bg.fillRoundedRect(-halfWidth, -halfHeight, width, height, radius);
            bg.lineStyle(2, 0xffd700, 1);
            bg.strokeRoundedRect(-halfWidth, -halfHeight, width, height, radius);
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(-halfWidth, -halfHeight, width, height, radius);
            bg.lineStyle(2, 0xffffff, 0.5);
            bg.strokeRoundedRect(-halfWidth, -halfHeight, width, height, radius);
        });

        container.on('pointerdown', onClick);

        return container;
    }

    public createMessageArea(): void {
        const { width, height } = this.scene.scale;
        const isPortrait = height > width;

        const y = isPortrait ? height * 0.08 : height * 0.12;

        this.messageText = this.scene.add.text(width * 0.5, y, '', {
            fontFamily: 'Arial',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
    }

    public showMessage(text: string, color: string = '#ffd700'): void {
        this.messageText.setText(text);
        this.messageText.setColor(color);

        // Clear after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (this.messageText.text === text) {
                this.messageText.setText('');
            }
        });
    }

    public setButtonsEnabled(enabled: boolean): void {
        const alpha = enabled ? 1 : 0.5;
        this._spinButton.setAlpha(alpha);
        this._clearButton.setAlpha(alpha);
        this._repeatButton.setAlpha(alpha);

        if (enabled) {
            this._spinButton.setInteractive({ useHandCursor: true });
            this._clearButton.setInteractive({ useHandCursor: true });
            this._repeatButton.setInteractive({ useHandCursor: true });
        } else {
            this._spinButton.disableInteractive();
            this._clearButton.disableInteractive();
            this._repeatButton.disableInteractive();
        }
    }
}
