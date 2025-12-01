/**
 * Balance Routes
 * 
 * REST API endpoint for balance management:
 * - GET /api/balance - Get current balance
 */

import { Router, Request, Response } from 'express';
import { getBalance } from '../services/game.service';

const router = Router();

/**
 * GET /api/balance
 * Get current player balance
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const balance = getBalance();
    res.json({ balance });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
});

export default router;
