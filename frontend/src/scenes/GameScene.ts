/**
 * Main Game Scene
 * Contains the roulette wheel, betting table, and game logic
 */

import Phaser from 'phaser';
import { Wheel } from '../components/Wheel';
import { BettingTable } from '../components/BettingTable';
import { ChipSelector } from '../components/ChipSelector';
import { BalanceDisplay } from '../components/BalanceDisplay';
import { HistoryDisplay } from '../components/HistoryDisplay';
import { getBalance, placeBetsAndSpin, getGameHistory } from '../services/api.service';
import { Bet, GameResult } from '../types';
import { CHIP_VALUES, ChipValue } from '../constants/roulette';
import { UIManager } from '../managers/UIManager';
import { EffectsManager } from '../managers/EffectsManager';
import { BettingManager } from '../managers/BettingManager';

export class GameScene extends Phaser.Scene {
  private wheel!: Wheel;
  private bettingTable!: BettingTable;
  private _chipSelector!: ChipSelector;
  private balanceDisplay!: BalanceDisplay;
  private historyDisplay!: HistoryDisplay;
  private uiManager!: UIManager;
  private effectsManager!: EffectsManager;
  private bettingManager!: BettingManager;

  private balance: number = 0;
  private currentChipValue: ChipValue = CHIP_VALUES[0];
  private isSpinning: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  async create(): Promise<void> {
    // Add background gradient first
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0f2027, 0x0f2027, 0x203a43, 0x2c5364, 1);
    graphics.fillRect(0, 0, width, height);

    // Show loading indicator
    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffd700',
    }).setOrigin(0.5);

    // Initialize managers
    this.uiManager = new UIManager(this);
    this.effectsManager = new EffectsManager(this);

    // Initialize balance from server
    try {
      await this.loadInitialData();
      loadingText.destroy();
    } catch (error) {
      loadingText.setText('Connection Error!\nClick to retry');
      loadingText.setInteractive({ useHandCursor: true });
      loadingText.on('pointerdown', () => {
        loadingText.setText('Retrying...');
        this.scene.restart();
      });
      return;
    }

    // Create particle textures
    this.effectsManager.createParticleTextures();

    // Create game components
    this.createWheel();
    this.createBettingTable();
    this.createChipSelector();
    this.createBalanceDisplay();
    this.createHistoryDisplay();

    // Initialize BettingManager
    this.bettingManager = new BettingManager(
      this.bettingTable,
      this.balanceDisplay,
      this.uiManager,
      () => this.balance,
      () => this.isSpinning
    );

    this.uiManager.createButtons(
      () => this.handleSpin(),
      () => this.bettingManager.clearBets(),
      () => this.bettingManager.repeatLastBet()
    );
    this.uiManager.createMessageArea();
  }

  private async loadInitialData(): Promise<void> {
    this.balance = await getBalance();
  }

  private createWheel(): void {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    if (isPortrait) {
      this.wheel = new Wheel(this, width * 0.5, height * 0.25);
    } else {
      // Position wheel on the left side, vertically centered relative to the table
      this.wheel = new Wheel(this, width * 0.18, height * 0.45);
    }
  }

  private createBettingTable(): void {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    let x, y;
    if (isPortrait) {
      // Center horizontally, place below wheel
      x = (width - 860) / 2;
      y = height * 0.50;
    } else {
      // Position betting table in the center-right
      x = width * 0.36;
      y = height * 0.22;
    }

    this.bettingTable = new BettingTable(this, x, y, (bet: Bet): boolean => {
      // We need to use the manager here, but it might not be initialized yet if called immediately
      // But it's called on interaction, so it should be fine.
      if (this.bettingManager) {
        return this.bettingManager.handleBetPlaced(bet);
      }
      return false;
    });
  }

  private createChipSelector(): void {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    const y = isPortrait ? height * 0.75 : height * 0.68;

    this._chipSelector = new ChipSelector(this, width * 0.5, y, (value: ChipValue) => {
      this.currentChipValue = value;
    });
  }

  private createBalanceDisplay(): void {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    const y = isPortrait ? height * 0.86 : height * 0.80;

    this.balanceDisplay = new BalanceDisplay(this, width * 0.5, y);
    this.balanceDisplay.update(this.balance, 0);
  }

  private createHistoryDisplay(): void {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    let x, y;
    if (isPortrait) {
      // Top right, scaled down
      x = width - 100;
      y = 250;
    } else {
      x = width * 0.90;
      y = height * 0.22;
    }

    this.historyDisplay = new HistoryDisplay(this, x, y);

    if (isPortrait) {
      // Access container to scale it
      this.historyDisplay.container.setScale(0.7);
    }
    this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    try {
      const history = await getGameHistory(10);
      this.historyDisplay.update(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  public getCurrentChipValue(): ChipValue {
    return this.currentChipValue;
  }

  private async handleSpin(): Promise<void> {
    if (this.isSpinning) return;

    if (!this.bettingManager.hasBets()) {
      this.uiManager.showMessage('Place at least one bet!', '#ff6b6b');
      return;
    }

    this.isSpinning = true;
    this.uiManager.setButtonsEnabled(false);
    this.uiManager.showMessage('Spinning...', '#ffd700');

    const bets = this.bettingManager.getBets();

    try {
      const response = await placeBetsAndSpin(bets);

      if (response.success) {
        // Animate wheel to result
        try {
          await this.wheel.spinTo(response.result.winningNumber);
        } catch (animError) {
          console.error('Wheel animation error:', animError);
          // Continue with result handling even if animation fails
        }

        // Update state
        this.balance = response.result.newBalance;
        this.handleSpinResult(response.result);
      } else {
        this.uiManager.showMessage(response.error.message, '#ff6b6b');
        this.isSpinning = false;
        this.uiManager.setButtonsEnabled(true);
      }
    } catch (error) {
      console.error('Spin error:', error);
      this.uiManager.showMessage('Connection error! Please try again.', '#ff6b6b');
      this.isSpinning = false;
      this.uiManager.setButtonsEnabled(true);
    }
  }

  private handleSpinResult(result: GameResult): void {
    // Show result
    const colorEmoji = result.winningColor === 'red' ? '🔴' :
      result.winningColor === 'black' ? '⚫' : '🟢';

    if (result.netProfit > 0) {
      this.uiManager.showMessage(
        `${colorEmoji} ${result.winningNumber} - You won ${result.totalWinAmount}! (+${result.netProfit})`,
        '#28a745'
      );
      this.effectsManager.playWinAnimation(result.netProfit);
    } else if (result.netProfit < 0) {
      this.uiManager.showMessage(
        `${colorEmoji} ${result.winningNumber} - You lost ${Math.abs(result.netProfit)}`,
        '#dc3545'
      );
    } else {
      this.uiManager.showMessage(
        `${colorEmoji} ${result.winningNumber} - Break even!`,
        '#ffd700'
      );
    }

    // Save bets for repeat feature before clearing
    this.bettingManager.saveLastBets();

    // Clear bets and update display (force=true because we're still in spinning state)
    this.bettingManager.clearBets(true);

    // Update history
    this.loadHistory();

    this.isSpinning = false;
    this.uiManager.setButtonsEnabled(true);
  }
}
