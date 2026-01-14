/**
 * GameMap Component
 * 
 * A fullscreen interactive sci-fi world map for navigation.
 * Features:
 * - Animated grid background
 * - Scanning line effects
 * - Floating particles with parallax
 * - Connection lines between nodes
 * - Cinematic zoom transitions
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { MapNode } from './map-node';
import { mapNodes, getNodeByHref, type MapNode as MapNodeType } from './map-config';

interface GameMapProps {
    className?: string;
    onNavigationStart?: (node: MapNodeType) => void;
}

// Generate random stars
function generateStars(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 3 + 2,
    }));
}

export function GameMap({ className = '', onNavigationStart }: GameMapProps) {
    const { url } = usePage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredNode, setHoveredNode] = useState<MapNodeType | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [targetNode, setTargetNode] = useState<MapNodeType | null>(null);
    
    // Current active node based on URL
    const activeNode = getNodeByHref(url);
    
    // Generate stars once
    const stars = useMemo(() => generateStars(100), []);
    
    // Mouse position for parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth spring animation for parallax
    const springConfig = { damping: 25, stiffness: 150 };
    const parallaxX = useSpring(mouseX, springConfig);
    const parallaxY = useSpring(mouseY, springConfig);
    
    // Transform for different layers
    const bgX = useTransform(parallaxX, [-0.5, 0.5], [20, -20]);
    const bgY = useTransform(parallaxY, [-0.5, 0.5], [20, -20]);
    const midX = useTransform(parallaxX, [-0.5, 0.5], [10, -10]);
    const midY = useTransform(parallaxY, [-0.5, 0.5], [10, -10]);
    
    // Track mouse for parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);
    
    // Handle navigation
    const handleNavigationStart = useCallback((node: MapNodeType) => {
        setIsNavigating(true);
        setTargetNode(node);
        onNavigationStart?.(node);
    }, [onNavigationStart]);
    
    // Draw connection lines
    const connectionLines = useMemo(() => {
        const lines: { from: MapNodeType; to: MapNodeType; id: string }[] = [];
        const drawn = new Set<string>();
        
        mapNodes.forEach(node => {
            node.connections.forEach(targetId => {
                const lineId = [node.id, targetId].sort().join('-');
                if (drawn.has(lineId)) return;
                drawn.add(lineId);
                
                const targetNode = mapNodes.find(n => n.id === targetId);
                if (targetNode) {
                    lines.push({ from: node, to: targetNode, id: lineId });
                }
            });
        });
        
        return lines;
    }, []);
    
    return (
        <div 
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden bg-black ${className}`}
        >
            {/* Deep space background layer */}
            <motion.div 
                className="absolute inset-0"
                style={{ x: bgX, y: bgY }}
            >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black" />
                
                {/* Stars layer */}
                {stars.map(star => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                        }}
                        animate={{
                            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>
            
            {/* Grid layer */}
            <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{ x: midX, y: midY }}
            >
                {/* Perspective grid */}
                <div 
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        transform: 'perspective(500px) rotateX(60deg)',
                        transformOrigin: 'center center',
                    }}
                />
                
                {/* Horizontal scan grid */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0, 245, 255, 1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 245, 255, 1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }}
                />
            </motion.div>
            
            {/* Scanning line effect */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.5), transparent)',
                    boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
                }}
                animate={{ y: ['0vh', '100vh'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Vertical scanning line */}
            <motion.div
                className="absolute top-0 bottom-0 w-[1px] pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, transparent, rgba(191, 0, 255, 0.3), transparent)',
                    boxShadow: '0 0 15px rgba(191, 0, 255, 0.3)',
                }}
                animate={{ x: ['0vw', '100vw'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />
            
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                    {connectionLines.map(line => (
                        <linearGradient
                            key={`gradient-${line.id}`}
                            id={`line-gradient-${line.id}`}
                            x1={`${line.from.position.x}%`}
                            y1={`${line.from.position.y}%`}
                            x2={`${line.to.position.x}%`}
                            y2={`${line.to.position.y}%`}
                        >
                            <stop offset="0%" stopColor={line.from.color} stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor={line.to.color} stopOpacity="0.3" />
                        </linearGradient>
                    ))}
                </defs>
                
                {connectionLines.map(line => {
                    const isHighlighted = 
                        hoveredNode?.id === line.from.id || 
                        hoveredNode?.id === line.to.id;
                    
                    return (
                        <motion.line
                            key={line.id}
                            x1={`${line.from.position.x}%`}
                            y1={`${line.from.position.y}%`}
                            x2={`${line.to.position.x}%`}
                            y2={`${line.to.position.y}%`}
                            stroke={`url(#line-gradient-${line.id})`}
                            strokeWidth={isHighlighted ? 2 : 1}
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                                pathLength: 1, 
                                opacity: isHighlighted ? 0.8 : 0.3,
                            }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                    );
                })}
                
                {/* Animated pulse along connections when hovered */}
                {hoveredNode && hoveredNode.connections.map(connId => {
                    const targetNode = mapNodes.find(n => n.id === connId);
                    if (!targetNode) return null;
                    
                    return (
                        <motion.circle
                            key={`pulse-${hoveredNode.id}-${connId}`}
                            r="3"
                            fill={hoveredNode.color}
                            initial={{ 
                                cx: `${hoveredNode.position.x}%`, 
                                cy: `${hoveredNode.position.y}%`,
                                opacity: 1,
                            }}
                            animate={{ 
                                cx: `${targetNode.position.x}%`, 
                                cy: `${targetNode.position.y}%`,
                                opacity: [1, 0.5, 0],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            style={{ filter: `drop-shadow(0 0 5px ${hoveredNode.color})` }}
                        />
                    );
                })}
            </svg>
            
            {/* Map nodes */}
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
                {mapNodes.map(node => (
                    <MapNode
                        key={node.id}
                        node={node}
                        isActive={activeNode?.id === node.id}
                        onNavigationStart={handleNavigationStart}
                        onHover={setHoveredNode}
                    />
                ))}
            </div>
            
            {/* Navigation transition overlay */}
            <AnimatePresence>
                {isNavigating && targetNode && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: 100 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Warp tunnel effect */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle at ${targetNode.position.x}% ${targetNode.position.y}%, ${targetNode.color}40, transparent 50%)`,
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 10 }}
                            transition={{ duration: 0.8, ease: 'easeIn' }}
                        />
                        
                        {/* Speed lines */}
                        {[...Array(20)].map((_, i) => {
                            const angle = (i / 20) * 360;
                            const radians = angle * Math.PI / 180;
                            return (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        left: `${targetNode.position.x}%`,
                                        top: `${targetNode.position.y}%`,
                                        width: '2px',
                                        height: '100px',
                                        background: `linear-gradient(to bottom, ${targetNode.color}, transparent)`,
                                        transformOrigin: 'top center',
                                        rotate: `${angle}deg`,
                                    }}
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{ scaleY: 10, opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* HUD overlay elements */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
                {/* Top left corner */}
                <div className="absolute top-4 left-4">
                    <motion.div 
                        className="text-cyan-400/50 text-xs font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div>SYSTEM: ONLINE</div>
                        <div className="text-cyan-400/30">MAP_NAVIGATION_v2.0</div>
                    </motion.div>
                </div>
                
                {/* Top right corner */}
                <div className="absolute top-4 right-4 text-right">
                    <motion.div 
                        className="text-purple-400/50 text-xs font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div>ZONES: {mapNodes.length}</div>
                        <motion.div 
                            className="text-green-400/50"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ALL SYSTEMS OPERATIONAL
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Bottom info panel */}
                <AnimatePresence>
                    {hoveredNode && (
                        <motion.div
                            className="absolute bottom-4 left-1/2 -translate-x-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div 
                                className="px-6 py-3 rounded-lg backdrop-blur-md text-center"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    border: `1px solid ${hoveredNode.color}50`,
                                    boxShadow: `0 0 30px ${hoveredNode.glowColor}`,
                                }}
                            >
                                <div className="text-white/70 text-sm max-w-md">
                                    {hoveredNode.description}
                                </div>
                                <div className="text-white/30 text-xs mt-2 font-mono">
                                    CLICK TO NAVIGATE • PRESS [SPACE] TO CONFIRM
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Corner decorations */}
                <svg className="absolute top-0 left-0 w-20 h-20 text-cyan-500/30">
                    <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute top-0 right-0 w-20 h-20 text-cyan-500/30">
                    <path d="M60 0 L80 0 L80 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-20 h-20 text-cyan-500/30">
                    <path d="M0 60 L0 80 L20 80" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-20 h-20 text-cyan-500/30">
                    <path d="M60 80 L80 80 L80 60" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>
        </div>
    );
}

export default GameMap;
