/**
 * Server Entry Point
 */

import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🎰 Roulette Backend running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/balance       - Get current balance`);
  console.log(`   POST /api/game/spin     - Place bets and spin`);
  console.log(`   GET  /api/game/history  - Get game history`);
  console.log(`   POST /api/game/reset    - Reset game state`);
  console.log(`   GET  /api/game/seed-hash - Get server seed hash`);
  console.log(`   GET  /api/game/verify   - Get verification data`);
});
