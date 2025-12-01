import request from 'supertest';
import app from '../../app';
import { resetGame } from '../game.service';

describe('Game API Integration Tests - History', () => {
    beforeEach(() => {
        resetGame();
    });

    describe('GET /api/game/history', () => {
        it('should return empty history initially', async () => {
            const response = await request(app)
                .get('/api/game/history')
                .expect(200);

            expect(response.body.history).toEqual([]);
        });

        it('should record spins in history', async () => {
            await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [{ type: 'straight', numbers: [17], amount: 10 }]
                })
                .expect(200);

            const response = await request(app)
                .get('/api/game/history')
                .expect(200);

            expect(response.body.history).toHaveLength(1);
            expect(response.body.history[0].winningNumber).toBeDefined();
            expect(response.body.history[0].winningColor).toBeDefined();
            expect(response.body.history[0].totalBetAmount).toBe(10);
            expect(response.body.history[0].timestamp).toBeDefined();
        });

        it('should respect limit parameter', async () => {
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/api/game/spin')
                    .send({
                        bets: [{ type: 'straight', numbers: [i], amount: 1 }]
                    });
            }

            const response = await request(app)
                .get('/api/game/history?limit=3')
                .expect(200);

            expect(response.body.history).toHaveLength(3);
        });

        it('should return most recent spins first', async () => {
            for (let i = 1; i <= 3; i++) {
                await request(app)
                    .post('/api/game/spin')
                    .send({
                        bets: [{ type: 'straight', numbers: [0], amount: i }]
                    });
            }

            const response = await request(app)
                .get('/api/game/history')
                .expect(200);

            expect(response.body.history[0].totalBetAmount).toBe(3);
            expect(response.body.history[2].totalBetAmount).toBe(1);
        });
    });
});
