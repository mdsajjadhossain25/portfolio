/**
 * useCursorPosition Hook
 * 
 * A performant cursor position tracker using requestAnimationFrame.
 * Provides raw mouse position for instant response and smoothed
 * position for trailing effects.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface CursorPosition {
    x: number;
    y: number;
}

interface UseCursorPositionOptions {
    /** Enable the cursor tracking */
    enabled?: boolean;
    /** Smoothing factor for the outer ring (0 = no smoothing, 1 = max smoothing) */
    ringSmoothing?: number;
    /** Smoothing factor for the glow effect */
    glowSmoothing?: number;
}

interface UseCursorPositionReturn {
    /** Raw mouse position (for core cursor - instant response) */
    position: CursorPosition;
    /** Smoothed position for ring (slight delay) */
    ringPosition: CursorPosition;
    /** Smoothed position for glow (more delay) */
    glowPosition: CursorPosition;
    /** Whether the cursor is visible (mouse is in viewport) */
    isVisible: boolean;
    /** Whether the mouse is currently moving */
    isMoving: boolean;
    /** Current velocity of cursor movement */
    velocity: CursorPosition;
}

/**
 * Linear interpolation
 */
function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
}

/**
 * Clamp a value to max distance from target
 */
function clampDistance(
    current: CursorPosition, 
    target: CursorPosition, 
    maxDistance: number
): CursorPosition {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= maxDistance) {
        return current;
    }
    
    // Clamp to max distance from target
    const ratio = (distance - maxDistance) / distance;
    return {
        x: current.x + dx * ratio,
        y: current.y + dy * ratio,
    };
}

/**
 * Hook for tracking cursor position with different smoothing levels
 */
export function useCursorPosition({
    enabled = true,
    ringSmoothing = 0.5,  // HIGH value = tight following (0.45-0.6 recommended)
    glowSmoothing = 0.12, // Lower = more trailing for visual effect
}: UseCursorPositionOptions = {}): UseCursorPositionReturn {
    // Raw position (instant)
    const positionRef = useRef<CursorPosition>({ x: 0, y: 0 });
    // Smoothed positions
    const ringPositionRef = useRef<CursorPosition>({ x: 0, y: 0 });
    const glowPositionRef = useRef<CursorPosition>({ x: 0, y: 0 });
    // Velocity tracking
    const velocityRef = useRef<CursorPosition>({ x: 0, y: 0 });
    const lastPositionRef = useRef<CursorPosition>({ x: 0, y: 0 });
    
    // FIX: Store smoothing values in refs to avoid stale closures in RAF loop
    const ringSmoothingRef = useRef(ringSmoothing);
    const glowSmoothingRef = useRef(glowSmoothing);
    
    // Update refs when props change
    ringSmoothingRef.current = ringSmoothing;
    glowSmoothingRef.current = glowSmoothing;
    
    // State for React re-renders (throttled)
    const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [ringPosition, setRingPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [glowPosition, setGlowPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState<CursorPosition>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    
    // Animation frame reference
    const rafRef = useRef<number | null>(null);
    const isMovingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Use ref to track visibility without causing callback recreation
    // FIX: Prevents unnecessary effect re-runs when isVisible changes
    const isVisibleRef = useRef(false);
    
    // Mouse move handler - updates raw position immediately
    // FIX: Removed isVisible from dependency array to prevent RAF loop restart on visibility change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Update raw position instantly
        positionRef.current = { x: e.clientX, y: e.clientY };
        
        // Calculate velocity
        velocityRef.current = {
            x: e.clientX - lastPositionRef.current.x,
            y: e.clientY - lastPositionRef.current.y,
        };
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        
        // Set moving state
        setIsMoving(true);
        if (isMovingTimeoutRef.current) {
            clearTimeout(isMovingTimeoutRef.current);
        }
        isMovingTimeoutRef.current = setTimeout(() => {
            setIsMoving(false);
        }, 100);
        
        // FIX: Use ref to check visibility to avoid dependency on isVisible state
        if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            setIsVisible(true);
        }
    }, []); // No dependencies - stable callback
    
    // RAF loop for smooth interpolation of trailing elements
    // FIX: Use refs for smoothing values to prevent stale closures and make callback stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const animate = useCallback(() => {
        // Ring: tight follow with distance clamping (max 16px behind)
        let newRingPos = {
            x: lerp(ringPositionRef.current.x, positionRef.current.x, ringSmoothingRef.current),
            y: lerp(ringPositionRef.current.y, positionRef.current.y, ringSmoothingRef.current),
        };
        // Clamp ring to never be more than 16px from cursor
        newRingPos = clampDistance(newRingPos, positionRef.current, 16);
        ringPositionRef.current = newRingPos;
        
        // Glow: slower trailing effect (allowed more distance)
        let newGlowPos = {
            x: lerp(glowPositionRef.current.x, positionRef.current.x, glowSmoothingRef.current),
            y: lerp(glowPositionRef.current.y, positionRef.current.y, glowSmoothingRef.current),
        };
        // Clamp glow to max 40px for trailing effect
        newGlowPos = clampDistance(newGlowPos, positionRef.current, 40);
        glowPositionRef.current = newGlowPos;
        
        // Update state (this triggers re-render)
        setPosition({ ...positionRef.current });
        setRingPosition({ ...ringPositionRef.current });
        setGlowPosition({ ...glowPositionRef.current });
        setVelocity({ ...velocityRef.current });
        
        // Continue loop
        rafRef.current = requestAnimationFrame(animate);
    }, []); // No dependencies - uses refs for all values
    
    // Mouse visibility handlers
    // FIX: Update both ref and state for visibility tracking
    const handleMouseEnter = useCallback(() => {
        isVisibleRef.current = true;
        setIsVisible(true);
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        isVisibleRef.current = false;
        setIsVisible(false);
    }, []);
    
    // Setup and cleanup
    // FIX: Stable callbacks mean this effect only re-runs when `enabled` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!enabled) return;
        
        // Start RAF loop
        rafRef.current = requestAnimationFrame(animate);
        
        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            // Cancel RAF
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            
            // Clear timeout
            if (isMovingTimeoutRef.current) {
                clearTimeout(isMovingTimeoutRef.current);
            }
            
            // Remove event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enabled]); // FIX: Only depend on `enabled` - all callbacks are now stable
    
    return {
        position,
        ringPosition,
        glowPosition,
        isVisible,
        isMoving,
        velocity,
    };
}

export default useCursorPosition;
