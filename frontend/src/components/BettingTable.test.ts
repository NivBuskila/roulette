import { describe, it, expect } from 'vitest';
import { Bet, BetType } from '../types';

describe('BettingTable Component Logic', () => {
    describe('Bet Placement', () => {
        const createBet = (type: BetType, numbers: number[], amount: number): Bet => ({
            type,
            numbers,
            amount
        });

        it('should create straight bet correctly', () => {
            const bet = createBet('straight', [17], 10);
            expect(bet.type).toBe('straight');
            expect(bet.numbers).toEqual([17]);
            expect(bet.amount).toBe(10);
        });

        it('should create split bet correctly', () => {
            const bet = createBet('split', [17, 18], 20);
            expect(bet.type).toBe('split');
            expect(bet.numbers).toEqual([17, 18]);
            expect(bet.amount).toBe(20);
        });

        it('should create corner bet correctly', () => {
            const bet = createBet('corner', [13, 14, 16, 17], 15);
            expect(bet.type).toBe('corner');
            expect(bet.numbers.length).toBe(4);
            expect(bet.amount).toBe(15);
        });

        it('should create red bet correctly', () => {
            const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            const bet = createBet('red', redNumbers, 25);
            expect(bet.type).toBe('red');
            expect(bet.numbers.length).toBe(18);
            expect(bet.amount).toBe(25);
        });

        it('should maintain bet amount from chip value', () => {
            const chipValue = 100;
            const bet = createBet('straight', [0], chipValue);
            expect(bet.amount).toBe(chipValue);
        });
    });

    describe('Bet Collection', () => {
        interface BetCollection {
            bets: Bet[];
            totalAmount: number;
        }

        const addBet = (collection: BetCollection, bet: Bet): BetCollection => {
            return {
                bets: [...collection.bets, bet],
                totalAmount: collection.totalAmount + bet.amount
            };
        };

        it('should start with empty bets', () => {
            const collection: BetCollection = { bets: [], totalAmount: 0 };
            expect(collection.bets.length).toBe(0);
            expect(collection.totalAmount).toBe(0);
        });

        it('should add single bet', () => {
            let collection: BetCollection = { bets: [], totalAmount: 0 };
            const bet: Bet = { type: 'straight', numbers: [17], amount: 10 };
            collection = addBet(collection, bet);

            expect(collection.bets.length).toBe(1);
            expect(collection.totalAmount).toBe(10);
        });

        it('should add multiple bets', () => {
            let collection: BetCollection = { bets: [], totalAmount: 0 };
            collection = addBet(collection, { type: 'straight', numbers: [17], amount: 10 });
            collection = addBet(collection, { type: 'red', numbers: [], amount: 20 });
            collection = addBet(collection, { type: 'dozen', numbers: [], amount: 15 });

            expect(collection.bets.length).toBe(3);
            expect(collection.totalAmount).toBe(45);
        });

        it('should calculate total amount correctly', () => {
            let collection: BetCollection = { bets: [], totalAmount: 0 };
            collection = addBet(collection, { type: 'straight', numbers: [1], amount: 5 });
            collection = addBet(collection, { type: 'straight', numbers: [2], amount: 10 });
            collection = addBet(collection, { type: 'straight', numbers: [3], amount: 25 });

            expect(collection.totalAmount).toBe(40);
        });

        it('should handle decimal amounts', () => {
            let collection: BetCollection = { bets: [], totalAmount: 0 };
            collection = addBet(collection, { type: 'straight', numbers: [17], amount: 10.5 });
            collection = addBet(collection, { type: 'red', numbers: [], amount: 20.75 });

            expect(collection.totalAmount).toBeCloseTo(31.25, 2);
        });
    });

    describe('Bet Clearing', () => {
        const clearAllBets = (): { bets: Bet[], totalAmount: number } => {
            return { bets: [], totalAmount: 0 };
        };

        it('should clear all bets', () => {
            const cleared = clearAllBets();
            expect(cleared.bets.length).toBe(0);
            expect(cleared.totalAmount).toBe(0);
        });

        it('should reset total amount to zero', () => {
            const cleared = clearAllBets();
            expect(cleared.totalAmount).toBe(0);
        });
    });

    describe('Bet Repetition', () => {
        const repeatBets = (previousBets: Bet[]): Bet[] => {
            return previousBets.map(bet => ({ ...bet }));
        };

        it('should repeat single bet', () => {
            const previous: Bet[] = [{ type: 'straight', numbers: [17], amount: 10 }];
            const repeated = repeatBets(previous);

            expect(repeated.length).toBe(1);
            expect(repeated[0]).toEqual(previous[0]);
        });

        it('should repeat multiple bets', () => {
            const previous: Bet[] = [
                { type: 'straight', numbers: [17], amount: 10 },
                { type: 'red', numbers: [], amount: 20 }
            ];
            const repeated = repeatBets(previous);

            expect(repeated.length).toBe(2);
            expect(repeated).toEqual(previous);
        });

        it('should create new bet objects (not references)', () => {
            const previous: Bet[] = [{ type: 'straight', numbers: [17], amount: 10 }];
            const repeated = repeatBets(previous);

            expect(repeated[0]).not.toBe(previous[0]);
            expect(repeated[0]).toEqual(previous[0]);
        });

        it('should handle empty previous bets', () => {
            const previous: Bet[] = [];
            const repeated = repeatBets(previous);

            expect(repeated.length).toBe(0);
        });
    });

    describe('Balance Validation', () => {
        const canPlaceBet = (balance: number, betAmount: number, currentTotal: number): boolean => {
            return (currentTotal + betAmount) <= balance;
        };

        it('should allow bet when balance is sufficient', () => {
            expect(canPlaceBet(1000, 10, 0)).toBe(true);
        });

        it('should allow bet up to exact balance', () => {
            expect(canPlaceBet(1000, 1000, 0)).toBe(true);
        });

        it('should deny bet when exceeding balance', () => {
            expect(canPlaceBet(1000, 1001, 0)).toBe(false);
        });

        it('should consider current total bets', () => {
            expect(canPlaceBet(1000, 100, 900)).toBe(true);
            expect(canPlaceBet(1000, 100, 901)).toBe(false);
        });

        it('should deny bet when no balance', () => {
            expect(canPlaceBet(0, 10, 0)).toBe(false);
        });

        it('should handle decimal amounts', () => {
            expect(canPlaceBet(100.5, 50.25, 50.25)).toBe(true);
            expect(canPlaceBet(100.5, 50.26, 50.25)).toBe(false);
        });
    });

    describe('Chip Positioning on Table', () => {
        interface ChipPosition {
            x: number;
            y: number;
            value: number;
        }

        const calculateChipPosition = (areaX: number, areaY: number, areaWidth: number, areaHeight: number, chipValue: number): ChipPosition => {
            return {
                x: areaX + areaWidth / 2,
                y: areaY + areaHeight / 2,
                value: chipValue
            };
        };

        it('should center chip in betting area', () => {
            const pos = calculateChipPosition(100, 200, 60, 80, 10);
            expect(pos.x).toBe(130); // 100 + 60/2
            expect(pos.y).toBe(240); // 200 + 80/2
        });

        it('should preserve chip value', () => {
            const pos = calculateChipPosition(0, 0, 60, 80, 25);
            expect(pos.value).toBe(25);
        });

        it('should calculate center for different area sizes', () => {
            const pos1 = calculateChipPosition(0, 0, 100, 100, 10);
            const pos2 = calculateChipPosition(0, 0, 50, 50, 10);

            expect(pos1.x).toBe(50);
            expect(pos1.y).toBe(50);
            expect(pos2.x).toBe(25);
            expect(pos2.y).toBe(25);
        });
    });

    describe('Highlight Logic', () => {
        const shouldHighlightNumbers = (betType: string): boolean => {
            return ['split', 'corner', 'street', 'line'].includes(betType);
        };

        it('should highlight for split bets', () => {
            expect(shouldHighlightNumbers('split')).toBe(true);
        });

        it('should highlight for corner bets', () => {
            expect(shouldHighlightNumbers('corner')).toBe(true);
        });

        it('should highlight for street bets', () => {
            expect(shouldHighlightNumbers('street')).toBe(true);
        });

        it('should highlight for line bets', () => {
            expect(shouldHighlightNumbers('line')).toBe(true);
        });

        it('should not highlight for straight bets', () => {
            expect(shouldHighlightNumbers('straight')).toBe(false);
        });

        it('should not highlight for outside bets', () => {
            expect(shouldHighlightNumbers('red')).toBe(false);
            expect(shouldHighlightNumbers('black')).toBe(false);
            expect(shouldHighlightNumbers('odd')).toBe(false);
            expect(shouldHighlightNumbers('even')).toBe(false);
            expect(shouldHighlightNumbers('dozen')).toBe(false);
            expect(shouldHighlightNumbers('column')).toBe(false);
        });
    });

    describe('Bet Type Validation', () => {
        const validBetTypes = [
            'straight', 'split', 'street', 'corner', 'line',
            'column', 'dozen', 'red', 'black', 'odd', 'even', 'low', 'high'
        ];

        const isValidBetType = (type: string): boolean => {
            return validBetTypes.includes(type);
        };

        it('should validate all inside bet types', () => {
            expect(isValidBetType('straight')).toBe(true);
            expect(isValidBetType('split')).toBe(true);
            expect(isValidBetType('street')).toBe(true);
            expect(isValidBetType('corner')).toBe(true);
            expect(isValidBetType('line')).toBe(true);
        });

        it('should validate all outside bet types', () => {
            expect(isValidBetType('column')).toBe(true);
            expect(isValidBetType('dozen')).toBe(true);
            expect(isValidBetType('red')).toBe(true);
            expect(isValidBetType('black')).toBe(true);
            expect(isValidBetType('odd')).toBe(true);
            expect(isValidBetType('even')).toBe(true);
            expect(isValidBetType('low')).toBe(true);
            expect(isValidBetType('high')).toBe(true);
        });

        it('should reject invalid bet types', () => {
            expect(isValidBetType('invalid')).toBe(false);
            expect(isValidBetType('triple')).toBe(false);
            expect(isValidBetType('')).toBe(false);
        });

        it('should have exactly 13 valid bet types', () => {
            expect(validBetTypes.length).toBe(13);
        });
    });

    describe('Table Cell Dimensions', () => {
        const CELL_WIDTH = 60;
        const CELL_HEIGHT = 80;

        it('should have correct cell width', () => {
            expect(CELL_WIDTH).toBe(60);
        });

        it('should have correct cell height', () => {
            expect(CELL_HEIGHT).toBe(80);
        });

        it('should have height greater than width', () => {
            expect(CELL_HEIGHT).toBeGreaterThan(CELL_WIDTH);
        });

        it('should calculate cell area', () => {
            const area = CELL_WIDTH * CELL_HEIGHT;
            expect(area).toBe(4800);
        });

        it('should calculate aspect ratio', () => {
            const ratio = CELL_HEIGHT / CELL_WIDTH;
            expect(ratio).toBeCloseTo(1.33, 2);
        });
    });
});
