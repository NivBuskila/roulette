/**
 * Game Service
 * 
 * Core game logic orchestration:
 * - Balance management
 * - Game history tracking
 * - Spin execution
 * - Result calculation
 */

import {
  Bet,
  BetResult,
  GameResult,
  GameHistoryEntry,
  RouletteColor
} from '../types';
import { INITIAL_BALANCE, getNumberColor } from '../constants/roulette';
import { rngService, RNGResult } from './rng.service';
import { validateBets } from './validation.service';
import { calculatePayouts, calculateTotals } from './payout.service';

// In-memory state
let balance: number = INITIAL_BALANCE;
let gameHistory: GameHistoryEntry[] = [];
let lastSpinData: RNGResult | null = null;

/**
 * Get current balance
 */
export function getBalance(): number {
  return balance;
}

/**
 * Get game history
 */
export function getHistory(limit: number = 10): GameHistoryEntry[] {
  return gameHistory.slice(-limit).reverse();
}

/**
 * Get last spin data for verification
 */
export function getLastSpinData(): RNGResult | null {
  return lastSpinData;
}

/**
 * Get server seed hash for next spin (for provably fair preview)
 */
export function getServerSeedHash(): string {
  return rngService.getServerSeedHash();
}

/**
 * Execute a spin with the given bets
 */
export function executeSpin(bets: Bet[]): { success: true; result: GameResult } | { success: false; error: { code: string; message: string } } {
  // Validate all bets
  const validation = validateBets(bets, balance);
  if (!validation.valid) {
    return {
      success: false,
      error: {
        code: validation.errorCode || 'INVALID_BET',
        message: validation.errorMessage || 'Invalid bet',
      },
    };
  }

  // Calculate total bet amount and deduct from balance
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  balance -= totalBetAmount;

  // Generate winning number using provably fair RNG
  const spinResult = rngService.spin();
  lastSpinData = spinResult;

  const winningNumber = spinResult.winningNumber;
  const winningColor: RouletteColor = getNumberColor(winningNumber);

  // Calculate payouts for all bets
  const betResults: BetResult[] = calculatePayouts(bets, winningNumber);
  const { totalWinAmount, netProfit } = calculateTotals(betResults);

  // Add winnings to balance
  balance += totalWinAmount;

  // Record in history
  const historyEntry: GameHistoryEntry = {
    timestamp: new Date().toISOString(),
    winningNumber,
    winningColor,
    totalBetAmount,
    totalWinAmount,
    netProfit,
  };
  gameHistory.push(historyEntry);

  // Keep history limited to last 100 entries
  if (gameHistory.length > 100) {
    gameHistory = gameHistory.slice(-100);
  }

  // Build result
  const gameResult: GameResult = {
    winningNumber,
    winningColor,
    totalBetAmount,
    totalWinAmount,
    netProfit,
    newBalance: balance,
    bets: betResults,
  };

  return {
    success: true,
    result: gameResult,
  };
}

/**
 * Reset game state to initial values
 */
export function resetGame(): { success: true; balance: number } {
  balance = INITIAL_BALANCE;
  gameHistory = [];
  lastSpinData = null;
  rngService.reset();

  return {
    success: true,
    balance,
  };
}
