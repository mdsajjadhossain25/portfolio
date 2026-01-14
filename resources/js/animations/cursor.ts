/**
 * Cursor Animation Utilities
 * 
 * Configuration and animation values for the futuristic animated cursor.
 * Includes hover states, click effects, and trail animations.
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// CURSOR CONFIGURATION
// ============================================================================

export interface CursorConfig {
    size: number;
    ringSize: number;
    trailLength: number;
    glowIntensity: number;
    followSpeed: number;
}

export const defaultCursorConfig: CursorConfig = {
    size: 12,           // Main cursor dot size
    ringSize: 40,       // Outer ring size
    trailLength: 8,     // Number of trail particles
    glowIntensity: 0.8, // Glow effect intensity (0-1)
    followSpeed: 0.15,  // How fast the cursor follows (0-1)
};

// ============================================================================
// CURSOR STATES
// ============================================================================

export type CursorState = 
    | 'default'
    | 'hover'
    | 'click'
    | 'link'
    | 'text'
    | 'grab'
    | 'grabbing'
    | 'hidden';

// ============================================================================
// CURSOR VARIANTS
// ============================================================================

/**
 * Main cursor dot variants
 */
export const cursorDotVariants: Variants = {
    default: {
        scale: 1,
        opacity: 1,
        backgroundColor: 'rgb(0, 255, 255)', // Neon cyan
    },
    hover: {
        scale: 1.5,
        opacity: 1,
        backgroundColor: 'rgb(167, 139, 250)', // Purple
    },
    click: {
        scale: 0.8,
        opacity: 1,
        backgroundColor: 'rgb(255, 255, 255)',
    },
    link: {
        scale: 1.8,
        opacity: 0.8,
        backgroundColor: 'rgb(0, 255, 255)',
    },
    text: {
        scale: 0.5,
        opacity: 0.8,
        scaleX: 0.2,
        backgroundColor: 'rgb(0, 255, 255)',
    },
    grab: {
        scale: 1.2,
        opacity: 1,
        backgroundColor: 'rgb(220, 38, 127)', // Crimson
    },
    grabbing: {
        scale: 0.9,
        opacity: 1,
        backgroundColor: 'rgb(220, 38, 127)',
    },
    hidden: {
        scale: 0,
        opacity: 0,
    },
};

/**
 * Outer ring variants
 */
export const cursorRingVariants: Variants = {
    default: {
        scale: 1,
        opacity: 0.5,
        borderColor: 'rgba(0, 255, 255, 0.5)',
        borderWidth: 2,
    },
    hover: {
        scale: 1.5,
        opacity: 0.8,
        borderColor: 'rgba(167, 139, 250, 0.8)',
        borderWidth: 3,
    },
    click: {
        scale: 2,
        opacity: 0.3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
    },
    link: {
        scale: 2,
        opacity: 0.6,
        borderColor: 'rgba(0, 255, 255, 0.6)',
        borderWidth: 2,
        rotate: 45,
    },
    text: {
        scale: 0.8,
        opacity: 0.4,
        borderColor: 'rgba(0, 255, 255, 0.4)',
        borderWidth: 1,
    },
    grab: {
        scale: 1.3,
        opacity: 0.7,
        borderColor: 'rgba(220, 38, 127, 0.7)',
        borderWidth: 2,
    },
    grabbing: {
        scale: 1.1,
        opacity: 0.9,
        borderColor: 'rgba(220, 38, 127, 0.9)',
        borderWidth: 3,
    },
    hidden: {
        scale: 0,
        opacity: 0,
    },
};

/**
 * Glow effect variants
 */
export const cursorGlowVariants: Variants = {
    default: {
        scale: 1,
        opacity: 0.3,
        boxShadow: '0 0 20px 10px rgba(0, 255, 255, 0.3)',
    },
    hover: {
        scale: 1.8,
        opacity: 0.5,
        boxShadow: '0 0 40px 20px rgba(167, 139, 250, 0.4)',
    },
    click: {
        scale: 3,
        opacity: 0.8,
        boxShadow: '0 0 60px 30px rgba(255, 255, 255, 0.5)',
    },
    link: {
        scale: 2,
        opacity: 0.4,
        boxShadow: '0 0 30px 15px rgba(0, 255, 255, 0.4)',
    },
    text: {
        scale: 0.5,
        opacity: 0.2,
        boxShadow: '0 0 10px 5px rgba(0, 255, 255, 0.2)',
    },
    grab: {
        scale: 1.5,
        opacity: 0.4,
        boxShadow: '0 0 25px 12px rgba(220, 38, 127, 0.4)',
    },
    grabbing: {
        scale: 1.2,
        opacity: 0.6,
        boxShadow: '0 0 30px 15px rgba(220, 38, 127, 0.5)',
    },
    hidden: {
        scale: 0,
        opacity: 0,
        boxShadow: '0 0 0px 0px rgba(0, 0, 0, 0)',
    },
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const cursorTransition: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 28,
    mass: 0.5,
};

export const cursorRingTransition: Transition = {
    type: 'spring',
    stiffness: 250,
    damping: 20,
    mass: 1,
};

export const cursorGlowTransition: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
    mass: 0.8,
};

// ============================================================================
// TRAIL CONFIGURATION
// ============================================================================

export interface TrailParticle {
    id: number;
    x: number;
    y: number;
    opacity: number;
    scale: number;
}

/**
 * Generate initial trail particles
 */
export const generateTrailParticles = (count: number): TrailParticle[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        opacity: 1 - (i / count) * 0.8,
        scale: 1 - (i / count) * 0.5,
    }));
};

/**
 * Update trail particles with new position
 */
export const updateTrailParticles = (
    particles: TrailParticle[],
    x: number,
    y: number
): TrailParticle[] => {
    const newParticles = [...particles];
    
    // Shift all particles back
    for (let i = newParticles.length - 1; i > 0; i--) {
        newParticles[i] = {
            ...newParticles[i],
            x: newParticles[i - 1].x,
            y: newParticles[i - 1].y,
        };
    }
    
    // Set first particle to current position
    if (newParticles.length > 0) {
        newParticles[0] = {
            ...newParticles[0],
            x,
            y,
        };
    }
    
    return newParticles;
};

// ============================================================================
// HOVER TARGET DETECTION
// ============================================================================

export const interactiveElements = [
    'a',
    'button',
    '[data-cursor="pointer"]',
    '[data-cursor="link"]',
];

export const textElements = [
    'input',
    'textarea',
    '[contenteditable="true"]',
    '[data-cursor="text"]',
];

export const grabElements = [
    '[draggable="true"]',
    '[data-cursor="grab"]',
];

/**
 * Detect cursor state based on hovered element
 */
export const detectCursorState = (element: Element | null): CursorState => {
    if (!element) return 'default';
    
    // Check for explicit cursor data attribute
    const explicitCursor = element.getAttribute('data-cursor') as CursorState | null;
    if (explicitCursor) return explicitCursor;
    
    // Check element type
    const tagName = element.tagName.toLowerCase();
    
    if (interactiveElements.some(selector => element.matches(selector))) {
        return 'link';
    }
    
    if (textElements.some(selector => element.matches(selector))) {
        return 'text';
    }
    
    if (grabElements.some(selector => element.matches(selector))) {
        return 'grab';
    }
    
    // Check parent elements
    const parent = element.parentElement;
    if (parent) {
        const parentState = detectCursorState(parent);
        if (parentState !== 'default') return parentState;
    }
    
    return 'default';
};

export default {
    config: defaultCursorConfig,
    dotVariants: cursorDotVariants,
    ringVariants: cursorRingVariants,
    glowVariants: cursorGlowVariants,
    transitions: {
        cursor: cursorTransition,
        ring: cursorRingTransition,
        glow: cursorGlowTransition,
    },
};
