/**
 * API Service
 * Handles all communication with the backend
 */

import { Bet, GameResult, GameHistoryEntry, ApiResponse } from '../types';

const API_BASE = '/api';

/**
 * Get current balance
 */
export async function getBalance(): Promise<number> {
  const response = await fetch(`${API_BASE}/balance`);
  const data = await response.json();
  return data.balance;
}

/**
 * Place bets and spin the wheel
 */
export async function placeBetsAndSpin(bets: Bet[]): Promise<{ success: true; result: GameResult } | { success: false; error: { code: string; message: string } }> {
  const response = await fetch(`${API_BASE}/game/spin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bets }),
  });

  const data: ApiResponse<GameResult> = await response.json();
  return data;
}

/**
 * Get game history
 */
export async function getGameHistory(limit: number = 10): Promise<GameHistoryEntry[]> {
  const response = await fetch(`${API_BASE}/game/history?limit=${limit}`);
  const data = await response.json();
  return data.history;
}

/**
 * Reset game
 */
export async function resetGame(): Promise<number> {
  const response = await fetch(`${API_BASE}/game/reset`, {
    method: 'POST',
  });
  const data = await response.json();
  return data.balance;
}

/**
 * Get server seed hash (for provably fair)
 */
export async function getServerSeedHash(): Promise<string> {
  const response = await fetch(`${API_BASE}/game/seed-hash`);
  const data = await response.json();
  return data.serverSeedHash;
}
