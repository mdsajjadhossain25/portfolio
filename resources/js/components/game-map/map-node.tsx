/**
 * MapNode Component
 * 
 * An animated navigation node for the game map.
 * Features:
 * - Always-visible labels for clarity
 * - Pulsing glow animation
 * - Hover enhancement effects
 * - Click energy burst effect
 * - Idle floating animation
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import type { MapNode as MapNodeType } from './map-config';

interface MapNodeProps {
    node: MapNodeType;
    isActive?: boolean;
    onNavigationStart?: (node: MapNodeType) => void;
    onHover?: (node: MapNodeType | null) => void;
    isMobile?: boolean;
}

export function MapNode({ node, isActive = false, onNavigationStart, onHover, isMobile = false }: MapNodeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);
    
    // Size mappings - slightly larger for better visibility
    const sizes = {
        sm: { outer: 44, inner: 28, ring: 56 },
        md: { outer: 56, inner: 36, ring: 72 },
        lg: { outer: 72, inner: 46, ring: 92 },
    };
    
    // Mobile sizes are slightly smaller
    const mobileSizes = {
        sm: { outer: 36, inner: 22, ring: 46 },
        md: { outer: 44, inner: 28, ring: 56 },
        lg: { outer: 56, inner: 36, ring: 72 },
    };
    
    const size = isMobile ? mobileSizes[node.size] : sizes[node.size];
    
    const handleClick = useCallback(() => {
        if (isActive) return;
        
        setIsClicked(true);
        onNavigationStart?.(node);
        
        // Delay navigation to allow animation to play
        setTimeout(() => {
            router.visit(node.href);
        }, 800);
    }, [node, isActive, onNavigationStart]);
    
    const handleHoverStart = useCallback(() => {
        setIsHovered(true);
        onHover?.(node);
    }, [node, onHover]);
    
    const handleHoverEnd = useCallback(() => {
        setIsHovered(false);
        onHover?.(null);
    }, [onHover]);
    
    return (
        <motion.div
            ref={nodeRef}
            className="absolute cursor-pointer"
            style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onClick={handleClick}
        >
            {/* Idle floating animation wrapper */}
            <motion.div
                animate={{
                    y: [0, -4, 0],
                }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Outer pulse ring */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: size.ring,
                        height: size.ring,
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                        border: `1px solid ${node.color}`,
                        opacity: 0.3,
                    }}
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                
                {/* Secondary pulse ring */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: size.ring,
                        height: size.ring,
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                        border: `1px solid ${node.color}`,
                        opacity: 0.2,
                    }}
                    animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.2, 0, 0.2],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.25,
                    }}
                />
                
                {/* Click energy burst */}
                <AnimatePresence>
                    {isClicked && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        width: 4,
                                        height: 4,
                                        backgroundColor: node.color,
                                        left: '50%',
                                        top: '50%',
                                        boxShadow: `0 0 10px ${node.glowColor}`,
                                    }}
                                    initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 1 }}
                                    animate={{
                                        x: `calc(-50% + ${Math.cos(i * 45 * Math.PI / 180) * 100}px)`,
                                        y: `calc(-50% + ${Math.sin(i * 45 * Math.PI / 180) * 100}px)`,
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                        ))}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: size.ring * 2,
                                height: size.ring * 2,
                                left: '50%',
                                top: '50%',
                                border: `2px solid ${node.color}`,
                                boxShadow: `0 0 30px ${node.glowColor}, inset 0 0 30px ${node.glowColor}`,
                            }}
                            initial={{ x: '-50%', y: '-50%', scale: 0.5, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </>
                )}
            </AnimatePresence>
            
            {/* Outer glow ring */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: size.outer,
                    height: size.outer,
                    left: '50%',
                    top: '50%',
                    x: '-50%',
                    y: '-50%',
                    background: `radial-gradient(circle, ${node.glowColor} 0%, transparent 70%)`,
                }}
                animate={{
                    opacity: isHovered ? 1 : 0.6,
                    scale: isHovered ? 1.4 : 1,
                }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Main node circle */}
            <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                    width: size.outer,
                    height: size.outer,
                    background: `linear-gradient(135deg, ${node.color}30, ${node.color}50)`,
                    border: `2px solid ${node.color}`,
                    boxShadow: isHovered 
                        ? `0 0 30px ${node.glowColor}, 0 0 60px ${node.glowColor}, inset 0 0 20px ${node.glowColor}`
                        : `0 0 20px ${node.glowColor}, inset 0 0 10px ${node.glowColor}`,
                }}
                animate={{
                    scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Inner circle with icon */}
                <motion.div
                    className="rounded-full flex items-center justify-center"
                    style={{
                        width: size.inner,
                        height: size.inner,
                        background: `radial-gradient(circle at 30% 30%, ${node.color}70, ${node.color}30)`,
                        boxShadow: `inset 0 0 10px ${node.glowColor}`,
                    }}
                >
                    <span 
                        className="text-white font-bold"
                        style={{ 
                            fontSize: isMobile 
                                ? (node.size === 'lg' ? '18px' : node.size === 'md' ? '14px' : '12px')
                                : (node.size === 'lg' ? '22px' : node.size === 'md' ? '16px' : '14px'),
                            textShadow: `0 0 10px ${node.color}`,
                        }}
                    >
                        {node.icon}
                    </span>
                </motion.div>
                
                {/* Active indicator */}
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `2px solid ${node.color}` }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
            </motion.div>
            
            {/* ALWAYS VISIBLE LABEL - Below the node */}
            <motion.div
                className="absolute left-1/2 pointer-events-none"
                style={{ 
                    top: size.outer / 2 + (isMobile ? 8 : 12),
                    transform: 'translateX(-50%)',
                }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                {/* Label with glow outline for readability */}
                <div className="text-center">
                    <motion.div 
                        className={`font-bold tracking-wide font-mono whitespace-nowrap ${isMobile ? 'text-[10px]' : 'text-xs'}`}
                        style={{ 
                            color: node.color,
                            textShadow: `
                                0 0 8px ${node.glowColor},
                                0 0 16px ${node.glowColor},
                                0 1px 2px rgba(0,0,0,0.9),
                                0 0 4px rgba(0,0,0,1)
                            `,
                        }}
                        animate={{
                            textShadow: isHovered 
                                ? `0 0 12px ${node.glowColor}, 0 0 24px ${node.glowColor}, 0 1px 2px rgba(0,0,0,0.9)`
                                : `0 0 8px ${node.glowColor}, 0 0 16px ${node.glowColor}, 0 1px 2px rgba(0,0,0,0.9)`,
                        }}
                    >
                        {node.label}
                    </motion.div>
                    {/* Sublabel - hidden on mobile for cleaner look */}
                    {!isMobile && (
                        <motion.div 
                            className="text-[9px] text-white/50 font-mono mt-0.5 tracking-wider uppercase"
                            style={{
                                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                            }}
                            animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                        >
                            {node.sublabel}
                        </motion.div>
                    )}
                </div>
                
                {/* Connector line from node to label */}
                <div 
                    className="absolute left-1/2 -translate-x-1/2 -top-2 w-[1px] h-2"
                    style={{ 
                        background: `linear-gradient(to bottom, ${node.color}60, ${node.color}20)`,
                    }}
                />
            </motion.div>

            {/* Enhanced hover tooltip (additional info) */}
            <AnimatePresence>
                {isHovered && !isMobile && (
                    <motion.div
                        className="absolute left-1/2 whitespace-nowrap pointer-events-none z-10"
                        style={{ top: size.outer / 2 + 55 }}
                        initial={{ opacity: 0, y: -5, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div 
                            className="relative px-3 py-1.5 rounded backdrop-blur-md text-center"
                            style={{
                                background: 'rgba(0, 0, 0, 0.85)',
                                border: `1px solid ${node.color}40`,
                                boxShadow: `0 0 15px ${node.glowColor}40`,
                            }}
                        >
                            <div className="text-white/70 text-[10px] max-w-[180px] text-center">
                                {node.description}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Status indicator */}
            {node.status === 'new' && (
                <motion.div
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500 text-black"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    NEW
                </motion.div>
            )}
            </motion.div>
        </motion.div>
    );
}

export default MapNode;
