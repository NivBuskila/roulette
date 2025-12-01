import request from 'supertest';
import app from '../../app';
import { resetGame } from '../game.service';

describe('Game API Integration Tests - Spin', () => {
    beforeEach(() => {
        resetGame();
    });

    describe('POST /api/game/spin', () => {
        it('should accept a valid straight bet and return result', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: 10 }
                    ]
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.result).toBeDefined();
            expect(response.body.result.winningNumber).toBeGreaterThanOrEqual(0);
            expect(response.body.result.winningNumber).toBeLessThanOrEqual(36);
            expect(response.body.result.winningColor).toMatch(/^(red|black|green)$/);
            expect(response.body.result.totalBetAmount).toBe(10);
            expect(response.body.result.bets).toHaveLength(1);
        });

        it('should accept multiple bets simultaneously', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: 10 },
                        { type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 20 },
                        { type: 'even', numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36], amount: 15 }
                    ]
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.result.totalBetAmount).toBe(45);
            expect(response.body.result.bets).toHaveLength(3);
        });

        it('should reject bet with insufficient balance', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: 2000 }
                    ]
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toMatch(/INSUFFICIENT_BALANCE|INVALID_BET/);
        });

        it('should reject bet with negative amount', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: -10 }
                    ]
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_BET');
        });

        it('should reject bet with invalid number (> 36)', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [37], amount: 10 }
                    ]
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_BET');
        });

        it('should reject empty bets array', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({ bets: [] })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_BET');
        });

        it('should reject invalid bet type', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'invalid_type', numbers: [17], amount: 10 }
                    ]
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_BET_TYPE');
        });

        it('should reject split bet with non-adjacent numbers', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'split', numbers: [1, 5], amount: 10 }
                    ]
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_BET');
        });

        it('should correctly calculate payout for winning straight bet', async () => {
            const response = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: 10 }
                    ]
                })
                .expect(200);

            const result = response.body.result;
            const bet = result.bets[0];

            if (bet.won) {
                expect(bet.payout).toBe(360);
                expect(result.totalWinAmount).toBe(360);
                expect(result.netProfit).toBe(350);
            } else {
                expect(bet.payout).toBe(0);
                expect(result.totalWinAmount).toBe(0);
                expect(result.netProfit).toBe(-10);
            }
        });
    });
});
