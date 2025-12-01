/**
 * Main Entry Point
 * Initializes the Phaser game
 */

import Phaser from 'phaser';
import { gameConfig } from './config/game.config';

// Suppress harmless browser CSS parsing warnings from Phaser/Canvas text rendering
// The "Expected color but found '0'" warning is a Firefox-specific issue with no functional impact
// It occurs when Canvas measures text that looks like CSS values
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressPattern = /Expected color but found/;

console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && suppressPattern.test(args[0])) {
        return;
    }
    originalConsoleError.apply(console, args);
};

console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && suppressPattern.test(args[0])) {
        return;
    }
    originalConsoleWarn.apply(console, args);
};

// Create the Phaser game instance
new Phaser.Game(gameConfig);
