import Phaser from 'phaser';
import { Bet } from '../types';
import { TableRenderer } from './table/TableRenderer';
import { ChipValue } from '../constants/roulette';
import { BettingZoneFactory, BettingArea } from './table/BettingZoneFactory';
import { ChipRenderer } from './table/ChipRenderer';

interface IGameScene extends Phaser.Scene {
    getCurrentChipValue(): ChipValue;
}

export class BettingTable {
    private scene: IGameScene;
    private container: Phaser.GameObjects.Container;
    private chipContainer: Phaser.GameObjects.Container;
    private highlightGraphics: Phaser.GameObjects.Graphics;

    private renderer: TableRenderer;
    private zoneFactory: BettingZoneFactory;
    private chipRenderer: ChipRenderer;

    private bettingAreas: BettingArea[] = [];
    private onBetPlaced: (bet: Bet) => void;

    constructor(scene: IGameScene, x: number, y: number, onBetPlaced: (bet: Bet) => void) {
        this.scene = scene;
        this.onBetPlaced = onBetPlaced;
        this.container = scene.add.container(x, y);
        this.chipContainer = scene.add.container(x, y);

        // 1. Initialize Renderers
        this.renderer = new TableRenderer(scene, this.container);
        this.renderer.draw();

        this.chipRenderer = new ChipRenderer(scene, this.chipContainer);

        // 2. Initialize Highlight Graphics
        this.highlightGraphics = scene.add.graphics();
        this.container.add(this.highlightGraphics);

        // 3. Generate Zones using Factory
        this.zoneFactory = new BettingZoneFactory(this.renderer.CELL_WIDTH, this.renderer.CELL_HEIGHT);
        this.setupInteractiveZones();
    }

    private setupInteractiveZones(): void {
        // Get pure data objects from factory
        this.bettingAreas = this.zoneFactory.generateAllZones();

        // Attach Phaser interaction to each zone
        this.bettingAreas.forEach(area => {
            const zone = this.scene.add.zone(
                area.x + area.width / 2,
                area.y + area.height / 2,
                area.width,
                area.height
            )
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.handleBetPlacement(area))
                .on('pointerover', () => this.handleHighlight(area))
                .on('pointerout', () => this.highlightGraphics.clear());

            this.container.add(zone);
        });
    }

    private handleBetPlacement(area: BettingArea): void {
        const chipValue = this.scene.getCurrentChipValue();
        const newBet: Bet = { ...area.bet, amount: chipValue };

        this.onBetPlaced(newBet);

        // Use ChipRenderer to draw
        this.chipRenderer.drawChip(
            area.x + area.width / 2,
            area.y + area.height / 2,
            chipValue
        );
    }

    private handleHighlight(area: BettingArea): void {
        this.highlightGraphics.clear();
        this.highlightGraphics.fillStyle(0xFFFFFF, 0.3);

        // Smart highlighting: if bet covers specific numbers, highlight those cells
        if (area.bet.numbers.length > 0 && ['split', 'corner', 'street', 'line'].includes(area.bet.type)) {
            area.bet.numbers.forEach(num => {
                const cell = this.renderer.numberCells.get(num);
                if (cell) {
                    this.highlightGraphics.fillRect(cell.x, cell.y, cell.width, cell.height);
                }
            });
        } else {
            // Otherwise highlight the zone itself
            this.highlightGraphics.fillRect(area.x, area.y, area.width, area.height);
        }
    }

    public clearChips(): void {
        this.chipRenderer.clear();
    }

    public placeChipForBet(bet: Bet): void {
        const area = this.bettingAreas.find(a =>
            a.bet.type === bet.type &&
            a.bet.numbers.length === bet.numbers.length &&
            a.bet.numbers.every((n, i) => bet.numbers.includes(n))
        );

        if (area) {
            this.chipRenderer.drawChip(
                area.x + area.width / 2,
                area.y + area.height / 2,
                bet.amount
            );
        }
    }

    public setScale(scale: number): void {
        this.container.setScale(scale);
        this.chipContainer.setScale(scale);
    }
}
