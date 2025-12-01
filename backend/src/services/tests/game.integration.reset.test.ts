import request from 'supertest';
import app from '../../app';
import { resetGame } from '../game.service';

describe('Game API Integration Tests - Reset', () => {
    beforeEach(() => {
        resetGame();
    });

    describe('POST /api/game/reset', () => {
        it('should reset balance to initial value', async () => {
            await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [{ type: 'straight', numbers: [17], amount: 500 }]
                });

            const resetResponse = await request(app)
                .post('/api/game/reset')
                .expect(200);

            expect(resetResponse.body.success).toBe(true);
            expect(resetResponse.body.balance).toBe(1000);

            const balanceResponse = await request(app)
                .get('/api/balance')
                .expect(200);

            expect(balanceResponse.body.balance).toBe(1000);
        });

        it('should clear history', async () => {
            await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [{ type: 'straight', numbers: [17], amount: 10 }]
                });

            await request(app).post('/api/game/reset').expect(200);

            const response = await request(app)
                .get('/api/game/history')
                .expect(200);

            expect(response.body.history).toEqual([]);
        });
    });
});
