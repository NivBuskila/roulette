import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('UIManager Component Logic', () => {
    describe('Button State Management', () => {
        const isSpinDisabled = (isSpinning: boolean, totalBet: number, balance: number): boolean => {
            return isSpinning || totalBet === 0 || balance < totalBet;
        };

        it('should disable spin when spinning', () => {
            expect(isSpinDisabled(true, 100, 1000)).toBe(true);
        });

        it('should disable spin when no bets placed', () => {
            expect(isSpinDisabled(false, 0, 1000)).toBe(true);
        });

        it('should disable spin when insufficient balance', () => {
            expect(isSpinDisabled(false, 100, 50)).toBe(true);
        });

        it('should enable spin when valid bet exists', () => {
            expect(isSpinDisabled(false, 50, 100)).toBe(false);
        });
    });

    describe('Message Display', () => {
        const formatMessage = (text: string): string => {
            return text.toUpperCase();
        };

        it('should format message text correctly', () => {
            expect(formatMessage('Black 17 Wins!')).toBe('BLACK 17 WINS!');
            expect(formatMessage('insufficient balance')).toBe('INSUFFICIENT BALANCE');
        });
    });
});
