import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from '../api.service';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service - Spin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('placeBetsAndSpin', () => {
        it('should send straight bet correctly', async () => {
            const bets = [{ type: 'straight' as const, numbers: [17], amount: 10 }];
            const mockResponse = {
                success: true,
                result: {
                    winningNumber: 17,
                    winningColor: 'black' as const,
                    totalBetAmount: 10,
                    totalWinAmount: 360,
                    netProfit: 350,
                    newBalance: 1350,
                    bets: [{
                        type: 'straight' as const,
                        numbers: [17],
                        amount: 10,
                        won: true,
                        payout: 360
                    }]
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.result.winningNumber).toBe(17);
                expect(result.result.netProfit).toBe(350);
            }
            expect(global.fetch).toHaveBeenCalledWith('/api/game/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bets }),
            });
        });

        it('should send multiple bets correctly', async () => {
            const bets = [
                { type: 'straight' as const, numbers: [17], amount: 10 },
                { type: 'red' as const, numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 }
            ];
            const mockResponse = {
                success: true,
                result: {
                    winningNumber: 17,
                    winningColor: 'black' as const,
                    totalBetAmount: 30,
                    totalWinAmount: 360,
                    netProfit: 330,
                    newBalance: 1330,
                    bets: bets.map(b => ({ ...b, won: false, payout: 0 }))
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.result.totalBetAmount).toBe(30);
            }
        });

        it('should handle insufficient balance error', async () => {
            const bets = [{ type: 'straight' as const, numbers: [17], amount: 10000 }];
            const mockResponse = {
                success: false,
                error: {
                    code: 'INSUFFICIENT_BALANCE',
                    message: 'Total bet amount (10000) exceeds balance (1000)'
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.code).toBe('INSUFFICIENT_BALANCE');
            }
        });

        it('should handle invalid bet error', async () => {
            const bets = [{ type: 'straight' as const, numbers: [17], amount: -10 }];
            const mockResponse = {
                success: false,
                error: {
                    code: 'INVALID_BET',
                    message: 'Bet amount must be positive'
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.code).toBe('INVALID_BET');
            }
        });

        it('should handle losing bet', async () => {
            const bets = [{ type: 'straight' as const, numbers: [17], amount: 10 }];
            const mockResponse = {
                success: true,
                result: {
                    winningNumber: 5,
                    winningColor: 'red' as const,
                    totalBetAmount: 10,
                    totalWinAmount: 0,
                    netProfit: -10,
                    newBalance: 990,
                    bets: [{
                        type: 'straight' as const,
                        numbers: [17],
                        amount: 10,
                        won: false,
                        payout: 0
                    }]
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.result.totalWinAmount).toBe(0);
                expect(result.result.netProfit).toBe(-10);
            }
        });

        it('should handle zero winning (green)', async () => {
            const bets = [{ type: 'red' as const, numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 }];
            const mockResponse = {
                success: true,
                result: {
                    winningNumber: 0,
                    winningColor: 'green' as const,
                    totalBetAmount: 20,
                    totalWinAmount: 0,
                    netProfit: -20,
                    newBalance: 980,
                    bets: [{
                        type: 'red' as const,
                        numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
                        amount: 20,
                        won: false,
                        payout: 0
                    }]
                }
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.placeBetsAndSpin(bets);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.result.winningNumber).toBe(0);
                expect(result.result.winningColor).toBe('green');
            }
        });
    });
});
