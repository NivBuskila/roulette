/**
 * Payout Service
 * 
 * Calculates payouts for all bet types according to European Roulette rules.
 * Payout = bet amount × multiplier + bet amount (original bet returned on win)
 */

import { Bet, BetResult } from '../types';
import { PAYOUT_MULTIPLIERS } from '../constants/roulette';

/**
 * Calculate the payout for a single bet
 * Returns the total amount won (including original bet) or 0 if lost
 */
export function calculatePayout(bet: Bet, winningNumber: number): BetResult {
  const won = bet.numbers.includes(winningNumber);

  let payout = 0;
  if (won) {
    const multiplier = PAYOUT_MULTIPLIERS[bet.type];
    // Payout includes original bet + winnings
    payout = bet.amount * multiplier + bet.amount;
  }

  return {
    ...bet,
    won,
    payout,
  };
}

/**
 * Calculate payouts for multiple bets
 */
export function calculatePayouts(bets: Bet[], winningNumber: number): BetResult[] {
  return bets.map(bet => calculatePayout(bet, winningNumber));
}

/**
 * Calculate total statistics from bet results
 */
export function calculateTotals(betResults: BetResult[]): {
  totalBetAmount: number;
  totalWinAmount: number;
  netProfit: number;
} {
  const totalBetAmount = betResults.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWinAmount = betResults.reduce((sum, bet) => sum + bet.payout, 0);
  const netProfit = totalWinAmount - totalBetAmount;

  return {
    totalBetAmount,
    totalWinAmount,
    netProfit,
  };
}
