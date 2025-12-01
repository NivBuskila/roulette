import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from '../api.service';
import { GameHistoryEntry } from '../../types';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service - History', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getGameHistory', () => {
        it('should return game history with default limit', async () => {
            const mockHistory: GameHistoryEntry[] = [
                {
                    timestamp: '2025-12-01T10:00:00Z',
                    winningNumber: 17,
                    winningColor: 'black',
                    totalBetAmount: 10,
                    totalWinAmount: 360,
                    netProfit: 350
                }
            ];
            const mockResponse = { history: mockHistory };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getGameHistory();

            expect(result).toEqual(mockHistory);
            expect(global.fetch).toHaveBeenCalledWith('/api/game/history?limit=10');
        });

        it('should return game history with custom limit', async () => {
            const mockHistory: GameHistoryEntry[] = [];
            const mockResponse = { history: mockHistory };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getGameHistory(20);

            expect(result).toEqual(mockHistory);
            expect(global.fetch).toHaveBeenCalledWith('/api/game/history?limit=20');
        });

        it('should handle empty history', async () => {
            const mockResponse = { history: [] };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getGameHistory();

            expect(result).toEqual([]);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle multiple history entries', async () => {
            const mockHistory: GameHistoryEntry[] = [
                {
                    timestamp: '2025-12-01T10:02:00Z',
                    winningNumber: 5,
                    winningColor: 'red',
                    totalBetAmount: 20,
                    totalWinAmount: 0,
                    netProfit: -20
                },
                {
                    timestamp: '2025-12-01T10:01:00Z',
                    winningNumber: 17,
                    winningColor: 'black',
                    totalBetAmount: 10,
                    totalWinAmount: 360,
                    netProfit: 350
                }
            ];
            const mockResponse = { history: mockHistory };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getGameHistory();

            expect(result).toEqual(mockHistory);
            expect(result).toHaveLength(2);
        });
    });
});
