import { describe, it, expect } from 'vitest';
import { GameHistoryEntry } from '../types';

describe('HistoryDisplay Component Logic', () => {
    describe('History Entry Creation', () => {
        const createHistoryEntry = (
            winningNumber: number,
            winningColor: 'red' | 'black' | 'green',
            betAmount: number,
            winAmount: number
        ): GameHistoryEntry => ({
            timestamp: new Date().toISOString(),
            winningNumber,
            winningColor,
            totalBetAmount: betAmount,
            totalWinAmount: winAmount,
            netProfit: winAmount - betAmount
        });

        it('should create entry with correct profit calculation', () => {
            const win = createHistoryEntry(17, 'black', 10, 360);
            expect(win.netProfit).toBe(350);

            const loss = createHistoryEntry(5, 'red', 50, 0);
            expect(loss.netProfit).toBe(-50);
        });

        it('should have valid ISO timestamp', () => {
            const entry = createHistoryEntry(17, 'black', 10, 360);
            const timestamp = new Date(entry.timestamp);
            expect(timestamp instanceof Date).toBe(true);
            expect(isNaN(timestamp.getTime())).toBe(false);
        });
    });

    describe('History Limit', () => {
        const limitHistory = (history: GameHistoryEntry[], maxItems: number): GameHistoryEntry[] => {
            return history.slice(0, maxItems);
        };

        it('should limit to specified number of items', () => {
            const history: GameHistoryEntry[] = Array.from({ length: 15 }, (_, i) => ({
                timestamp: new Date().toISOString(),
                winningNumber: i,
                winningColor: 'red' as const,
                totalBetAmount: 10,
                totalWinAmount: 0,
                netProfit: -10
            }));

            const limited = limitHistory(history, 8);
            expect(limited.length).toBe(8);
            expect(limited[0].winningNumber).toBe(0);
        });
    });

    describe('Number Color Mapping', () => {
        const getNumberColor = (number: number): number => {
            if (number === 0) return 0x008000; // Green
            const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            if (redNumbers.includes(number)) return 0xB00000; // Red
            return 0x111111; // Black
        };

        it('should return correct colors for 0, red, and black numbers', () => {
            expect(getNumberColor(0)).toBe(0x008000);
            expect(getNumberColor(1)).toBe(0xB00000);
            expect(getNumberColor(2)).toBe(0x111111);
        });
    });

    describe('History Update', () => {
        const updateHistory = (currentHistory: GameHistoryEntry[], newEntry: GameHistoryEntry): GameHistoryEntry[] => {
            return [newEntry, ...currentHistory];
        };

        it('should add new entry to beginning (newest first)', () => {
            const current: GameHistoryEntry[] = [
                { timestamp: '2025-12-01T10:01:00Z', winningNumber: 1, winningColor: 'red', totalBetAmount: 10, totalWinAmount: 0, netProfit: -10 }
            ];
            const newEntry: GameHistoryEntry = {
                timestamp: '2025-12-01T10:02:00Z', winningNumber: 2, winningColor: 'black', totalBetAmount: 10, totalWinAmount: 0, netProfit: -10
            };

            const updated = updateHistory(current, newEntry);
            expect(updated[0]).toEqual(newEntry);
            expect(updated.length).toBe(2);
        });
    });
});
