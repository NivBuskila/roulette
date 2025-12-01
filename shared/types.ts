/**
 * Shared Type Definitions
 * Used by both Frontend and Backend
 */

// ============================================
// Bet Types
// ============================================

export type BetType =
    | 'straight'  // Single number - 35:1
    | 'split'     // Two adjacent numbers - 17:1
    | 'street'    // Three numbers in a row - 11:1
    | 'corner'    // Four numbers in a square - 8:1
    | 'line'      // Six numbers (two streets) - 5:1
    | 'column'    // Column (12 numbers) - 2:1
    | 'dozen'     // Dozen (12 numbers) - 2:1
    | 'red'       // All red numbers - 1:1
    | 'black'     // All black numbers - 1:1
    | 'odd'       // All odd numbers - 1:1
    | 'even'      // All even numbers - 1:1
    | 'low'       // 1-18 - 1:1
    | 'high';     // 19-36 - 1:1

export type RouletteColor = 'red' | 'black' | 'green';

// ============================================
// Bet Interfaces
// ============================================

export interface Bet {
    type: BetType;
    numbers: number[];  // Array of numbers covered by this bet
    amount: number;     // Bet amount in currency units
}

export interface BetResult extends Bet {
    won: boolean;       // Did this bet win?
    payout: number;     // Amount won (includes original bet if won)
}

// ============================================
// Game Result Interfaces
// ============================================

export interface GameResult {
    winningNumber: number;      // 0-36
    winningColor: RouletteColor;
    totalBetAmount: number;     // Sum of all bet amounts
    totalWinAmount: number;     // Sum of all payouts
    netProfit: number;          // totalWinAmount - totalBetAmount
    newBalance: number;         // Updated balance after spin
    bets: BetResult[];          // Results for each bet placed
}

export interface GameHistoryEntry {
    timestamp: string;          // ISO 8601 format
    winningNumber: number;
    winningColor: RouletteColor;
    totalBetAmount: number;
    totalWinAmount: number;
    netProfit: number;
}

// ============================================
// API Request/Response Types
// ============================================

export interface SpinRequest {
    bets: Bet[];
}

export interface BalanceResponse {
    balance: number;
}

export interface SpinResponse {
    success: true;
    result: GameResult;
}

export interface HistoryResponse {
    history: GameHistoryEntry[];
}

export interface ResetResponse {
    success: true;
    balance: number;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
    };
}

export type ErrorCode =
    | 'INSUFFICIENT_BALANCE'
    | 'INVALID_BET'
    | 'INVALID_BET_TYPE'
    | 'SERVER_ERROR';

export type ApiResponse<T> = { success: true; result: T } | ErrorResponse;

// ============================================
// Provably Fair Types
// ============================================

export interface ProvablyFairData {
    serverSeed: string;
    serverSeedHash: string;  // SHA-256 hash shown to player before spin
    clientSeed: string;
    nonce: number;
}

export interface ValidationResult {
    valid: boolean;
    errorCode?: ErrorCode;
    errorMessage?: string;
}
