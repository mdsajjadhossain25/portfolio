/**
 * GlitchText Component
 * 
 * Animated text with glitch effects, RGB split, and scan line animations.
 * Perfect for headlines and important text elements.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
    /** The text to display */
    children: string;
    /** HTML tag to use */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    /** Additional class names */
    className?: string;
    /** Glitch intensity (0-1) */
    intensity?: number;
    /** Whether to auto-glitch periodically */
    autoGlitch?: boolean;
    /** Auto-glitch interval in ms */
    glitchInterval?: number;
    /** Color for the glitch effect */
    glitchColor?: 'cyan' | 'purple' | 'crimson' | 'white';
    /** Whether to animate on hover */
    hoverGlitch?: boolean;
}

const glitchColors = {
    cyan: {
        primary: '#00ffff',
        secondary: '#ff00ff',
    },
    purple: {
        primary: '#a78bfa',
        secondary: '#00ffff',
    },
    crimson: {
        primary: '#dc267f',
        secondary: '#00ffff',
    },
    white: {
        primary: '#ffffff',
        secondary: '#00ffff',
    },
};

export function GlitchText({
    children,
    as: Component = 'span',
    className,
    intensity = 0.5,
    autoGlitch = true,
    glitchInterval = 3000,
    glitchColor = 'cyan',
    hoverGlitch = true,
}: GlitchTextProps) {
    const [isGlitching, setIsGlitching] = useState(false);
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: false });
    const colors = glitchColors[glitchColor];
    
    // Check for reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    // Auto-glitch effect
    useEffect(() => {
        if (!autoGlitch || !isInView || prefersReducedMotion) return;
        
        const triggerGlitch = () => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
        };
        
        // Initial glitch
        triggerGlitch();
        
        // Periodic glitches
        const interval = setInterval(triggerGlitch, glitchInterval);
        
        return () => clearInterval(interval);
    }, [autoGlitch, isInView, glitchInterval, prefersReducedMotion]);
    
    const MotionComponent = motion[Component] as any;
    
    const glitchOffset = 2 * intensity;
    
    // Animation variants
    const glitchVariants: Variants = {
        idle: {
            textShadow: 'none',
            x: 0,
        },
        glitch: {
            textShadow: [
                'none',
                `${-glitchOffset}px 0 ${colors.secondary}, ${glitchOffset}px 0 ${colors.primary}`,
                `${glitchOffset}px 0 ${colors.secondary}, ${-glitchOffset}px 0 ${colors.primary}`,
                `${-glitchOffset / 2}px 0 ${colors.secondary}, ${glitchOffset / 2}px 0 ${colors.primary}`,
                'none',
            ],
            x: [0, -glitchOffset, glitchOffset, -glitchOffset / 2, 0],
            transition: {
                duration: 0.2,
                times: [0, 0.25, 0.5, 0.75, 1],
            },
        },
    };
    
    if (prefersReducedMotion) {
        const StaticComponent = Component;
        return (
            <StaticComponent
                ref={ref as any}
                className={cn('relative inline-block', className)}
            >
                {children}
            </StaticComponent>
        );
    }
    
    return (
        <MotionComponent
            ref={ref as any}
            className={cn('relative inline-block', className)}
            variants={glitchVariants}
            animate={isGlitching ? 'glitch' : 'idle'}
            onHoverStart={hoverGlitch ? () => setIsGlitching(true) : undefined}
            onHoverEnd={hoverGlitch ? () => setIsGlitching(false) : undefined}
            style={{
                textShadow: `0 0 10px ${colors.primary}40`,
            }}
        >
            {/* Main text */}
            <span className="relative z-10">{children}</span>
            
            {/* Glitch layers (hidden but visible during animation) */}
            <span
                className="absolute top-0 left-0 opacity-0"
                style={{
                    color: colors.primary,
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                }}
                aria-hidden="true"
            >
                {children}
            </span>
            <span
                className="absolute top-0 left-0 opacity-0"
                style={{
                    color: colors.secondary,
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
                }}
                aria-hidden="true"
            >
                {children}
            </span>
        </MotionComponent>
    );
}

export default GlitchText;
