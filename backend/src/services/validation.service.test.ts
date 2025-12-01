/**
 * Unit Tests for Validation Service
 */

import { validateBet, validateBets } from './validation.service';
import { Bet } from '../types';

describe('Validation Service', () => {
    describe('validateBet - General Validation', () => {
        it('should reject bet with zero amount', () => {
            const bet: Bet = { type: 'straight', numbers: [17], amount: 0 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });

        it('should reject bet with negative amount', () => {
            const bet: Bet = { type: 'straight', numbers: [17], amount: -10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });

        it('should reject bet with amount below minimum', () => {
            const bet: Bet = { type: 'straight', numbers: [17], amount: 0.5 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
            expect(result.errorMessage).toContain('Minimum bet');
        });

        it('should reject bet with amount above maximum', () => {
            const bet: Bet = { type: 'straight', numbers: [17], amount: 1000 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
            expect(result.errorMessage).toContain('Maximum bet');
        });

        it('should reject bet with invalid number (negative)', () => {
            const bet: Bet = { type: 'straight', numbers: [-1], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });

        it('should reject bet with invalid number (> 36)', () => {
            const bet: Bet = { type: 'straight', numbers: [37], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });

        it('should reject unknown bet type', () => {
            // Intentionally using invalid type to test error handling
            const bet = { type: 'unknown', numbers: [17], amount: 10 } as unknown as Bet;
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET_TYPE');
        });
    });

    describe('validateBet - Straight Up', () => {
        it('should accept valid straight bet', () => {
            const bet: Bet = { type: 'straight', numbers: [17], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept straight bet on 0', () => {
            const bet: Bet = { type: 'straight', numbers: [0], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject straight bet with multiple numbers', () => {
            const bet: Bet = { type: 'straight', numbers: [17, 18], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });
    });

    describe('validateBet - Split', () => {
        it('should accept valid horizontal split (same row)', () => {
            const bet: Bet = { type: 'split', numbers: [1, 2], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid vertical split (same column)', () => {
            const bet: Bet = { type: 'split', numbers: [1, 4], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept split with 0 and 1', () => {
            const bet: Bet = { type: 'split', numbers: [0, 1], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept split with 0 and 2', () => {
            const bet: Bet = { type: 'split', numbers: [0, 2], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept split with 0 and 3', () => {
            const bet: Bet = { type: 'split', numbers: [0, 3], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject split with non-adjacent numbers', () => {
            const bet: Bet = { type: 'split', numbers: [1, 5], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });

        it('should reject split with numbers from different rows (not vertical)', () => {
            const bet: Bet = { type: 'split', numbers: [3, 4], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Street', () => {
        it('should accept valid street (1-2-3)', () => {
            const bet: Bet = { type: 'street', numbers: [1, 2, 3], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid street (34-35-36)', () => {
            const bet: Bet = { type: 'street', numbers: [34, 35, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid street', () => {
            const bet: Bet = { type: 'street', numbers: [2, 3, 4], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Corner', () => {
        it('should accept valid corner (1-2-4-5)', () => {
            const bet: Bet = { type: 'corner', numbers: [1, 2, 4, 5], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid corner (32-33-35-36)', () => {
            const bet: Bet = { type: 'corner', numbers: [32, 33, 35, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept First Four corner (0-1-2-3)', () => {
            const bet: Bet = { type: 'corner', numbers: [0, 1, 2, 3], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid corner combination', () => {
            const bet: Bet = { type: 'corner', numbers: [1, 2, 3, 4], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Line', () => {
        it('should accept valid line (1-6)', () => {
            const bet: Bet = { type: 'line', numbers: [1, 2, 3, 4, 5, 6], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid line (31-36)', () => {
            const bet: Bet = { type: 'line', numbers: [31, 32, 33, 34, 35, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid line', () => {
            const bet: Bet = { type: 'line', numbers: [1, 2, 3, 4, 5, 7], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Column', () => {
        it('should accept valid column 1', () => {
            const bet: Bet = { type: 'column', numbers: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid column 2', () => {
            const bet: Bet = { type: 'column', numbers: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid column 3', () => {
            const bet: Bet = { type: 'column', numbers: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid column', () => {
            const bet: Bet = { type: 'column', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Dozen', () => {
        it('should accept valid 1st dozen', () => {
            const bet: Bet = { type: 'dozen', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid 2nd dozen', () => {
            const bet: Bet = { type: 'dozen', numbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid 3rd dozen', () => {
            const bet: Bet = { type: 'dozen', numbers: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid dozen', () => {
            const bet: Bet = { type: 'dozen', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(false);
        });
    });

    describe('validateBet - Red/Black', () => {
        it('should accept valid red bet', () => {
            const bet: Bet = { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid black bet', () => {
            const bet: Bet = { type: 'black', numbers: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });
    });

    describe('validateBet - Odd/Even', () => {
        it('should accept valid odd bet', () => {
            const bet: Bet = { type: 'odd', numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid even bet', () => {
            const bet: Bet = { type: 'even', numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });
    });

    describe('validateBet - High/Low', () => {
        it('should accept valid low bet', () => {
            const bet: Bet = { type: 'low', numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });

        it('should accept valid high bet', () => {
            const bet: Bet = { type: 'high', numbers: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], amount: 10 };
            const result = validateBet(bet);

            expect(result.valid).toBe(true);
        });
    });

    describe('validateBets', () => {
        it('should validate multiple bets', () => {
            const bets: Bet[] = [
                { type: 'straight', numbers: [17], amount: 10 },
                { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 },
            ];

            const result = validateBets(bets, 1000);

            expect(result.valid).toBe(true);
        });

        it('should fail if any bet is invalid', () => {
            const bets: Bet[] = [
                { type: 'straight', numbers: [17], amount: 10 },
                { type: 'straight', numbers: [17], amount: -5 }, // Invalid
            ];

            const result = validateBets(bets, 1000);

            expect(result.valid).toBe(false);
        });

        it('should reject empty bets array', () => {
            const result = validateBets([], 1000);

            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe('INVALID_BET');
        });
    });
});
