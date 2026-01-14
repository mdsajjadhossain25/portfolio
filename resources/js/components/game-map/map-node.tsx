/**
 * MapNode Component
 * 
 * An animated navigation node for the game map.
 * Features:
 * - Pulsing glow animation
 * - Hover label reveal
 * - Click energy burst effect
 * - Connection lines to other nodes
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
}

export function MapNode({ node, isActive = false, onNavigationStart, onHover }: MapNodeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);
    
    // Size mappings
    const sizes = {
        sm: { outer: 40, inner: 24, ring: 50 },
        md: { outer: 56, inner: 36, ring: 70 },
        lg: { outer: 80, inner: 50, ring: 100 },
    };
    
    const size = sizes[node.size];
    
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
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                }}
                transition={{
                    duration: 3,
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
                    scale: [1, 2, 1],
                    opacity: [0.2, 0, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.5,
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
                    opacity: isHovered ? 1 : 0.5,
                    scale: isHovered ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Main node circle */}
            <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                    width: size.outer,
                    height: size.outer,
                    background: `linear-gradient(135deg, ${node.color}20, ${node.color}40)`,
                    border: `2px solid ${node.color}`,
                    boxShadow: isHovered 
                        ? `0 0 30px ${node.glowColor}, 0 0 60px ${node.glowColor}, inset 0 0 20px ${node.glowColor}`
                        : `0 0 15px ${node.glowColor}`,
                }}
                animate={{
                    scale: isHovered ? 1.15 : 1,
                    borderWidth: isHovered ? '3px' : '2px',
                }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Inner circle */}
                <motion.div
                    className="rounded-full flex items-center justify-center"
                    style={{
                        width: size.inner,
                        height: size.inner,
                        background: `radial-gradient(circle at 30% 30%, ${node.color}60, ${node.color}20)`,
                        boxShadow: `inset 0 0 10px ${node.glowColor}`,
                    }}
                >
                    <span 
                        className="text-white font-bold"
                        style={{ 
                            fontSize: node.size === 'lg' ? '24px' : node.size === 'md' ? '18px' : '14px',
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
            
            {/* Hover label */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute left-1/2 whitespace-nowrap pointer-events-none"
                        style={{ top: size.outer / 2 + 20 }}
                        initial={{ opacity: 0, y: -10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Label background */}
                        <div 
                            className="relative px-4 py-2 rounded-lg backdrop-blur-md"
                            style={{
                                background: 'rgba(0, 0, 0, 0.8)',
                                border: `1px solid ${node.color}50`,
                                boxShadow: `0 0 20px ${node.glowColor}`,
                            }}
                        >
                            {/* Corner decorations */}
                            <div 
                                className="absolute top-0 left-0 w-2 h-2"
                                style={{ borderTop: `1px solid ${node.color}`, borderLeft: `1px solid ${node.color}` }}
                            />
                            <div 
                                className="absolute top-0 right-0 w-2 h-2"
                                style={{ borderTop: `1px solid ${node.color}`, borderRight: `1px solid ${node.color}` }}
                            />
                            <div 
                                className="absolute bottom-0 left-0 w-2 h-2"
                                style={{ borderBottom: `1px solid ${node.color}`, borderLeft: `1px solid ${node.color}` }}
                            />
                            <div 
                                className="absolute bottom-0 right-0 w-2 h-2"
                                style={{ borderBottom: `1px solid ${node.color}`, borderRight: `1px solid ${node.color}` }}
                            />
                            
                            <div className="text-center">
                                <div 
                                    className="font-bold text-sm tracking-wider font-mono"
                                    style={{ color: node.color }}
                                >
                                    {node.label}
                                </div>
                                <div className="text-white/50 text-xs mt-0.5">
                                    {node.sublabel}
                                </div>
                            </div>
                        </div>
                        
                        {/* Connector line */}
                        <div 
                            className="absolute left-1/2 -translate-x-1/2 -top-4 w-[1px] h-4"
                            style={{ background: `linear-gradient(to bottom, transparent, ${node.color})` }}
                        />
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
    );
}

export default MapNode;
