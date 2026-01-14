/**
 * Animation Module Index
 * 
 * Central export for all animation utilities, variants, and effects.
 * Import from this file for convenient access to all animation tools.
 */

// Transition animations for page changes
export * from './transitions';
export { default as transitions } from './transitions';

// Cursor animation utilities
export * from './cursor';
export { default as cursor } from './cursor';

// Visual effects (glitch, glow, particles, etc.)
export * from './effects';
export { default as effects } from './effects';

// Re-export commonly used items for convenience
export {
    // Transitions
    cyberSlashVariants,
    energyWaveVariants,
    glitchVariants,
    fadeScaleVariants,
    hudPanelVariants,
    staggerContainer,
    staggerItem,
    smoothTransition,
    cinematicTransition,
    quickTransition,
} from './transitions';

export {
    // Cursor
    cursorDotVariants,
    cursorRingVariants,
    cursorGlowVariants,
    defaultCursorConfig,
    detectCursorState,
} from './cursor';

export {
    // Effects
    glitchTextVariants,
    createNeonGlow,
    neonGlowColors,
    generateParticles,
    updateParticles,
    floatingVariants,
    revealFromLeft,
    revealFromRight,
    revealFromBottom,
    scaleReveal,
} from './effects';
