/**
 * GameTransition Component
 * 
 * Cinematic game-style page transitions.
 * Features:
 * - Warp speed tunnel effect
 * - Energy slash wipe
 * - Zoom into node effect
 * - HUD loading sequence
 */

import { ReactNode, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { getNodeByHref } from '../game-map/map-config';

export type GameTransitionType = 'warp' | 'slash' | 'zoom' | 'glitch' | 'portal';

interface GameTransitionProps {
    children: ReactNode;
    transitionType?: GameTransitionType;
    className?: string;
}

export function GameTransition({ 
    children, 
    transitionType = 'warp',
    className = '' 
}: GameTransitionProps) {
    const { url } = usePage();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
    const prevUrl = useRef(url);
    const controls = useAnimation();
    
    const currentNode = getNodeByHref(url);
    const nodeColor = currentNode?.color || '#00f5ff';
    const nodeGlow = currentNode?.glowColor || 'rgba(0, 245, 255, 0.6)';
    
    // Check for reduced motion
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    // Detect URL changes
    useEffect(() => {
        if (prevUrl.current !== url) {
            setTransitionPhase('enter');
            setIsTransitioning(true);
            
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setTransitionPhase('idle');
            }, 1200);
            
            prevUrl.current = url;
            return () => clearTimeout(timer);
        }
    }, [url]);
    
    // Simple transition for reduced motion
    if (prefersReducedMotion) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={className}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }
    
    return (
        <>
            {/* Transition overlays */}
            <AnimatePresence>
                {isTransitioning && (
                    <>
                        {/* Warp transition */}
                        {transitionType === 'warp' && (
                            <motion.div
                                className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Warp tunnel background */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{
                                        background: `radial-gradient(ellipse at center, transparent 0%, ${nodeColor}20 50%, black 100%)`,
                                    }}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                                />
                                
                                {/* Speed lines */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {[...Array(30)].map((_, i) => {
                                        const angle = (i / 30) * 360;
                                        return (
                                            <motion.div
                                                key={i}
                                                className="absolute origin-center"
                                                style={{
                                                    width: '2px',
                                                    height: '30%',
                                                    background: `linear-gradient(to top, ${nodeColor}, transparent)`,
                                                    rotate: `${angle}deg`,
                                                    transformOrigin: '50% 100%',
                                                }}
                                                initial={{ scaleY: 0, opacity: 0 }}
                                                animate={{ 
                                                    scaleY: [0, 1, 3],
                                                    opacity: [0, 1, 0],
                                                }}
                                                transition={{ 
                                                    duration: 0.8,
                                                    delay: Math.random() * 0.2,
                                                    ease: 'easeOut',
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                
                                {/* Central flash */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                               w-8 h-8 rounded-full"
                                    style={{
                                        backgroundColor: nodeColor,
                                        boxShadow: `0 0 60px ${nodeGlow}, 0 0 120px ${nodeGlow}`,
                                    }}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: [0, 1, 30], opacity: [1, 1, 0] }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </motion.div>
                        )}
                        
                        {/* Slash transition */}
                        {transitionType === 'slash' && (
                            <motion.div
                                className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Multiple slash lines */}
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(${45 + i * 15}deg, 
                                                transparent 0%, 
                                                transparent ${48 - i}%, 
                                                ${nodeColor} 50%, 
                                                transparent ${52 + i}%, 
                                                transparent 100%)`,
                                        }}
                                        initial={{ x: '-100%', opacity: 0 }}
                                        animate={{ 
                                            x: ['200%'],
                                            opacity: [0, 1, 1, 0],
                                        }}
                                        transition={{ 
                                            duration: 0.5,
                                            delay: i * 0.1,
                                            ease: 'easeOut',
                                        }}
                                    />
                                ))}
                                
                                {/* Flash overlay */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ backgroundColor: nodeColor }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                />
                            </motion.div>
                        )}
                        
                        {/* Portal transition */}
                        {transitionType === 'portal' && (
                            <motion.div
                                className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Portal rings */}
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute rounded-full"
                                        style={{
                                            width: 100 + i * 80,
                                            height: 100 + i * 80,
                                            border: `2px solid ${nodeColor}`,
                                            boxShadow: `0 0 20px ${nodeGlow}, inset 0 0 20px ${nodeGlow}`,
                                        }}
                                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                                        animate={{ 
                                            scale: [0, 1, 2],
                                            opacity: [0, 1, 0],
                                            rotate: [0, 90 * (i % 2 ? 1 : -1)],
                                        }}
                                        transition={{ 
                                            duration: 1,
                                            delay: i * 0.1,
                                            ease: 'easeOut',
                                        }}
                                    />
                                ))}
                                
                                {/* Center portal */}
                                <motion.div
                                    className="absolute rounded-full"
                                    style={{
                                        width: 60,
                                        height: 60,
                                        background: `radial-gradient(circle, ${nodeColor} 0%, transparent 70%)`,
                                        boxShadow: `0 0 60px ${nodeGlow}`,
                                    }}
                                    initial={{ scale: 1, opacity: 1 }}
                                    animate={{ scale: [1, 50], opacity: [1, 1, 0] }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeIn' }}
                                />
                            </motion.div>
                        )}
                        
                        {/* Glitch transition */}
                        {transitionType === 'glitch' && (
                            <motion.div
                                className="fixed inset-0 z-[100] pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Glitch slices */}
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute left-0 right-0"
                                        style={{
                                            top: `${i * 10}%`,
                                            height: '10%',
                                            backgroundColor: i % 2 === 0 ? nodeColor : 'transparent',
                                            mixBlendMode: 'screen',
                                        }}
                                        initial={{ x: 0, opacity: 0 }}
                                        animate={{ 
                                            x: [0, (i % 2 ? 50 : -50), 0, (i % 2 ? -30 : 30), 0],
                                            opacity: [0, 1, 1, 1, 0],
                                        }}
                                        transition={{ 
                                            duration: 0.6,
                                            times: [0, 0.2, 0.5, 0.8, 1],
                                            ease: 'easeInOut',
                                        }}
                                    />
                                ))}
                                
                                {/* RGB split effect */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff000030, transparent 33%, #00ff0030 33%, transparent 66%, #0000ff30 66%)',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0, 1, 0] }}
                                    transition={{ duration: 0.4, times: [0, 0.25, 0.5, 0.75, 1] }}
                                />
                            </motion.div>
                        )}
                        
                        {/* Zoom transition */}
                        {transitionType === 'zoom' && (
                            <motion.div
                                className="fixed inset-0 z-[100] pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Zoom blur effect */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{
                                        background: `radial-gradient(circle at center, transparent 0%, ${nodeColor}40 50%, black 100%)`,
                                    }}
                                    initial={{ scale: 1, opacity: 0 }}
                                    animate={{ scale: 3, opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, ease: 'easeIn' }}
                                />
                                
                                {/* Motion blur lines */}
                                <motion.div
                                    className="absolute inset-0"
                                    style={{
                                        background: `repeating-linear-gradient(
                                            90deg,
                                            transparent,
                                            transparent 10px,
                                            ${nodeColor}10 10px,
                                            ${nodeColor}10 20px
                                        )`,
                                    }}
                                    initial={{ scaleX: 1, opacity: 0 }}
                                    animate={{ scaleX: 5, opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                            </motion.div>
                        )}
                        
                        {/* HUD loading overlay */}
                        <motion.div
                            className="fixed inset-0 z-[99] pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.2, times: [0, 0.1, 0.8, 1] }}
                        >
                            {/* Loading text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <motion.div 
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                    transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
                                >
                                    <div 
                                        className="text-sm font-mono tracking-[0.3em] mb-2"
                                        style={{ color: nodeColor }}
                                    >
                                        {currentNode?.label || 'LOADING'}
                                    </div>
                                    
                                    {/* Loading bar */}
                                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: nodeColor }}
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        />
                                    </div>
                                    
                                    <div className="text-white/30 text-xs font-mono mt-2">
                                        INITIALIZING ZONE...
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Page content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={url}
                    className={className}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                        duration: 0.4,
                        delay: isTransitioning ? 0.6 : 0,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

export default GameTransition;
