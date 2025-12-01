/**
 * European Roulette - Constants
 * All game rules, colors, payouts, and wheel configuration
 */

import { BetType, RouletteColor } from '../types';

// ============================================
// Number Colors
// ============================================

export const RED_NUMBERS: readonly number[] = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
] as const;

export const BLACK_NUMBERS: readonly number[] = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
] as const;

export const GREEN_NUMBERS: readonly number[] = [0] as const;

/**
 * Get the color of a roulette number
 */
export function getNumberColor(num: number): RouletteColor {
  if (num === 0) return 'green';
  if (RED_NUMBERS.includes(num)) return 'red';
  return 'black';
}

// ============================================
// Wheel Order (European Roulette)
// ============================================

/**
 * European roulette wheel order (clockwise from 0)
 */
export const WHEEL_ORDER: readonly number[] = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
] as const;

// ============================================
// Payout Multipliers
// ============================================

/**
 * Payout multipliers for each bet type
 * Payout = bet amount × multiplier (plus original bet returned)
 */
export const PAYOUT_MULTIPLIERS: Record<BetType, number> = {
  straight: 35,  // Single number
  split: 17,     // Two numbers
  street: 11,    // Three numbers
  corner: 8,     // Four numbers
  line: 5,       // Six numbers
  column: 2,     // 12 numbers
  dozen: 2,      // 12 numbers
  red: 1,        // 18 numbers
  black: 1,      // 18 numbers
  odd: 1,        // 18 numbers
  even: 1,       // 18 numbers
  low: 1,        // 18 numbers (1-18)
  high: 1,       // 18 numbers (19-36)
} as const;

// ============================================
// Bet Coverage Definitions
// ============================================

/**
 * Numbers covered by column bets
 */
export const COLUMNS: Record<1 | 2 | 3, number[]> = {
  1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
};

/**
 * Numbers covered by dozen bets
 */
export const DOZENS: Record<1 | 2 | 3, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  2: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  3: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
};

/**
 * Low numbers (1-18) and High numbers (19-36)
 */
export const LOW_NUMBERS: number[] = Array.from({ length: 18 }, (_, i) => i + 1);
export const HIGH_NUMBERS: number[] = Array.from({ length: 18 }, (_, i) => i + 19);

/**
 * Odd and Even numbers (excluding 0)
 */
export const ODD_NUMBERS: number[] = Array.from({ length: 36 }, (_, i) => i + 1).filter(n => n % 2 === 1);
export const EVEN_NUMBERS: number[] = Array.from({ length: 36 }, (_, i) => i + 1).filter(n => n % 2 === 0);

// ============================================
// Game Configuration
// ============================================

export const INITIAL_BALANCE = 1000;
export const MIN_BET = 1;
export const MAX_BET = 500;

// ============================================
// Betting Table Layout
// ============================================

/**
 * Valid split combinations (adjacent numbers on the betting table)
 * Format: [num1, num2] where num1 < num2
 */
export function isValidSplit(numbers: number[]): boolean {
  if (numbers.length !== 2) return false;
  const [a, b] = numbers.sort((x, y) => x - y);

  // Horizontal adjacency (same row, adjacent columns)
  // Numbers in the same row differ by 1
  if (b - a === 1 && Math.ceil(a / 3) === Math.ceil(b / 3) && a > 0) {
    return true;
  }

  // Vertical adjacency (same column, adjacent rows)
  // Numbers in the same column differ by 3
  if (b - a === 3) {
    return true;
  }

  // Special case: 0 can split with 1, 2, or 3
  if (a === 0 && (b === 1 || b === 2 || b === 3)) {
    return true;
  }

  return false;
}

/**
 * Valid street combinations (3 numbers in a row)
 */
export function isValidStreet(numbers: number[]): boolean {
  if (numbers.length !== 3) return false;
  const sorted = [...numbers].sort((a, b) => a - b);

  // Special street: 0, 1, 2 or 0, 2, 3
  if (sorted[0] === 0) {
    return (sorted[1] === 1 && sorted[2] === 2) || (sorted[1] === 2 && sorted[2] === 3);
  }

  // Regular street: first number must be 1, 4, 7, 10, etc.
  if ((sorted[0] - 1) % 3 !== 0) return false;
  return sorted[1] === sorted[0] + 1 && sorted[2] === sorted[0] + 2;
}

/**
 * Valid corner combinations (4 numbers forming a square)
 */
export function isValidCorner(numbers: number[]): boolean {
  if (numbers.length !== 4) return false;
  const sorted = [...numbers].sort((a, b) => a - b);

  // Top-left number must not be in column 3 (can't form right edge)
  const topLeft = sorted[0];

  // Special case: First Four (0, 1, 2, 3)
  if (sorted.length === 4 && sorted[0] === 0 && sorted[1] === 1 && sorted[2] === 2 && sorted[3] === 3) {
    return true;
  }

  if (topLeft === 0) return false;
  if (topLeft % 3 === 0) return false; // Column 3 numbers: 3, 6, 9, etc.
  if (topLeft > 32) return false; // Can't form corner from row 12

  // Valid corner: [n, n+1, n+3, n+4]
  return sorted[1] === topLeft + 1 &&
    sorted[2] === topLeft + 3 &&
    sorted[3] === topLeft + 4;
}

/**
 * Valid line combinations (6 numbers - two adjacent streets)
 */
export function isValidLine(numbers: number[]): boolean {
  if (numbers.length !== 6) return false;
  const sorted = [...numbers].sort((a, b) => a - b);

  // First number must be start of a street (1, 4, 7, 10, etc.) and not last row
  const first = sorted[0];
  if ((first - 1) % 3 !== 0) return false;
  if (first > 31) return false;

  // Must be consecutive 6 numbers
  for (let i = 1; i < 6; i++) {
    if (sorted[i] !== first + i) return false;
  }

  return true;
}
