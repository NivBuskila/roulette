/**
 * Unit Tests for Payout Service
 */

import { calculatePayout, calculatePayouts, calculateTotals } from './payout.service';
import { Bet, BetResult } from '../types';

describe('Payout Service', () => {
    describe('calculatePayout', () => {
        // Straight Up Bet (35:1)
        describe('Straight Up Bet', () => {
            it('should pay 35:1 when winning', () => {
                const bet: Bet = { type: 'straight', numbers: [17], amount: 10 };
                const result = calculatePayout(bet, 17);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(360); // 10 * 35 + 10
            });

            it('should return 0 when losing', () => {
                const bet: Bet = { type: 'straight', numbers: [17], amount: 10 };
                const result = calculatePayout(bet, 25);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });

            it('should work with zero', () => {
                const bet: Bet = { type: 'straight', numbers: [0], amount: 5 };
                const result = calculatePayout(bet, 0);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(180); // 5 * 35 + 5
            });
        });

        // Split Bet (17:1)
        describe('Split Bet', () => {
            it('should pay 17:1 when one number wins', () => {
                const bet: Bet = { type: 'split', numbers: [17, 18], amount: 10 };
                const result = calculatePayout(bet, 17);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(180); // 10 * 17 + 10
            });

            it('should pay 17:1 when other number wins', () => {
                const bet: Bet = { type: 'split', numbers: [17, 18], amount: 10 };
                const result = calculatePayout(bet, 18);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(180);
            });

            it('should return 0 when neither wins', () => {
                const bet: Bet = { type: 'split', numbers: [17, 18], amount: 10 };
                const result = calculatePayout(bet, 5);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });
        });

        // Street Bet (11:1)
        describe('Street Bet', () => {
            it('should pay 11:1 when winning', () => {
                const bet: Bet = { type: 'street', numbers: [1, 2, 3], amount: 10 };
                const result = calculatePayout(bet, 2);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(120); // 10 * 11 + 10
            });
        });

        // Corner Bet (8:1)
        describe('Corner Bet', () => {
            it('should pay 8:1 when winning', () => {
                const bet: Bet = { type: 'corner', numbers: [1, 2, 4, 5], amount: 10 };
                const result = calculatePayout(bet, 5);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(90); // 10 * 8 + 10
            });
        });

        // Line Bet (5:1)
        describe('Line Bet', () => {
            it('should pay 5:1 when winning', () => {
                const bet: Bet = { type: 'line', numbers: [1, 2, 3, 4, 5, 6], amount: 10 };
                const result = calculatePayout(bet, 3);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(60); // 10 * 5 + 10
            });
        });

        // Column Bet (2:1)
        describe('Column Bet', () => {
            it('should pay 2:1 when winning', () => {
                const bet: Bet = { type: 'column', numbers: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], amount: 10 };
                const result = calculatePayout(bet, 7);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(30); // 10 * 2 + 10
            });

            it('should lose when 0 is the winning number', () => {
                const bet: Bet = { type: 'column', numbers: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], amount: 10 };
                const result = calculatePayout(bet, 0);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });
        });

        // Dozen Bet (2:1)
        describe('Dozen Bet', () => {
            it('should pay 2:1 for 1st dozen', () => {
                const bet: Bet = { type: 'dozen', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], amount: 10 };
                const result = calculatePayout(bet, 12);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(30);
            });

            it('should lose for 1st dozen when 0 wins', () => {
                const bet: Bet = { type: 'dozen', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], amount: 10 };
                const result = calculatePayout(bet, 0);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });
        });

        // Red/Black (1:1)
        describe('Red/Black Bet', () => {
            it('should pay 1:1 for red winning', () => {
                const bet: Bet = { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 10 };
                const result = calculatePayout(bet, 7);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(20); // 10 * 1 + 10
            });

            it('should lose red when black wins', () => {
                const bet: Bet = { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 10 };
                const result = calculatePayout(bet, 8);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });

            it('should lose red when 0 wins', () => {
                const bet: Bet = { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 10 };
                const result = calculatePayout(bet, 0);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });
        });

        // Odd/Even (1:1)
        describe('Odd/Even Bet', () => {
            it('should pay 1:1 for odd winning', () => {
                const bet: Bet = { type: 'odd', numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35], amount: 10 };
                const result = calculatePayout(bet, 15);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(20);
            });

            it('should lose odd when even wins', () => {
                const bet: Bet = { type: 'odd', numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35], amount: 10 };
                const result = calculatePayout(bet, 16);

                expect(result.won).toBe(false);
                expect(result.payout).toBe(0);
            });
        });

        // High/Low (1:1)
        describe('High/Low Bet', () => {
            it('should pay 1:1 for low winning', () => {
                const bet: Bet = { type: 'low', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], amount: 10 };
                const result = calculatePayout(bet, 10);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(20);
            });

            it('should pay 1:1 for high winning', () => {
                const bet: Bet = { type: 'high', numbers: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], amount: 10 };
                const result = calculatePayout(bet, 25);

                expect(result.won).toBe(true);
                expect(result.payout).toBe(20);
            });
        });
    });

    describe('calculatePayouts', () => {
        it('should calculate payouts for multiple bets', () => {
            const bets: Bet[] = [
                { type: 'straight', numbers: [17], amount: 10 },
                { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 },
            ];

            const results = calculatePayouts(bets, 17);

            expect(results).toHaveLength(2);
            expect(results[0].won).toBe(true);
            expect(results[0].payout).toBe(360); // Straight 35:1
            expect(results[1].won).toBe(false); // 17 is black
            expect(results[1].payout).toBe(0);
        });

        it('should handle multiple winning bets', () => {
            const bets: Bet[] = [
                { type: 'straight', numbers: [7], amount: 10 },
                { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 },
                { type: 'odd', numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35], amount: 15 },
            ];

            const results = calculatePayouts(bets, 7);

            expect(results[0].won).toBe(true);
            expect(results[1].won).toBe(true);
            expect(results[2].won).toBe(true);
        });
    });

    describe('calculateTotals', () => {
        it('should calculate correct totals with wins', () => {
            const betResults: BetResult[] = [
                { type: 'straight', numbers: [17], amount: 10, won: true, payout: 360 },
                { type: 'red', numbers: [], amount: 20, won: true, payout: 40 },
            ];

            const totals = calculateTotals(betResults);

            expect(totals.totalBetAmount).toBe(30);
            expect(totals.totalWinAmount).toBe(400);
            expect(totals.netProfit).toBe(370);
        });

        it('should calculate correct totals with all losses', () => {
            const betResults: BetResult[] = [
                { type: 'straight', numbers: [17], amount: 10, won: false, payout: 0 },
                { type: 'red', numbers: [], amount: 20, won: false, payout: 0 },
            ];

            const totals = calculateTotals(betResults);

            expect(totals.totalBetAmount).toBe(30);
            expect(totals.totalWinAmount).toBe(0);
            expect(totals.netProfit).toBe(-30);
        });

        it('should calculate correct totals with mixed results', () => {
            const betResults: BetResult[] = [
                { type: 'straight', numbers: [17], amount: 10, won: false, payout: 0 },
                { type: 'red', numbers: [], amount: 20, won: true, payout: 40 },
            ];

            const totals = calculateTotals(betResults);

            expect(totals.totalBetAmount).toBe(30);
            expect(totals.totalWinAmount).toBe(40);
            expect(totals.netProfit).toBe(10);
        });
    });
});
