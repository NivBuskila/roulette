import { Request, Response } from 'express';
import { SpinRequest } from '../types';
import {
    executeSpin,
    getHistory,
    resetGame,
    getServerSeedHash,
    getLastSpinData
} from '../services/game.service';

export class GameController {
    /**
     * Place bets and spin the wheel
     */
    static spin(req: Request<object, object, SpinRequest>, res: Response): void {
        try {
            const { bets } = req.body;

            if (!bets || !Array.isArray(bets)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_BET',
                        message: 'Bets must be an array',
                    },
                });
                return;
            }

            const result = executeSpin(bets);

            if (result.success) {
                res.json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Spin error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An unexpected error occurred',
                },
            });
        }
    }

    /**
     * Get game history (last N games)
     */
    static getHistory(req: Request, res: Response): void {
        try {
            const limitParam = req.query.limit as string;
            let limit = 10;

            if (limitParam) {
                const parsed = parseInt(limitParam, 10);
                if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
                    limit = parsed;
                }
                // If invalid, fallback to default (10)
            }

            const history = getHistory(limit);

            res.json({ history });
        } catch (error) {
            console.error('History error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An unexpected error occurred',
                },
            });
        }
    }

    /**
     * Reset game state (for testing)
     */
    static reset(_req: Request, res: Response): void {
        try {
            const result = resetGame();
            res.json(result);
        } catch (error) {
            console.error('Reset error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An unexpected error occurred',
                },
            });
        }
    }

    /**
     * Get current server seed hash (for provably fair verification)
     */
    static getSeedHash(_req: Request, res: Response): void {
        try {
            const hash = getServerSeedHash();
            res.json({ serverSeedHash: hash });
        } catch (error) {
            console.error('Seed hash error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An unexpected error occurred',
                },
            });
        }
    }

    /**
     * Get last spin data for verification
     */
    static verify(_req: Request, res: Response): void {
        try {
            const spinData = getLastSpinData();
            if (!spinData) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'No spin data available. Play a round first.',
                    },
                });
                return;
            }
            res.json({
                success: true,
                verificationData: spinData
            });
        } catch (error) {
            console.error('Verify error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An unexpected error occurred',
                },
            });
        }
    }
}
