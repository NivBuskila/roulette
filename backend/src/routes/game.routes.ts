/**
 * Game Routes
 * 
 * REST API endpoints for the roulette game:
 * - POST /api/game/spin - Place bets and spin the wheel
 * - GET /api/game/history - Get game history
 * - POST /api/game/reset - Reset game state
 */

import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();

/**
 * POST /api/game/spin
 * Place bets and spin the wheel
 */
router.post('/spin', GameController.spin);

/**
 * GET /api/game/history
 * Get game history (last N games)
 */
router.get('/history', GameController.getHistory);

/**
 * POST /api/game/reset
 * Reset game state (for testing)
 */
router.post('/reset', GameController.reset);

/**
 * GET /api/game/seed-hash
 * Get current server seed hash (for provably fair verification)
 */
router.get('/seed-hash', GameController.getSeedHash);

/**
 * GET /api/game/verify
 * Get last spin data for verification
 */
router.get('/verify', GameController.verify);

export default router;
