import { describe, it, expect } from 'vitest';

describe('BalanceDisplay Component Logic', () => {
    describe('Balance Formatting', () => {
        const formatBalance = (balance: number): string => `$${balance}`;

        it('should format balance with dollar sign', () => {
            expect(formatBalance(1000)).toBe('$1000');
            expect(formatBalance(0)).toBe('$0');
            expect(formatBalance(1234.56)).toBe('$1234.56');
        });
    });

    describe('Color Determination by Balance', () => {
        const getBalanceColor = (balance: number): string => {
            if (balance < 100) return '#dc3545'; // Red
            if (balance < 500) return '#ffc107'; // Yellow
            return '#28a745'; // Green
        };

        it('should return correct colors for balance ranges', () => {
            expect(getBalanceColor(50)).toBe('#dc3545');   // Under 100
            expect(getBalanceColor(250)).toBe('#ffc107');  // 100-499
            expect(getBalanceColor(1000)).toBe('#28a745'); // 500+
        });

        it('should handle boundary values correctly', () => {
            expect(getBalanceColor(99)).toBe('#dc3545');
            expect(getBalanceColor(100)).toBe('#ffc107');
            expect(getBalanceColor(499)).toBe('#ffc107');
            expect(getBalanceColor(500)).toBe('#28a745');
        });
    });

    describe('Bet Total Calculation', () => {
        it('should calculate total from multiple bets', () => {
            const bets = [10, 20, 30, 40];
            const total = bets.reduce((sum, bet) => sum + bet, 0);
            expect(total).toBe(100);
        });

        it('should handle decimal bet amounts', () => {
            const bets = [10.5, 20.75, 15.25];
            const total = bets.reduce((sum, bet) => sum + bet, 0);
            expect(total).toBeCloseTo(46.5, 2);
        });
    });

    describe('Display Update Logic', () => {
        interface BalanceState {
            balance: number;
            totalBet: number;
        }

        const updateDisplay = (state: BalanceState, newBalance: number, newBet: number): BalanceState => ({
            balance: newBalance,
            totalBet: newBet
        });

        it('should update balance and total bet correctly', () => {
            const initial: BalanceState = { balance: 1000, totalBet: 0 };
            const updated = updateDisplay(initial, 950, 50);
            expect(updated.balance).toBe(950);
            expect(updated.totalBet).toBe(50);
        });

        it('should handle wins and losses', () => {
            const afterWin = updateDisplay({ balance: 1000, totalBet: 50 }, 1300, 0);
            expect(afterWin.balance).toBe(1300);

            const afterLoss = updateDisplay({ balance: 1000, totalBet: 50 }, 950, 0);
            expect(afterLoss.balance).toBe(950);
        });
    });
});
