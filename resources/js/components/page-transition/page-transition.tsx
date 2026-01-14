/**
 * PageTransition Component
 * 
 * Wraps page content with cinematic transition effects.
 * Uses Framer Motion's AnimatePresence for enter/exit animations.
 * Includes an optional overlay transition effect.
 */

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import {
    TransitionType,
    getTransitionVariants,
    overlayVariants,
    fadeScaleVariants,
} from '@/animations/transitions';

interface PageTransitionProps {
    children: ReactNode;
    /** Type of transition animation */
    transitionType?: TransitionType;
    /** Whether to show the overlay sweep effect */
    showOverlay?: boolean;
    /** Custom class name for the wrapper */
    className?: string;
}

export default function PageTransition({
    children,
    transitionType = 'energyWave',
    showOverlay = true,
    className = '',
}: PageTransitionProps) {
    const { url } = usePage();
    const variants = getTransitionVariants(transitionType);
    
    // Track if it's the first render to skip initial animation
    const [isFirstRender, setIsFirstRender] = useState(true);
    
    useEffect(() => {
        // After first render, enable animations
        const timer = setTimeout(() => setIsFirstRender(false), 100);
        return () => clearTimeout(timer);
    }, []);
    
    // Check for reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    // Use simpler animation if reduced motion is preferred
    const activeVariants = prefersReducedMotion ? fadeScaleVariants : variants;
    
    return (
        <>
            {/* Overlay transition effect */}
            {showOverlay && !prefersReducedMotion && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`overlay-${url}`}
                        className="fixed inset-0 z-50 pointer-events-none"
                        initial="initial"
                        animate="animate"
                        exit="initial"
                    >
                        {/* Primary overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                            variants={overlayVariants}
                        />
                        {/* Secondary overlay with delay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600"
                            variants={overlayVariants}
                            style={{ originX: 1 }}
                            transition={{
                                ...overlayVariants.animate?.transition,
                                delay: 0.1,
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
            
            {/* Page content */}
            <AnimatePresence mode="wait" initial={!isFirstRender}>
                <motion.div
                    key={url}
                    className={`min-h-screen ${className}`}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={activeVariants}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
}
