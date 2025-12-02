/**
 * Phaser Game Configuration
 */

import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';

/**
 * Calculate optimal game resolution based on screen size and DPR
 * This ensures crisp graphics on all devices (including Retina/4K)
 */
const getOptimalResolution = () => {
  const dpr = window.devicePixelRatio || 1;
  const isPortrait = window.innerHeight > window.innerWidth;

  // Target aspect ratios
  const TARGET_ASPECT_LANDSCAPE = 16 / 9;  // 1.777...
  const TARGET_ASPECT_PORTRAIT = 9 / 16;   // 0.5625

  // Get container size (accounting for padding/margins)
  const containerWidth = Math.min(window.innerWidth * 0.95, window.innerWidth - 40);
  const containerHeight = Math.min(window.innerHeight * 0.85, window.innerHeight - 100);

  let width: number;
  let height: number;

  if (isPortrait) {
    // Portrait mode: height is the limiting factor
    height = Math.floor(containerHeight * dpr);
    width = Math.floor(height * TARGET_ASPECT_PORTRAIT);
  } else {
    // Landscape mode: width is the limiting factor
    width = Math.floor(containerWidth * dpr);
    height = Math.floor(width / TARGET_ASPECT_LANDSCAPE);
  }

  // Ensure dimensions are even numbers (better for rendering)
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  // Cap at reasonable maximums to avoid performance issues
  const MAX_WIDTH = 3840;  // 4K width
  const MAX_HEIGHT = 2160; // 4K height

  width = Math.min(width, MAX_WIDTH);
  height = Math.min(height, MAX_HEIGHT);

  console.log(`Resolution: ${width}x${height} (DPR: ${dpr}, Container: ${Math.floor(containerWidth)}x${Math.floor(containerHeight)})`);

  return { width, height, dpr };
};

const { width, height, dpr } = getOptimalResolution();

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // Use WebGL when available, fallback to Canvas
  width,
  height,
  parent: 'game',
  backgroundColor: '#0f3460',
  scene: [BootScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // Perfect pixel scaling
    autoRound: true,  // Round pixel positions to integers
    // Zoom compensation for high DPR screens
    zoom: 1 / dpr,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,  // CRITICAL: prevents sub-pixel rendering blur
    transparent: false,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    // Force WebGL for better performance
    powerPreference: 'high-performance',
  },
};

// Handle orientation changes and window resize
let resizeTimeout: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  // Debounce resize events
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Reload page on significant size changes (orientation)
    const newResolution = getOptimalResolution();
    const currentAspect = width / height;
    const newAspect = newResolution.width / newResolution.height;

    // If aspect ratio changed significantly (orientation change)
    if (Math.abs(currentAspect - newAspect) > 0.5) {
      console.log('Orientation changed, reloading...');
      window.location.reload();
    }
  }, 300);
});
