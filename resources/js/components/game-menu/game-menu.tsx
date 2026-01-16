/**
 * GameMenu Component
 * 
 * A floating HUD-style menu overlay triggered by hotkey or icon.
 * Features:
 * - Radial/circular menu layout
 * - Keyboard navigation support
 * - Animated entry/exit
 * - Current location indicator
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { mapNodes, getNodeByHref, type MapNode } from '../game-map/map-config';
import { ThemeToggle } from '@/components/theme-toggle';

interface GameMenuProps {
    className?: string;
}

export function GameMenu({ className = '' }: GameMenuProps) {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const activeNode = getNodeByHref(url);
    
    // Toggle menu with keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore keyboard shortcuts when user is typing in input fields
            const target = e.target as HTMLElement;
            const isInputFocused = 
                target.tagName === 'INPUT' || 
                target.tagName === 'TEXTAREA' || 
                target.tagName === 'SELECT' ||
                target.isContentEditable ||
                target.closest('[contenteditable="true"]');
            
            if (isInputFocused) {
                return;
            }
            
            // Toggle with Tab or M key
            if (e.key === 'Tab' || e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                return;
            }
            
            // Close with Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                return;
            }
            
            if (!isOpen) return;
            
            // Navigate with arrow keys or WASD
            const navCount = mapNodes.length;
            
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + navCount) % navCount);
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % navCount);
            }
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + navCount) % navCount);
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % navCount);
            }
            
            // Select with Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate(mapNodes[selectedIndex]);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex]);
    
    // Handle navigation
    const handleNavigate = useCallback((node: MapNode) => {
        if (node.href === url) {
            setIsOpen(false);
            return;
        }
        
        setIsNavigating(true);
        
        setTimeout(() => {
            router.visit(node.href);
            setIsOpen(false);
            setIsNavigating(false);
        }, 500);
    }, [url]);
    
    // Calculate circular positions
    const getNodePosition = (index: number, total: number) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = 150;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };
    
    return (
        <>
            {/* Top-right controls */}
            <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 ${className}`}>
                {/* Theme toggle button */}
                <ThemeToggle variant="default" size="md" />
                
                {/* Menu trigger button */}
                <motion.button
                    className="p-3 rounded-lg backdrop-blur-md
                               bg-white/5 dark:bg-black/50 border border-gray-300/50 dark:border-cyan-500/30 
                               hover:border-cyan-500/60 hover:bg-cyan-500/10
                               transition-colors duration-300"
                    onClick={() => setIsOpen(prev => !prev)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle navigation menu"
                >
                    <motion.div
                        className="w-6 h-6 flex flex-col items-center justify-center gap-1.5"
                        animate={isOpen ? 'open' : 'closed'}
                    >
                        <motion.span
                            className="w-5 h-0.5 bg-gray-600 dark:bg-cyan-400 block"
                            variants={{
                                closed: { rotate: 0, y: 0 },
                                open: { rotate: 45, y: 6 },
                            }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-5 h-0.5 bg-gray-600 dark:bg-cyan-400 block"
                            variants={{
                                closed: { opacity: 1, scale: 1 },
                                open: { opacity: 0, scale: 0 },
                            }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-5 h-0.5 bg-gray-600 dark:bg-cyan-400 block"
                            variants={{
                                closed: { rotate: 0, y: 0 },
                                open: { rotate: -45, y: -6 },
                            }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.div>
                </motion.button>
            </div>
            
            {/* Menu overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={menuRef}
                        className="fixed inset-0 z-40 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Grid background */}
                        <div 
                            className="absolute inset-0 opacity-[0.05] pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(0, 245, 255, 1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0, 245, 255, 1) 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px',
                            }}
                        />
                        
                        {/* Circular menu container */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                        >
                            {/* Center hub */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                           w-24 h-24 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'radial-gradient(circle, rgba(0, 245, 255, 0.2), transparent)',
                                    border: '2px solid rgba(0, 245, 255, 0.3)',
                                    boxShadow: '0 0 30px rgba(0, 245, 255, 0.3), inset 0 0 20px rgba(0, 245, 255, 0.1)',
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-cyan-400 text-2xl">◈</div>
                                    <div className="text-cyan-400/50 text-xs font-mono mt-1">NAVIGATE</div>
                                </div>
                            </motion.div>
                            
                            {/* Outer ring */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                           w-80 h-80 rounded-full"
                                style={{
                                    border: '1px solid rgba(0, 245, 255, 0.2)',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            />
                            
                            {/* Second ring */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                           w-96 h-96 rounded-full"
                                style={{
                                    border: '1px dashed rgba(191, 0, 255, 0.15)',
                                }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                            />
                            
                            {/* Menu items */}
                            {mapNodes.map((node, index) => {
                                const pos = getNodePosition(index, mapNodes.length);
                                const isSelected = selectedIndex === index;
                                const isActive = activeNode?.id === node.id;
                                
                                return (
                                    <motion.button
                                        key={node.id}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                                   flex flex-col items-center gap-2 p-4 rounded-lg
                                                   transition-all duration-200 outline-none"
                                        style={{
                                            x: pos.x,
                                            y: pos.y,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: isSelected ? 1.1 : 1,
                                        }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        transition={{ 
                                            delay: index * 0.05,
                                            duration: 0.3,
                                        }}
                                        onClick={() => handleNavigate(node)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        {/* Node circle */}
                                        <motion.div
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{
                                                background: isSelected 
                                                    ? `linear-gradient(135deg, ${node.color}40, ${node.color}20)`
                                                    : 'rgba(0, 0, 0, 0.5)',
                                                border: `2px solid ${isSelected ? node.color : node.color + '50'}`,
                                                boxShadow: isSelected 
                                                    ? `0 0 20px ${node.glowColor}, 0 0 40px ${node.glowColor}`
                                                    : 'none',
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <span 
                                                className="text-xl"
                                                style={{ 
                                                    color: isSelected ? node.color : `${node.color}80`,
                                                    textShadow: isSelected ? `0 0 10px ${node.color}` : 'none',
                                                }}
                                            >
                                                {node.icon}
                                            </span>
                                        </motion.div>
                                        
                                        {/* Label */}
                                        <motion.div
                                            className="text-center"
                                            animate={{ opacity: isSelected ? 1 : 0.5 }}
                                        >
                                            <div 
                                                className="font-bold text-xs tracking-wider font-mono whitespace-nowrap"
                                                style={{ color: isSelected ? node.color : 'white' }}
                                            >
                                                {node.label}
                                            </div>
                                            {isActive && (
                                                <div className="text-green-400 text-[10px] font-mono mt-0.5">
                                                    • CURRENT
                                                </div>
                                            )}
                                        </motion.div>
                                        
                                        {/* Selection ring */}
                                        {isSelected && (
                                            <motion.div
                                                className="absolute inset-0 rounded-lg pointer-events-none"
                                                style={{
                                                    border: `1px solid ${node.color}50`,
                                                }}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.15 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                        
                        {/* Instructions */}
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-white/30 text-xs font-mono space-x-6">
                                <span>[WASD/ARROWS] Navigate</span>
                                <span>[ENTER/SPACE] Select</span>
                                <span>[ESC/TAB] Close</span>
                            </div>
                        </motion.div>
                        
                        {/* Navigation animation */}
                        <AnimatePresence>
                            {isNavigating && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                            backgroundColor: mapNodes[selectedIndex].color,
                                            boxShadow: `0 0 30px ${mapNodes[selectedIndex].glowColor}`,
                                        }}
                                        animate={{ scale: [1, 50], opacity: [1, 0] }}
                                        transition={{ duration: 0.5, ease: 'easeIn' }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default GameMenu;
