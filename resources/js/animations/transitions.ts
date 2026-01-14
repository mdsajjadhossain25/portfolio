/**
 * Page Transition Animations
 * 
 * Cinematic, game-like transitions inspired by anime UI and sci-fi interfaces.
 * These variants are used with Framer Motion for seamless page transitions.
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// TRANSITION TIMINGS
// ============================================================================

export const springTransition: Transition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1,
};

export const smoothTransition: Transition = {
    type: 'tween',
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth feel
};

export const cinematicTransition: Transition = {
    type: 'tween',
    duration: 0.8,
    ease: [0.76, 0, 0.24, 1], // Dramatic ease for cinematic feel
};

export const quickTransition: Transition = {
    type: 'tween',
    duration: 0.3,
    ease: 'easeOut',
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

/**
 * Cyber Slash Transition
 * Inspired by anime sword slash effects - diagonal wipe with glow
 */
export const cyberSlashVariants: Variants = {
    initial: {
        opacity: 0,
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        filter: 'blur(0px)',
        transition: cinematicTransition,
    },
    exit: {
        opacity: 0,
        clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        filter: 'blur(10px)',
        transition: { ...cinematicTransition, duration: 0.5 },
    },
};

/**
 * Energy Wave Transition
 * Radial expansion effect like an energy pulse
 */
export const energyWaveVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(20px) brightness(2)',
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        transition: {
            ...cinematicTransition,
            scale: { type: 'spring', stiffness: 80, damping: 20 },
        },
    },
    exit: {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(20px) brightness(2)',
        transition: quickTransition,
    },
};

/**
 * Glitch Transition
 * Digital glitch effect with RGB split
 */
export const glitchVariants: Variants = {
    initial: {
        opacity: 0,
        x: -20,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
            ...smoothTransition,
            opacity: { duration: 0.4 },
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        filter: 'blur(10px)',
        transition: quickTransition,
    },
};

/**
 * Fade Scale Transition
 * Simple but elegant fade with subtle scale
 */
export const fadeScaleVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: smoothTransition,
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        y: -10,
        transition: quickTransition,
    },
};

/**
 * HUD Panel Transition
 * Like a sci-fi HUD panel appearing
 */
export const hudPanelVariants: Variants = {
    initial: {
        opacity: 0,
        y: 50,
        rotateX: -15,
        transformPerspective: 1000,
    },
    animate: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            ...cinematicTransition,
            rotateX: springTransition,
        },
    },
    exit: {
        opacity: 0,
        y: -30,
        rotateX: 10,
        transition: quickTransition,
    },
};

// ============================================================================
// STAGGER ANIMATIONS FOR CHILDREN
// ============================================================================

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

export const staggerItem: Variants = {
    initial: {
        opacity: 0,
        y: 30,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: smoothTransition,
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: quickTransition,
    },
};

// ============================================================================
// OVERLAY TRANSITION (for page transition effects)
// ============================================================================

export const overlayVariants: Variants = {
    initial: {
        scaleX: 0,
        originX: 0,
    },
    animate: {
        scaleX: [0, 1, 1, 0],
        originX: [0, 0, 1, 1],
        transition: {
            duration: 1.2,
            times: [0, 0.4, 0.6, 1],
            ease: [0.76, 0, 0.24, 1],
        },
    },
};

// ============================================================================
// UTILITY: Get transition variant by name
// ============================================================================

export type TransitionType = 
    | 'cyberSlash'
    | 'energyWave'
    | 'glitch'
    | 'fadeScale'
    | 'hudPanel';

export const getTransitionVariants = (type: TransitionType): Variants => {
    const variants: Record<TransitionType, Variants> = {
        cyberSlash: cyberSlashVariants,
        energyWave: energyWaveVariants,
        glitch: glitchVariants,
        fadeScale: fadeScaleVariants,
        hudPanel: hudPanelVariants,
    };
    return variants[type];
};

// Default export for convenience
export default {
    cyberSlash: cyberSlashVariants,
    energyWave: energyWaveVariants,
    glitch: glitchVariants,
    fadeScale: fadeScaleVariants,
    hudPanel: hudPanelVariants,
    staggerContainer,
    staggerItem,
    overlay: overlayVariants,
};
