import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from '../api.service';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service - Balance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBalance', () => {
        it('should return balance from API', async () => {
            const mockResponse = { balance: 1000 };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getBalance();

            expect(result).toBe(1000);
            expect(global.fetch).toHaveBeenCalledWith('/api/balance');
        });

        it('should handle different balance values', async () => {
            const mockResponse = { balance: 5432.50 };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getBalance();

            expect(result).toBe(5432.50);
        });

        it('should handle network error', async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

            await expect(apiService.getBalance()).rejects.toThrow('Network error');
        });

        it('should handle zero balance', async () => {
            const mockResponse = { balance: 0 };
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await apiService.getBalance();

            expect(result).toBe(0);
        });
    });
});
