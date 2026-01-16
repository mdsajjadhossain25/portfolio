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

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Head, router } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { MapNode } from '@/components/game-map/map-node';
import { mapNodes, type MapNode as MapNodeType } from '@/components/game-map/map-config';
import { useAppearance } from '@/hooks/use-appearance';

// Mobile-adjusted node positions (spread out to avoid label overlaps)
const mobilePositions: Record<string, { x: number; y: number }> = {
    home: { x: 50, y: 32 },
    about: { x: 22, y: 48 },
    projects: { x: 78, y: 48 },
    services: { x: 78, y: 66 },
    blog: { x: 22, y: 66 },
    contact: { x: 50, y: 82 },
};

// Hook to detect mobile screen
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    return isMobile;
}

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
    const isMobile = useIsMobile();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    
    // Generate static elements once
    const [stars] = useState(() => generateStars(150));
    const [particles] = useState(() => generateParticles(20));
    
    // Get responsive node positions
    const responsiveNodes = useMemo(() => {
        return mapNodes.map(node => ({
            ...node,
            position: isMobile && mobilePositions[node.id] 
                ? mobilePositions[node.id] 
                : node.position,
        }));
    }, [isMobile]);
    
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
    
    // FULLY CONNECTED neural network lines (every node to every other node)
    const allConnectionLines = useMemo(() => {
        const lines: { from: MapNodeType; to: MapNodeType; id: string; isPrimary: boolean }[] = [];
        
        for (let i = 0; i < responsiveNodes.length; i++) {
            for (let j = i + 1; j < responsiveNodes.length; j++) {
                const from = responsiveNodes[i];
                const to = responsiveNodes[j];
                // Check if this is a primary connection (defined in node.connections)
                const isPrimary = from.connections.includes(to.id) || to.connections.includes(from.id);
                lines.push({
                    from,
                    to,
                    id: `${from.id}-${to.id}`,
                    isPrimary,
                });
            }
        }
        return lines;
    }, [responsiveNodes]);
    
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
                className={`relative w-full h-screen overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-b from-slate-100 to-slate-200'}`}
            >
                {/* Intro overlay */}
                <AnimatePresence>
                    {showIntro && (
                        <motion.div
                            className={`absolute inset-0 z-[60] flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}
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
                                    className={`text-xs font-mono tracking-[0.5em] mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    INITIALIZING AI SYSTEMS
                                </motion.div>
                                <div className={`w-48 h-1 rounded-full overflow-hidden mx-auto ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
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
                
                {/* Anime-inspired atmospheric background */}
                <div className={`absolute inset-0 overflow-hidden ${!isDark && 'opacity-60'}`}>
                    {/* Base dark gradient with color tones */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#0d0a1a] to-[#050510]" />
                    
                    {/* Demon Slayer inspired color wash - crimson/purple atmospheric haze */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-rose-950/30" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-950/20 via-transparent to-indigo-950/30" />
                    
                    {/* Abstract silhouette mountains/landscape at bottom */}
                    <svg 
                        className="absolute bottom-0 left-0 right-0 w-full h-[40%] opacity-30"
                        viewBox="0 0 1440 400" 
                        preserveAspectRatio="xMidYMax slice"
                        fill="none"
                    >
                        {/* Far mountains - darkest */}
                        <path 
                            d="M0,400 L0,280 Q200,200 400,260 T800,220 T1200,280 L1440,240 L1440,400 Z" 
                            fill="url(#mountain-grad-1)"
                        />
                        {/* Mid mountains */}
                        <path 
                            d="M0,400 L0,320 Q150,260 350,300 T700,270 T1100,310 L1440,290 L1440,400 Z" 
                            fill="url(#mountain-grad-2)"
                        />
                        {/* Near foliage silhouette */}
                        <path 
                            d="M0,400 L0,360 Q100,340 200,360 T400,350 T600,365 T800,355 T1000,370 T1200,360 T1440,370 L1440,400 Z" 
                            fill="url(#mountain-grad-3)"
                        />
                        <defs>
                            <linearGradient id="mountain-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1a0a2e" />
                                <stop offset="100%" stopColor="#0d0515" />
                            </linearGradient>
                            <linearGradient id="mountain-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#15081f" />
                                <stop offset="100%" stopColor="#0a0410" />
                            </linearGradient>
                            <linearGradient id="mountain-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0f0518" />
                                <stop offset="100%" stopColor="#050208" />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    {/* Atmospheric glow orbs - inspired by anime lighting */}
                    <motion.div 
                        className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full opacity-20"
                        style={{
                            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.25, 0.15],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div 
                        className="absolute top-[30%] right-[5%] w-[250px] h-[250px] rounded-full opacity-15"
                        style={{
                            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
                            filter: 'blur(50px)',
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    />
                    <motion.div 
                        className="absolute bottom-[20%] left-[20%] w-[400px] h-[200px] rounded-full opacity-10"
                        style={{
                            background: 'radial-gradient(ellipse, rgba(6,182,212,0.3) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                        animate={{
                            x: [0, 20, 0],
                            opacity: [0.08, 0.15, 0.08],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
                
                {/* Deep space background layer with stars */}
                <motion.div 
                    className="absolute inset-[-50px]"
                    style={{ x: bgX, y: bgY }}
                >
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
                        className="absolute bottom-0 left-[-20%] right-[-20%] h-[60%] opacity-[0.04]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(139, 92, 246, 1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(139, 92, 246, 1) 1px, transparent 1px)
                            `,
                            backgroundSize: '80px 80px',
                            transform: 'perspective(400px) rotateX(70deg)',
                            transformOrigin: 'bottom center',
                        }}
                    />
                    
                    {/* Vertical grid overlay */}
                    <div 
                        className="absolute inset-0 opacity-[0.02]"
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
                
                {/* Neural Network Connection Lines SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <defs>
                        {/* Gradients for all connections */}
                        {allConnectionLines.map(line => (
                            <linearGradient
                                key={`grad-${line.id}`}
                                id={`line-grad-${line.id}`}
                                x1={`${line.from.position.x}%`}
                                y1={`${line.from.position.y}%`}
                                x2={`${line.to.position.x}%`}
                                y2={`${line.to.position.y}%`}
                            >
                                <stop offset="0%" stopColor={line.from.color} stopOpacity={line.isPrimary ? 0.5 : 0.15} />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity={line.isPrimary ? 0.2 : 0.05} />
                                <stop offset="100%" stopColor={line.to.color} stopOpacity={line.isPrimary ? 0.5 : 0.15} />
                            </linearGradient>
                        ))}
                        
                        {/* Animated gradient for pulse effect */}
                        <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0">
                                <animate attributeName="offset" values="-0.5;1" dur="2s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.8">
                                <animate attributeName="offset" values="0;1.5" dur="2s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0">
                                <animate attributeName="offset" values="0.5;2" dur="2s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                    </defs>
                    
                    {/* Render all neural network connections */}
                    {allConnectionLines.map((line, index) => {
                        const isHighlighted = 
                            hoveredNode?.id === line.from.id || 
                            hoveredNode?.id === line.to.id;
                        
                        // On mobile, only show primary connections to reduce clutter
                        if (isMobile && !line.isPrimary && !isHighlighted) return null;
                        
                        return (
                            <motion.line
                                key={line.id}
                                x1={`${line.from.position.x}%`}
                                y1={`${line.from.position.y}%`}
                                x2={`${line.to.position.x}%`}
                                y2={`${line.to.position.y}%`}
                                stroke={`url(#line-grad-${line.id})`}
                                strokeWidth={isHighlighted ? 1.5 : line.isPrimary ? 1 : 0.5}
                                strokeDasharray={line.isPrimary ? "none" : "4,6"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: 1, 
                                    opacity: isHighlighted ? 0.9 : line.isPrimary ? 0.5 : 0.2,
                                }}
                                transition={{ 
                                    duration: 1.5 + index * 0.1, 
                                    ease: 'easeOut',
                                    delay: index * 0.05,
                                }}
                            />
                        );
                    })}
                    
                    {/* Energy pulses flowing through network */}
                    {!isMobile && allConnectionLines.filter(l => l.isPrimary).map((line, index) => (
                        <motion.circle
                            key={`flow-${line.id}`}
                            r="2"
                            fill={line.from.color}
                            style={{ filter: `drop-shadow(0 0 4px ${line.from.color})` }}
                            initial={{ 
                                cx: `${line.from.position.x}%`, 
                                cy: `${line.from.position.y}%`,
                                opacity: 0.6,
                            }}
                            animate={{ 
                                cx: [`${line.from.position.x}%`, `${line.to.position.x}%`],
                                cy: [`${line.from.position.y}%`, `${line.to.position.y}%`],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{ 
                                duration: 3 + index * 0.5, 
                                repeat: Infinity, 
                                ease: 'linear',
                                delay: index * 0.8,
                            }}
                        />
                    ))}
                    
                    {/* Enhanced pulses when node is hovered */}
                    <AnimatePresence>
                        {hoveredNode && responsiveNodes.filter(n => n.id !== hoveredNode.id).map(targetNode => (
                            <motion.circle
                                key={`pulse-${hoveredNode.id}-${targetNode.id}`}
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
                                    opacity: [1, 0.6, 0],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                                style={{ filter: `drop-shadow(0 0 6px ${hoveredNode.color})` }}
                            />
                        ))}
                    </AnimatePresence>
                </svg>
                
                {/* Navigation nodes */}
                <div className="absolute inset-0" style={{ zIndex: 10 }}>
                    {responsiveNodes.map((node, index) => (
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
                                isMobile={isMobile}
                            />
                        </motion.div>
                    ))}
                </div>
                
                {/* Title and branding - TOP CENTER */}
                <motion.div
                    className="absolute top-20 sm:top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-[15] px-4 w-full sm:w-auto"
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
                            className="text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide px-2"
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
                            <span className="text-white/40 mx-1 sm:mx-2">—</span>
                            <span className="text-white/60 block sm:inline mt-1 sm:mt-0">
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
                        className="absolute top-6 left-6 hidden sm:block"
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
                        className="absolute top-6 sm:top-20 right-6 text-right hidden sm:block"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showIntro ? 3.1 : 0.6 }}
                    >
                        <div className="space-y-1 text-xs font-mono">
                            <div className="text-purple-400/70">AI MODULES: {responsiveNodes.length}</div>
                            <div className="text-cyan-400/50">NEURAL LINKS: {allConnectionLines.length}</div>
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
                                className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto max-w-md"
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
                                className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-white/30 text-[10px] sm:text-xs font-mono text-center space-y-1">
                                    <div>SELECT A MODULE TO EXPLORE</div>
                                    <div className="text-white/20 hidden sm:block">PRESS [TAB] OR [M] FOR QUICK NAV</div>
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
