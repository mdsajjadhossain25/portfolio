/**
 * Home Page - Game World Map
 * 
 * A fullscreen interactive sci-fi world map that serves as the main navigation hub.
 * Features:
 * - Fullscreen animated background
 * - Interactive navigation nodes
 * - Parallax depth effects
 * - HUD overlay elements
 * - Cinematic transitions to other pages
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Head, router } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { MapNode } from '@/components/game-map/map-node';
import { mapNodes, type MapNode as MapNodeType } from '@/components/game-map/map-config';

// Generate stars for the background
function generateStars(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 2,
    }));
}

// Generate floating particles
function generateParticles(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: ['#00f5ff', '#a78bfa', '#f472b6', '#4ade80'][Math.floor(Math.random() * 4)],
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
    }));
}

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredNode, setHoveredNode] = useState<MapNodeType | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [targetNode, setTargetNode] = useState<MapNodeType | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const [systemTime, setSystemTime] = useState('');
    
    // Generate static elements once
    const [stars] = useState(() => generateStars(150));
    const [particles] = useState(() => generateParticles(20));
    
    // Mouse parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 30, stiffness: 100 };
    const parallaxX = useSpring(mouseX, springConfig);
    const parallaxY = useSpring(mouseY, springConfig);
    
    // Parallax transforms for different layers
    const bgX = useTransform(parallaxX, [-0.5, 0.5], [30, -30]);
    const bgY = useTransform(parallaxY, [-0.5, 0.5], [30, -30]);
    const midX = useTransform(parallaxX, [-0.5, 0.5], [15, -15]);
    const midY = useTransform(parallaxY, [-0.5, 0.5], [15, -15]);
    const fgX = useTransform(parallaxX, [-0.5, 0.5], [5, -5]);
    const fgY = useTransform(parallaxY, [-0.5, 0.5], [5, -5]);
    
    // Track mouse movement
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
    
    // Update system time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setSystemTime(now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    
    // Hide intro after delay
    useEffect(() => {
        const timer = setTimeout(() => setShowIntro(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    
    // Handle navigation
    const handleNavigationStart = useCallback((node: MapNodeType) => {
        setIsNavigating(true);
        setTargetNode(node);
    }, []);
    
    // Connection lines data
    const connectionLines = mapNodes.flatMap(node => 
        node.connections.map(targetId => {
            const target = mapNodes.find(n => n.id === targetId);
            if (!target || node.id > targetId) return null; // Avoid duplicates
            return { from: node, to: target, id: `${node.id}-${targetId}` };
        }).filter(Boolean)
    ) as { from: MapNodeType; to: MapNodeType; id: string }[];
    
    return (
        <PortfolioLayout 
            isMapPage={true} 
            showFooter={false} 
            showParticles={false}
            transitionType="portal"
        >
            <Head title="AI Command Center - Navigation Hub" />
            
            <div 
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden bg-black"
            >
                {/* Intro overlay */}
                <AnimatePresence>
                    {showIntro && (
                        <motion.div
                            className="absolute inset-0 z-[60] flex items-center justify-center bg-black"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="text-cyan-400 text-xs font-mono tracking-[0.5em] mb-4"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    INITIALIZING AI SYSTEMS
                                </motion.div>
                                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Deep space background layer */}
                <motion.div 
                    className="absolute inset-[-50px]"
                    style={{ x: bgX, y: bgY }}
                >
                    {/* Nebula gradients */}
                    <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent" 
                         style={{ transform: 'translate(20%, -10%)' }} />
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent" 
                         style={{ transform: 'translate(-30%, 30%)' }} />
                    <div className="absolute inset-0 bg-gradient-radial from-pink-900/15 via-transparent to-transparent" 
                         style={{ transform: 'translate(40%, 50%)' }} />
                    
                    {/* Stars */}
                    {stars.map(star => (
                        <motion.div
                            key={star.id}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: star.size,
                                height: star.size,
                            }}
                            animate={{
                                opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: star.duration,
                                delay: star.delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </motion.div>
                
                {/* Grid layers with parallax */}
                <motion.div 
                    className="absolute inset-[-50px] pointer-events-none"
                    style={{ x: midX, y: midY }}
                >
                    {/* 3D perspective grid (floor) */}
                    <div 
                        className="absolute bottom-0 left-[-20%] right-[-20%] h-[60%] opacity-[0.06]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0, 245, 255, 1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 245, 255, 1) 1px, transparent 1px)
                            `,
                            backgroundSize: '80px 80px',
                            transform: 'perspective(400px) rotateX(70deg)',
                            transformOrigin: 'bottom center',
                        }}
                    />
                    
                    {/* Vertical grid overlay */}
                    <div 
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0, 245, 255, 1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 245, 255, 1) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                        }}
                    />
                </motion.div>
                
                {/* Floating particles */}
                <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ x: fgX, y: fgY }}
                >
                    {particles.map(particle => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.color,
                                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                                duration: particle.duration,
                                delay: particle.delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </motion.div>
                
                {/* Scanning effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Horizontal scan line */}
                    <motion.div
                        className="absolute left-0 right-0 h-[2px]"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.4), transparent)',
                            boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
                        }}
                        animate={{ y: ['0vh', '100vh'] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Vertical scan line */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-[1px]"
                        style={{
                            background: 'linear-gradient(180deg, transparent, rgba(191, 0, 255, 0.3), transparent)',
                            boxShadow: '0 0 15px rgba(191, 0, 255, 0.3)',
                        }}
                        animate={{ x: ['0vw', '100vw'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                
                {/* Radial vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_60%,rgba(0,0,0,0.8)_100%)]" />
                
                {/* Connection lines SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <defs>
                        {connectionLines.map(line => (
                            <linearGradient
                                key={`grad-${line.id}`}
                                id={`line-grad-${line.id}`}
                                x1={`${line.from.position.x}%`}
                                y1={`${line.from.position.y}%`}
                                x2={`${line.to.position.x}%`}
                                y2={`${line.to.position.y}%`}
                            >
                                <stop offset="0%" stopColor={line.from.color} stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
                                <stop offset="100%" stopColor={line.to.color} stopOpacity="0.4" />
                            </linearGradient>
                        ))}
                    </defs>
                    
                    {/* Connection lines */}
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
                                stroke={`url(#line-grad-${line.id})`}
                                strokeWidth={isHighlighted ? 2 : 1}
                                strokeDasharray="8,8"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: 1, 
                                    opacity: isHighlighted ? 0.9 : 0.4,
                                    strokeWidth: isHighlighted ? 2 : 1,
                                }}
                                transition={{ duration: 2, ease: 'easeOut' }}
                            />
                        );
                    })}
                    
                    {/* Animated pulses along connections when hovered */}
                    <AnimatePresence>
                        {hoveredNode && hoveredNode.connections.map(connId => {
                            const targetNode = mapNodes.find(n => n.id === connId);
                            if (!targetNode) return null;
                            
                            return (
                                <motion.circle
                                    key={`pulse-${hoveredNode.id}-${connId}`}
                                    r="4"
                                    fill={hoveredNode.color}
                                    initial={{ 
                                        cx: `${hoveredNode.position.x}%`, 
                                        cy: `${hoveredNode.position.y}%`,
                                        opacity: 1,
                                    }}
                                    animate={{ 
                                        cx: `${targetNode.position.x}%`, 
                                        cy: `${targetNode.position.y}%`,
                                        opacity: [1, 0.6, 0],
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    style={{ filter: `drop-shadow(0 0 8px ${hoveredNode.color})` }}
                                />
                            );
                        })}
                    </AnimatePresence>
                </svg>
                
                {/* Navigation nodes */}
                <div className="absolute inset-0" style={{ zIndex: 10 }}>
                    {mapNodes.map((node, index) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                delay: showIntro ? 2.5 + index * 0.15 : index * 0.1,
                                duration: 0.5,
                                type: 'spring',
                                stiffness: 100,
                            }}
                        >
                            <MapNode
                                node={node}
                                isActive={node.id === 'home'}
                                onNavigationStart={handleNavigationStart}
                                onHover={setHoveredNode}
                            />
                        </motion.div>
                    ))}
                </div>
                
                {/* Title and branding - TOP CENTER */}
                <motion.div
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-[15]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredNode ? 0.3 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: showIntro ? 2.8 : 0.3, duration: 0.6 }}
                        className="space-y-2"
                    >
                        {/* Primary Name - COMMANDER identity */}
                        <motion.h1 
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ 
                                delay: showIntro ? 2.9 : 0.4, 
                                duration: 0.8, 
                                ease: [0.22, 1, 0.36, 1] 
                            }}
                        >
                            <span 
                                className="text-white"
                                style={{
                                    textShadow: '0 0 30px rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 255, 255, 0.1)',
                                }}
                            >
                                Md Sajjad Hossain
                            </span>
                        </motion.h1>

                        {/* Accent line under name */}
                        <motion.div
                            className="flex items-center justify-center gap-2 py-2"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ 
                                delay: showIntro ? 3.1 : 0.6, 
                                duration: 0.6, 
                                ease: [0.22, 1, 0.36, 1] 
                            }}
                        >
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                        </motion.div>

                        {/* Secondary Role */}
                        <motion.p 
                            className="text-sm sm:text-base md:text-lg font-medium tracking-wide"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                delay: showIntro ? 3.2 : 0.7, 
                                duration: 0.6, 
                                ease: [0.22, 1, 0.36, 1] 
                            }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                                AI Engineer
                            </span>
                            <span className="text-white/40 mx-2">—</span>
                            <span className="text-white/60">
                                Computer Vision & Intelligent Systems
                            </span>
                        </motion.p>

                        {/* Company tag */}
                        <motion.p
                            className="text-cyan-400/50 text-xs font-mono mt-1 tracking-wider uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: showIntro ? 3.4 : 0.9, duration: 0.5 }}
                        >
                            Deep Mind Labs Ltd.
                        </motion.p>
                    </motion.div>
                </motion.div>
                
                {/* HUD overlay elements */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                    {/* Top left - System status */}
                    <motion.div 
                        className="absolute top-6 left-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showIntro ? 3 : 0.5 }}
                    >
                        <div className="space-y-1 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <motion.span 
                                    className="w-2 h-2 rounded-full bg-green-400"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <span className="text-green-400/70">NEURAL NETWORK ONLINE</span>
                            </div>
                            <div className="text-cyan-400/50">CV_ENGINE_v2.0</div>
                            <div className="text-white/30">{systemTime}</div>
                        </div>
                    </motion.div>
                    
                    {/* Top right - Zone info */}
                    <motion.div 
                        className="absolute top-20 right-6 text-right"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showIntro ? 3.1 : 0.6 }}
                    >
                        <div className="space-y-1 text-xs font-mono">
                            <div className="text-purple-400/70">AI MODULES: {mapNodes.length}</div>
                            <div className="text-cyan-400/50">PIPELINES: {connectionLines.length}</div>
                            <motion.div 
                                className="text-green-400/50"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ALL SYSTEMS OPERATIONAL
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    {/* Bottom - Hovered node info */}
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
                                    className="relative px-8 py-4 rounded-lg backdrop-blur-md text-center"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.85)',
                                        border: `1px solid ${hoveredNode.color}40`,
                                        boxShadow: `0 0 40px ${hoveredNode.glowColor}`,
                                    }}
                                >
                                    {/* Corner decorations */}
                                    <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `2px solid ${hoveredNode.color}`, borderLeft: `2px solid ${hoveredNode.color}` }} />
                                    <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: `2px solid ${hoveredNode.color}`, borderRight: `2px solid ${hoveredNode.color}` }} />
                                    <div className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: `2px solid ${hoveredNode.color}`, borderLeft: `2px solid ${hoveredNode.color}` }} />
                                    <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: `2px solid ${hoveredNode.color}`, borderRight: `2px solid ${hoveredNode.color}` }} />
                                    
                                    <div className="text-white/80 text-sm max-w-md mb-3">
                                        {hoveredNode.description}
                                    </div>
                                    <div className="flex items-center justify-center gap-4 text-xs font-mono text-white/40">
                                        <span>CLICK TO ENTER</span>
                                        <span className="w-1 h-1 rounded-full bg-white/40" />
                                        <span>PRESS [ENTER] TO CONFIRM</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Instructions (when no node hovered) */}
                    <AnimatePresence>
                        {!hoveredNode && (
                            <motion.div
                                className="absolute bottom-4 left-1/2 -translate-x-1/2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-white/30 text-xs font-mono text-center space-y-1">
                                    <div>SELECT A MODULE TO EXPLORE</div>
                                    <div className="text-white/20">PRESS [TAB] OR [M] FOR QUICK NAV</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Corner decorations */}
                    <svg className="absolute top-0 left-0 w-24 h-24 text-cyan-500/20">
                        <path d="M0 24 L0 0 L24 0" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M0 40 L0 8 L8 8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                    <svg className="absolute top-0 right-0 w-24 h-24 text-cyan-500/20">
                        <path d="M72 0 L96 0 L96 24" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M88 8 L96 8 L96 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-24 h-24 text-cyan-500/20">
                        <path d="M0 72 L0 96 L24 96" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M0 56 L0 88 L8 88" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                    <svg className="absolute bottom-0 right-0 w-24 h-24 text-cyan-500/20">
                        <path d="M72 96 L96 96 L96 72" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M88 88 L96 88 L96 56" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
                
                {/* Navigation warp effect */}
                <AnimatePresence>
                    {isNavigating && targetNode && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{ zIndex: 50 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Warp tunnel */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    background: `radial-gradient(circle at ${targetNode.position.x}% ${targetNode.position.y}%, ${targetNode.color}60, transparent 40%)`,
                                }}
                                initial={{ scale: 1, opacity: 0 }}
                                animate={{ scale: 5, opacity: [0, 1, 1] }}
                                transition={{ duration: 0.8, ease: 'easeIn' }}
                            />
                            
                            {/* Speed lines emanating from node */}
                            <div 
                                className="absolute"
                                style={{ 
                                    left: `${targetNode.position.x}%`, 
                                    top: `${targetNode.position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {[...Array(24)].map((_, i) => {
                                    const angle = (i / 24) * 360;
                                    return (
                                        <motion.div
                                            key={i}
                                            className="absolute origin-bottom"
                                            style={{
                                                width: '3px',
                                                height: '200px',
                                                background: `linear-gradient(to top, ${targetNode.color}, transparent)`,
                                                rotate: `${angle}deg`,
                                            }}
                                            initial={{ scaleY: 0, opacity: 0 }}
                                            animate={{ scaleY: [0, 1, 3], opacity: [0, 1, 0] }}
                                            transition={{ 
                                                duration: 0.6, 
                                                delay: i * 0.02,
                                                ease: 'easeOut',
                                            }}
                                        />
                                    );
                                })}
                            </div>
                            
                            {/* Central flash */}
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    left: `${targetNode.position.x}%`,
                                    top: `${targetNode.position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 20,
                                    height: 20,
                                    backgroundColor: targetNode.color,
                                    boxShadow: `0 0 60px ${targetNode.glowColor}, 0 0 120px ${targetNode.glowColor}`,
                                }}
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: [1, 2, 50], opacity: [1, 1, 0] }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PortfolioLayout>
    );
}
