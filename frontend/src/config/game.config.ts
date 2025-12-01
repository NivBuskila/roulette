/**
 * Phaser Game Configuration
 */

import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';

// Adaptive resolution based on screen size
const getResolution = () => {
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    return { width: 1080, height: 1920 };
  }

  // For all landscape modes, use the full HD resolution to ensure all components fit side-by-side
  // The game will be scaled down to fit the screen
  return { width: 1920, height: 1080 };
};

const resolution = getResolution();

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // Use WebGL when available, fallback to Canvas
  width: resolution.width,
  height: resolution.height,
  parent: 'game',
  backgroundColor: '#0f3460',
  scene: [BootScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
};
