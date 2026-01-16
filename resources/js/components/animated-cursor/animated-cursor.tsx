/**
 * AnimatedCursor Component - Performance Optimized
 * 
 * A futuristic animated cursor with INSTANT core response and 
 * smooth trailing effects. Uses RAF-based position tracking
 * for maximum responsiveness.
 * 
 * Architecture:
 * - Core dot: Direct CSS transform, NO spring physics (instant)
 * - Outer ring: Smooth interpolation (slight delay)
 * - Glow effect: Heavier interpolation (visual trail)
 * - Trail particles: Throttled, non-blocking
 */

import { useCallback, useEffect, useRef, useState, memo, useMemo } from 'react';
import { useCursorPosition } from '@/hooks/use-cursor-position';
import { useAppearance } from '@/hooks/use-appearance';
import {
    CursorState,
    detectCursorState,
} from '@/animations/cursor';

interface AnimatedCursorProps {
    /** Whether the cursor is enabled */
    enabled?: boolean;
}

// Cursor size config - crosshair style
const CURSOR_CONFIG = {
    coreSize: 8,      // Diamond core
    ringSize: 36,     // Outer ring
    glowSize: 50,     // Glow radius
    crossLength: 12,  // Crosshair arm length
};

// Theme-aware color definitions
const getThemeColors = (isDark: boolean) => ({
    // Primary cursor color - green for dark, dark purple/blue for light
    primary: isDark ? 'rgb(0, 255, 136)' : 'rgb(59, 130, 246)',
    primaryRgba: (alpha: number) => isDark ? `rgba(0, 255, 136, ${alpha})` : `rgba(59, 130, 246, ${alpha})`,
    // Hover color - purple for both modes
    hover: 'rgb(167, 139, 250)',
    hoverRgba: (alpha: number) => `rgba(167, 139, 250, ${alpha})`,
    // Grab color - orange for both modes
    grab: 'rgb(255, 107, 0)',
    grabRgba: (alpha: number) => `rgba(255, 107, 0, ${alpha})`,
    // Click color - white for dark, dark for light
    click: isDark ? 'rgb(255, 255, 255)' : 'rgb(30, 41, 59)',
    clickRgba: (alpha: number) => isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(30, 41, 59, ${alpha})`,
});

// State-based styles for DIAMOND core (45deg rotated square)
const getDotStyles = (isDark: boolean): Record<CursorState, React.CSSProperties> => {
    const colors = getThemeColors(isDark);
    return {
        default: {
            width: CURSOR_CONFIG.coreSize,
            height: CURSOR_CONFIG.coreSize,
            backgroundColor: 'transparent',
            border: `2px solid ${colors.primary}`,
            boxShadow: `0 0 8px ${colors.primaryRgba(0.9)}, inset 0 0 4px ${colors.primaryRgba(0.3)}`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        hover: {
            width: CURSOR_CONFIG.coreSize * 1.4,
            height: CURSOR_CONFIG.coreSize * 1.4,
            backgroundColor: colors.hoverRgba(0.3),
            border: `2px solid ${colors.hover}`,
            boxShadow: `0 0 15px ${colors.hoverRgba(0.9)}, inset 0 0 6px ${colors.hoverRgba(0.5)}`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        click: {
            width: CURSOR_CONFIG.coreSize * 0.6,
            height: CURSOR_CONFIG.coreSize * 0.6,
            backgroundColor: colors.click,
            border: `2px solid ${colors.click}`,
            boxShadow: `0 0 20px ${colors.clickRgba(1)}, 0 0 40px ${colors.primaryRgba(0.5)}`,
            transform: 'translate(-50%, -50%) rotate(45deg) scale(1.5)',
        },
        link: {
            width: CURSOR_CONFIG.coreSize * 1.6,
            height: CURSOR_CONFIG.coreSize * 1.6,
            backgroundColor: colors.primaryRgba(0.2),
            border: `2px solid ${colors.primary}`,
            boxShadow: `0 0 20px ${colors.primaryRgba(1)}, inset 0 0 8px ${colors.primaryRgba(0.6)}`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        text: {
            width: 3,
            height: CURSOR_CONFIG.coreSize * 2.5,
            backgroundColor: colors.primary,
            border: 'none',
            boxShadow: `0 0 10px ${colors.primaryRgba(0.8)}`,
            transform: 'translate(-50%, -50%)',
        },
        grab: {
            width: CURSOR_CONFIG.coreSize * 1.2,
            height: CURSOR_CONFIG.coreSize * 1.2,
            backgroundColor: colors.grabRgba(0.3),
            border: `2px solid ${colors.grab}`,
            boxShadow: `0 0 12px ${colors.grabRgba(0.9)}`,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        grabbing: {
            width: CURSOR_CONFIG.coreSize * 0.8,
            height: CURSOR_CONFIG.coreSize * 0.8,
            backgroundColor: colors.grab,
            border: `2px solid ${colors.grab}`,
            boxShadow: `0 0 15px ${colors.grabRgba(1)}`,
            transform: 'translate(-50%, -50%) rotate(45deg) scale(0.8)',
        },
        hidden: {
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
    };
};

// Outer targeting ring - rotated square (diamond shape)
const getRingStyles = (isDark: boolean): Record<CursorState, React.CSSProperties> => {
    const colors = getThemeColors(isDark);
    return {
        default: {
            width: CURSOR_CONFIG.ringSize,
            height: CURSOR_CONFIG.ringSize,
            borderColor: colors.primaryRgba(0.4),
            borderWidth: 1,
            opacity: 0.6,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        hover: {
            width: CURSOR_CONFIG.ringSize * 1.4,
            height: CURSOR_CONFIG.ringSize * 1.4,
            borderColor: colors.hoverRgba(0.7),
            borderWidth: 2,
            opacity: 0.9,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        click: {
            width: CURSOR_CONFIG.ringSize * 1.8,
            height: CURSOR_CONFIG.ringSize * 1.8,
            borderColor: colors.clickRgba(0.6),
            borderWidth: 1,
            opacity: 0.4,
            transform: 'translate(-50%, -50%) rotate(45deg) scale(1.2)',
        },
        link: {
            width: CURSOR_CONFIG.ringSize * 1.5,
            height: CURSOR_CONFIG.ringSize * 1.5,
            borderColor: colors.primaryRgba(0.6),
            borderWidth: 2,
            opacity: 0.8,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        text: {
            width: CURSOR_CONFIG.ringSize * 0.6,
            height: CURSOR_CONFIG.ringSize * 0.6,
            borderColor: colors.primaryRgba(0.3),
            borderWidth: 1,
            opacity: 0.4,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        grab: {
            width: CURSOR_CONFIG.ringSize * 1.2,
            height: CURSOR_CONFIG.ringSize * 1.2,
            borderColor: colors.grabRgba(0.6),
            borderWidth: 2,
            opacity: 0.7,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
        grabbing: {
            width: CURSOR_CONFIG.ringSize,
            height: CURSOR_CONFIG.ringSize,
            borderColor: colors.grabRgba(0.9),
            borderWidth: 2,
            opacity: 0.9,
            transform: 'translate(-50%, -50%) rotate(45deg) scale(0.9)',
        },
        hidden: {
            width: 0,
            height: 0,
            borderColor: 'transparent',
            borderWidth: 0,
            opacity: 0,
            transform: 'translate(-50%, -50%) rotate(45deg)',
        },
    };
};

// Ambient glow with theme-aware colors
const getGlowStyles = (isDark: boolean): Record<CursorState, React.CSSProperties> => {
    const colors = getThemeColors(isDark);
    return {
        default: {
            width: CURSOR_CONFIG.glowSize,
            height: CURSOR_CONFIG.glowSize,
            background: `radial-gradient(circle, ${colors.primaryRgba(0.12)} 0%, transparent 70%)`,
            opacity: 0.6,
        },
        hover: {
            width: CURSOR_CONFIG.glowSize * 1.5,
            height: CURSOR_CONFIG.glowSize * 1.5,
            background: `radial-gradient(circle, ${colors.hoverRgba(0.2)} 0%, transparent 70%)`,
            opacity: 0.8,
        },
        click: {
            width: CURSOR_CONFIG.glowSize * 2.2,
            height: CURSOR_CONFIG.glowSize * 2.2,
            background: `radial-gradient(circle, ${colors.clickRgba(0.35)} 0%, ${colors.primaryRgba(0.15)} 50%, transparent 70%)`,
            opacity: 1,
        },
        link: {
            width: CURSOR_CONFIG.glowSize * 1.6,
            height: CURSOR_CONFIG.glowSize * 1.6,
            background: `radial-gradient(circle, ${colors.primaryRgba(0.18)} 0%, transparent 70%)`,
            opacity: 0.7,
        },
        text: {
            width: CURSOR_CONFIG.glowSize * 0.6,
            height: CURSOR_CONFIG.glowSize * 0.6,
            background: `radial-gradient(circle, ${colors.primaryRgba(0.08)} 0%, transparent 70%)`,
            opacity: 0.4,
        },
        grab: {
            width: CURSOR_CONFIG.glowSize * 1.2,
            height: CURSOR_CONFIG.glowSize * 1.2,
            background: `radial-gradient(circle, ${colors.grabRgba(0.18)} 0%, transparent 70%)`,
            opacity: 0.7,
        },
        grabbing: {
            width: CURSOR_CONFIG.glowSize,
            height: CURSOR_CONFIG.glowSize,
            background: `radial-gradient(circle, ${colors.grabRgba(0.25)} 0%, transparent 70%)`,
            opacity: 0.9,
        },
        hidden: {
            width: 0,
            height: 0,
            background: 'transparent',
            opacity: 0,
        },
    };
};

// Trail particle component (memoized for performance)
interface TrailParticle {
    id: number;
    x: number;
    y: number;
    timestamp: number;
}

const TrailDot = memo(({ particle, age, isDark }: { particle: TrailParticle; age: number; isDark: boolean }) => {
    const opacity = Math.max(0, 1 - age / 300); // Fade over 300ms
    const scale = Math.max(0, 1 - age / 400);
    const colors = getThemeColors(isDark);
    
    if (opacity <= 0) return null;
    
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                width: 4,
                height: 4,
                backgroundColor: colors.primaryRgba(0.6),
                boxShadow: `0 0 6px ${colors.primaryRgba(0.5)}`,
                left: particle.x,
                top: particle.y,
                transform: `translate(-50%, -50%) rotate(45deg) scale(${scale})`,
                opacity,
                willChange: 'transform, opacity',
            }}
        />
    );
});

TrailDot.displayName = 'TrailDot';

function AnimatedCursor({ enabled = true }: AnimatedCursorProps) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    
    const [cursorState, setCursorState] = useState<CursorState>('default');
    const [isTouch, setIsTouch] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [trail, setTrail] = useState<TrailParticle[]>([]);
    const [now, setNow] = useState(Date.now());
    
    const trailIdRef = useRef(0);
    const lastTrailPosRef = useRef({ x: 0, y: 0 });
    
    // Use the performant cursor position hook
    const { position, ringPosition, glowPosition, isVisible, velocity } = useCursorPosition({
        enabled: enabled && !isTouch && !prefersReducedMotion,
        ringSmoothing: 0.5,  // TIGHT following - barely noticeable delay
        glowSmoothing: 0.12, // Visible trailing for glow only
    });
    
    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    // Check for touch device
    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);
    
    // Detect cursor state based on what we're hovering
    useEffect(() => {
        if (!enabled || isTouch || prefersReducedMotion) return;
        
        const checkState = () => {
            const target = document.elementFromPoint(position.x, position.y);
            const newState = detectCursorState(target);
            setCursorState(newState);
        };
        
        checkState();
    }, [position.x, position.y, enabled, isTouch, prefersReducedMotion]);
    
    // Handle click state
    useEffect(() => {
        if (!enabled || isTouch || prefersReducedMotion) return;
        
        const handleMouseDown = () => setCursorState('click');
        const handleMouseUp = () => {
            const target = document.elementFromPoint(position.x, position.y);
            setCursorState(detectCursorState(target));
        };
        
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [enabled, isTouch, prefersReducedMotion, position.x, position.y]);
    
    // Trail particle generation (throttled)
    useEffect(() => {
        if (prefersReducedMotion || !isVisible) return;
        
        const dist = Math.sqrt(
            Math.pow(position.x - lastTrailPosRef.current.x, 2) +
            Math.pow(position.y - lastTrailPosRef.current.y, 2)
        );
        
        // Only add trail if moved enough distance
        if (dist > 15) {
            lastTrailPosRef.current = { x: position.x, y: position.y };
            const newParticle: TrailParticle = {
                id: trailIdRef.current++,
                x: position.x,
                y: position.y,
                timestamp: Date.now(),
            };
            setTrail(prev => [...prev.slice(-5), newParticle]);
        }
    }, [position.x, position.y, prefersReducedMotion, isVisible]);
    
    // Update timestamp for trail aging
    useEffect(() => {
        if (prefersReducedMotion || trail.length === 0) return;
        
        const interval = setInterval(() => {
            setNow(Date.now());
            // Clean up old particles
            setTrail(prev => prev.filter(p => Date.now() - p.timestamp < 300));
        }, 16); // ~60fps
        
        return () => clearInterval(interval);
    }, [prefersReducedMotion, trail.length]);
    
    // Hide default cursor
    useEffect(() => {
        if (!enabled || isTouch || prefersReducedMotion) return;
        
        // Add global cursor hide styles
        const style = document.createElement('style');
        style.id = 'animated-cursor-styles';
        style.textContent = `
            *, *::before, *::after {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.getElementById('animated-cursor-styles')?.remove();
        };
    }, [enabled, isTouch, prefersReducedMotion]);
    
    // Don't render on touch devices or when disabled
    if (!enabled || isTouch || prefersReducedMotion) return null;
    
    // Get theme-aware styles
    const dotStyles = getDotStyles(isDark);
    const ringStyles = getRingStyles(isDark);
    const glowStyles = getGlowStyles(isDark);
    const colors = getThemeColors(isDark);
    
    const dotStyle = dotStyles[cursorState];
    const ringStyle = ringStyles[cursorState];
    const glowStyle = glowStyles[cursorState];
    
    return (
        <div 
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {/* Trail particles */}
            {trail.map(particle => (
                <TrailDot 
                    key={particle.id} 
                    particle={particle} 
                    age={now - particle.timestamp}
                    isDark={isDark}
                />
            ))}
            
            {/* Glow effect - follows slowest (visual only) */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    ...glowStyle,
                    left: glowPosition.x,
                    top: glowPosition.y,
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.15s, height 0.15s, opacity 0.15s, background 0.15s',
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            
            {/* Outer targeting ring - diamond shape */}
            <div
                className="absolute border-solid pointer-events-none"
                style={{
                    ...ringStyle,
                    left: ringPosition.x,
                    top: ringPosition.y,
                    transition: 'width 0.1s, height 0.1s, border-color 0.1s, border-width 0.1s, opacity 0.1s',
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            
            {/* Crosshair arms - horizontal */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: CURSOR_CONFIG.crossLength,
                    height: 1,
                    backgroundColor: cursorState === 'hidden' ? 'transparent' : colors.primaryRgba(0.6),
                    boxShadow: `0 0 4px ${colors.primaryRgba(0.4)}`,
                    left: position.x - CURSOR_CONFIG.crossLength / 2 - 8,
                    top: position.y - 0.5,
                    opacity: cursorState === 'text' ? 0 : 0.8,
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: CURSOR_CONFIG.crossLength,
                    height: 1,
                    backgroundColor: cursorState === 'hidden' ? 'transparent' : colors.primaryRgba(0.6),
                    boxShadow: `0 0 4px ${colors.primaryRgba(0.4)}`,
                    left: position.x + 8,
                    top: position.y - 0.5,
                    opacity: cursorState === 'text' ? 0 : 0.8,
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            
            {/* Crosshair arms - vertical */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 1,
                    height: CURSOR_CONFIG.crossLength,
                    backgroundColor: cursorState === 'hidden' ? 'transparent' : colors.primaryRgba(0.6),
                    boxShadow: `0 0 4px ${colors.primaryRgba(0.4)}`,
                    left: position.x - 0.5,
                    top: position.y - CURSOR_CONFIG.crossLength / 2 - 8,
                    opacity: cursorState === 'text' ? 0 : 0.8,
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 1,
                    height: CURSOR_CONFIG.crossLength,
                    backgroundColor: cursorState === 'hidden' ? 'transparent' : colors.primaryRgba(0.6),
                    boxShadow: `0 0 4px ${colors.primaryRgba(0.4)}`,
                    left: position.x - 0.5,
                    top: position.y + 8,
                    opacity: cursorState === 'text' ? 0 : 0.8,
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            
            {/* Core diamond - INSTANT response, no delay */}
            <div
                className="absolute pointer-events-none"
                style={{
                    ...dotStyle,
                    left: position.x,
                    top: position.y,
                    transition: 'width 0.08s, height 0.08s, background-color 0.08s, box-shadow 0.08s, border-color 0.08s',
                    willChange: 'transform',
                    visibility: isVisible ? 'visible' : 'hidden',
                }}
            />
            
            {/* Center dot - tiny bright point */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 2,
                    height: 2,
                    backgroundColor: colors.primary,
                    boxShadow: `0 0 4px ${colors.primary}`,
                    left: position.x,
                    top: position.y,
                    transform: 'translate(-50%, -50%)',
                    opacity: isVisible && cursorState !== 'hidden' && cursorState !== 'text' ? 1 : 0,
                    willChange: 'transform',
                }}
            />
        </div>
    );
}

export default memo(AnimatedCursor);
