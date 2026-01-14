/**
 * Visual Effects Utilities
 * 
 * Advanced animation effects including glitch, glow, particles, and more.
 * These can be used throughout the portfolio for consistent visual styling.
 */

import { Variants, Transition } from 'framer-motion';
import gsap from 'gsap';

// ============================================================================
// GLITCH EFFECT
// ============================================================================

export interface GlitchConfig {
    intensity: number;      // 0-1, how strong the glitch
    frequency: number;      // How often glitch occurs (ms)
    duration: number;       // How long each glitch lasts (ms)
    colors: string[];       // RGB split colors
}

export const defaultGlitchConfig: GlitchConfig = {
    intensity: 0.5,
    frequency: 3000,
    duration: 200,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
};

/**
 * Glitch text animation variants for Framer Motion
 */
export const glitchTextVariants: Variants = {
    initial: {
        textShadow: 'none',
    },
    glitch: {
        textShadow: [
            'none',
            '-2px 0 #ff0000, 2px 0 #00ffff',
            '2px 0 #ff0000, -2px 0 #00ffff',
            '-1px 0 #ff0000, 1px 0 #00ffff',
            'none',
        ],
        x: [0, -2, 2, -1, 0],
        transition: {
            duration: 0.2,
            times: [0, 0.25, 0.5, 0.75, 1],
        },
    },
};

/**
 * GSAP glitch effect for text elements
 */
export const createGlitchEffect = (
    element: HTMLElement,
    config: Partial<GlitchConfig> = {}
) => {
    const { intensity, duration, colors } = { ...defaultGlitchConfig, ...config };
    
    const timeline = gsap.timeline();
    
    timeline
        .to(element, {
            textShadow: `${-2 * intensity}px 0 ${colors[0]}, ${2 * intensity}px 0 ${colors[2]}`,
            x: -2 * intensity,
            duration: duration / 1000 / 4,
        })
        .to(element, {
            textShadow: `${2 * intensity}px 0 ${colors[0]}, ${-2 * intensity}px 0 ${colors[2]}`,
            x: 2 * intensity,
            duration: duration / 1000 / 4,
        })
        .to(element, {
            textShadow: `${-1 * intensity}px 0 ${colors[0]}, ${1 * intensity}px 0 ${colors[2]}`,
            x: -1 * intensity,
            duration: duration / 1000 / 4,
        })
        .to(element, {
            textShadow: 'none',
            x: 0,
            duration: duration / 1000 / 4,
        });
    
    return timeline;
};

// ============================================================================
// GLOW EFFECTS
// ============================================================================

export const neonGlowColors = {
    cyan: 'rgba(0, 255, 255, 0.8)',
    purple: 'rgba(167, 139, 250, 0.8)',
    crimson: 'rgba(220, 38, 127, 0.8)',
    gold: 'rgba(255, 215, 0, 0.8)',
    green: 'rgba(0, 255, 127, 0.8)',
};

export type GlowColor = keyof typeof neonGlowColors;

/**
 * Generate box shadow for neon glow effect
 */
export const createNeonGlow = (color: GlowColor, intensity: number = 1): string => {
    const baseColor = neonGlowColors[color];
    return `
        0 0 ${5 * intensity}px ${baseColor},
        0 0 ${10 * intensity}px ${baseColor},
        0 0 ${20 * intensity}px ${baseColor},
        0 0 ${40 * intensity}px ${baseColor}
    `.trim();
};

/**
 * Pulsing glow animation variants
 */
export const pulsingGlowVariants = (color: GlowColor): Variants => ({
    initial: {
        boxShadow: createNeonGlow(color, 0.5),
    },
    animate: {
        boxShadow: [
            createNeonGlow(color, 0.5),
            createNeonGlow(color, 1),
            createNeonGlow(color, 0.5),
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
});

// ============================================================================
// PARTICLE EFFECTS
// ============================================================================

export interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speedX: number;
    speedY: number;
    color: string;
}

export interface ParticleConfig {
    count: number;
    minSize: number;
    maxSize: number;
    minSpeed: number;
    maxSpeed: number;
    colors: string[];
    connectDistance: number;
    mouseAttraction: number;
}

export const defaultParticleConfig: ParticleConfig = {
    count: 50,
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.1,
    maxSpeed: 0.5,
    colors: ['#00ffff', '#a78bfa', '#dc267f'],
    connectDistance: 150,
    mouseAttraction: 0.02,
};

/**
 * Generate random particles
 */
export const generateParticles = (
    width: number,
    height: number,
    config: Partial<ParticleConfig> = {}
): Particle[] => {
    const { count, minSize, maxSize, minSpeed, maxSpeed, colors } = {
        ...defaultParticleConfig,
        ...config,
    };
    
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.5 + 0.3,
        speedX: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
        speedY: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));
};

/**
 * Update particle positions
 */
export const updateParticles = (
    particles: Particle[],
    width: number,
    height: number,
    mouseX?: number,
    mouseY?: number,
    config: Partial<ParticleConfig> = {}
): Particle[] => {
    const { mouseAttraction } = { ...defaultParticleConfig, ...config };
    
    return particles.map(particle => {
        let { x, y, speedX, speedY } = particle;
        
        // Apply mouse attraction if mouse position provided
        if (mouseX !== undefined && mouseY !== undefined) {
            const dx = mouseX - x;
            const dy = mouseY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                speedX += (dx / distance) * mouseAttraction;
                speedY += (dy / distance) * mouseAttraction;
            }
        }
        
        // Update position
        x += speedX;
        y += speedY;
        
        // Wrap around edges
        if (x < 0) x = width;
        if (x > width) x = 0;
        if (y < 0) y = height;
        if (y > height) y = 0;
        
        return { ...particle, x, y, speedX, speedY };
    });
};

// ============================================================================
// TYPEWRITER EFFECT
// ============================================================================

export interface TypewriterConfig {
    speed: number;          // Characters per second
    deleteSpeed: number;    // Delete speed multiplier
    pauseDuration: number;  // Pause at end of word (ms)
    cursor: string;         // Cursor character
}

export const defaultTypewriterConfig: TypewriterConfig = {
    speed: 50,
    deleteSpeed: 2,
    pauseDuration: 2000,
    cursor: '|',
};

/**
 * GSAP typewriter effect
 */
export const createTypewriterEffect = (
    element: HTMLElement,
    texts: string[],
    config: Partial<TypewriterConfig> = {}
) => {
    const { speed, deleteSpeed, pauseDuration } = {
        ...defaultTypewriterConfig,
        ...config,
    };
    
    let currentIndex = 0;
    
    const typeText = (text: string, onComplete: () => void) => {
        let charIndex = 0;
        
        const type = () => {
            if (charIndex <= text.length) {
                element.textContent = text.slice(0, charIndex);
                charIndex++;
                setTimeout(type, speed);
            } else {
                setTimeout(onComplete, pauseDuration);
            }
        };
        
        type();
    };
    
    const deleteText = (onComplete: () => void) => {
        const text = element.textContent || '';
        let charIndex = text.length;
        
        const del = () => {
            if (charIndex >= 0) {
                element.textContent = text.slice(0, charIndex);
                charIndex--;
                setTimeout(del, speed / deleteSpeed);
            } else {
                onComplete();
            }
        };
        
        del();
    };
    
    const cycle = () => {
        typeText(texts[currentIndex], () => {
            deleteText(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                cycle();
            });
        });
    };
    
    cycle();
};

// ============================================================================
// SCAN LINE EFFECT
// ============================================================================

export const scanLineVariants: Variants = {
    animate: {
        y: ['0%', '100%'],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

// ============================================================================
// REVEAL EFFECTS
// ============================================================================

export const revealFromLeft: Variants = {
    initial: {
        x: -100,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export const revealFromRight: Variants = {
    initial: {
        x: 100,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export const revealFromBottom: Variants = {
    initial: {
        y: 50,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export const scaleReveal: Variants = {
    initial: {
        scale: 0.8,
        opacity: 0,
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// ============================================================================
// HUD METER ANIMATION
// ============================================================================

export const hudMeterVariants = (percentage: number): Variants => ({
    initial: {
        width: '0%',
    },
    animate: {
        width: `${percentage}%`,
        transition: {
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
        },
    },
});

// ============================================================================
// FLOATING ANIMATION
// ============================================================================

export const floatingVariants: Variants = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const floatingRotateVariants: Variants = {
    animate: {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export default {
    glitch: {
        variants: glitchTextVariants,
        create: createGlitchEffect,
        config: defaultGlitchConfig,
    },
    glow: {
        colors: neonGlowColors,
        create: createNeonGlow,
        pulsing: pulsingGlowVariants,
    },
    particles: {
        generate: generateParticles,
        update: updateParticles,
        config: defaultParticleConfig,
    },
    typewriter: {
        create: createTypewriterEffect,
        config: defaultTypewriterConfig,
    },
    reveal: {
        fromLeft: revealFromLeft,
        fromRight: revealFromRight,
        fromBottom: revealFromBottom,
        scale: scaleReveal,
    },
    floating: floatingVariants,
    scanLine: scanLineVariants,
    hudMeter: hudMeterVariants,
};
