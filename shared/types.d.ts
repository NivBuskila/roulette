/**
 * Shared Type Definitions
 * Used by both Frontend and Backend
 */
export type BetType = 'straight' | 'split' | 'street' | 'corner' | 'line' | 'column' | 'dozen' | 'red' | 'black' | 'odd' | 'even' | 'low' | 'high';
export type RouletteColor = 'red' | 'black' | 'green';
export interface Bet {
    type: BetType;
    numbers: number[];
    amount: number;
}
export interface BetResult extends Bet {
    won: boolean;
    payout: number;
}
export interface GameResult {
    winningNumber: number;
    winningColor: RouletteColor;
    totalBetAmount: number;
    totalWinAmount: number;
    netProfit: number;
    newBalance: number;
    bets: BetResult[];
}
export interface GameHistoryEntry {
    timestamp: string;
    winningNumber: number;
    winningColor: RouletteColor;
    totalBetAmount: number;
    totalWinAmount: number;
    netProfit: number;
}
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
export type ErrorCode = 'INSUFFICIENT_BALANCE' | 'INVALID_BET' | 'INVALID_BET_TYPE' | 'SERVER_ERROR';
export type ApiResponse<T> = {
    success: true;
    result: T;
} | ErrorResponse;
export interface ProvablyFairData {
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
}
export interface ValidationResult {
    valid: boolean;
    errorCode?: ErrorCode;
    errorMessage?: string;
}
//# sourceMappingURL=types.d.ts.map