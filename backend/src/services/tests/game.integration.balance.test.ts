import request from 'supertest';
import app from '../../app';
import { resetGame } from '../game.service';

describe('Game API Integration Tests - Balance', () => {
    beforeEach(() => {
        resetGame();
    });

    describe('GET /api/balance', () => {
        it('should return initial balance of 1000', async () => {
            const response = await request(app)
                .get('/api/balance')
                .expect(200);

            expect(response.body).toEqual({ balance: 1000 });
        });
    });

    describe('Balance Flow Integration', () => {
        it('should correctly track balance through multiple spins', async () => {
            let expectedBalance = 1000;

            const spin1 = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [{ type: 'straight', numbers: [17], amount: 100 }]
                })
                .expect(200);

            expectedBalance = spin1.body.result.newBalance;

            const spin2 = await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [{ type: 'red', numbers: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36], amount: 50 }]
                })
                .expect(200);

            expectedBalance = spin2.body.result.newBalance;

            const balanceResponse = await request(app)
                .get('/api/balance')
                .expect(200);

            expect(balanceResponse.body.balance).toBe(expectedBalance);
        });

        it('should update balance after spin', async () => {
            await request(app)
                .post('/api/game/spin')
                .send({
                    bets: [
                        { type: 'straight', numbers: [17], amount: 100 }
                    ]
                })
                .expect(200);

            const balanceResponse = await request(app)
                .get('/api/balance')
                .expect(200);

            expect(balanceResponse.body.balance).not.toBe(1000);
        });
    });
});
