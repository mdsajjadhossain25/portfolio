/**
 * Navbar Component
 * 
 * A futuristic, HUD-style navigation bar with:
 * - Animated logo
 * - Glowing nav links with hover effects
 * - Mobile responsive hamburger menu
 * - Scroll-based appearance changes
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export function Navbar() {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);
    
    return (
        <>
            <motion.header
                className={cn(
                    'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
                    isScrolled
                        ? 'bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]'
                        : 'bg-transparent'
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="relative group">
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Logo icon */}
                                <div className="relative w-10 h-10">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg"
                                        animate={{
                                            rotate: [0, 90, 180, 270, 360],
                                        }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                    <div className="absolute inset-[2px] bg-black rounded-lg flex items-center justify-center">
                                        <span className="text-cyan-400 font-bold text-lg font-mono">S</span>
                                    </div>
                                </div>
                                
                                {/* Logo text */}
                                <div className="hidden sm:block">
                                    <span className="text-white font-bold text-lg tracking-wider">
                                        SAJJAD
                                    </span>
                                    <span className="text-cyan-400 font-bold text-lg">.</span>
                                    <span className="text-cyan-400/70 text-xs font-mono ml-1">DEV</span>
                                </div>
                                
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item, index) => {
                                const isActive = url === item.href || (item.href !== '/' && url.startsWith(item.href));
                                
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'relative px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-300',
                                                isActive
                                                    ? 'text-cyan-400'
                                                    : 'text-white/70 hover:text-white'
                                            )}
                                        >
                                            {/* Active indicator */}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded"
                                                    layoutId="navbar-active"
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            
                                            {/* Hover effect */}
                                            <span className="relative z-10 flex items-center gap-2">
                                                <span className={cn(
                                                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                                                    isActive
                                                        ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]'
                                                        : 'bg-white/30 group-hover:bg-cyan-400'
                                                )} />
                                                {item.label}
                                            </span>
                                            
                                            {/* Underline animation */}
                                            <motion.div
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '80%' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        {/* CTA Button (Desktop) */}
                        <motion.div
                            className="hidden md:block"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            <Link
                                href="/contact"
                                className="group relative px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg
                                           text-cyan-400 text-sm font-medium uppercase tracking-wider
                                           hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-300
                                           shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                            >
                                <span className="relative z-10">Hire Me</span>
                                
                                {/* Corner accents */}
                                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/50" />
                                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/50" />
                                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/50" />
                                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/50" />
                            </Link>
                        </motion.div>
                        
                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden relative w-10 h-10 flex items-center justify-center"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="relative w-6 h-5 flex flex-col justify-between">
                                <motion.span
                                    className="w-full h-0.5 bg-cyan-400 origin-left"
                                    animate={isMobileMenuOpen ? { rotate: 45, y: -2 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.span
                                    className="w-full h-0.5 bg-cyan-400"
                                    animate={isMobileMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.span
                                    className="w-full h-0.5 bg-cyan-400 origin-left"
                                    animate={isMobileMenuOpen ? { rotate: -45, y: 2 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.button>
                    </nav>
                </div>
                
                {/* HUD decorative line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)',
                    }}
                    animate={{
                        opacity: isScrolled ? [0.5, 1, 0.5] : 0,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.header>
            
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* Menu content */}
                        <motion.nav
                            className="absolute inset-x-4 top-20 bottom-4 flex flex-col items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            {navItems.map((item, index) => {
                                const isActive = url === item.href || (item.href !== '/' && url.startsWith(item.href));
                                
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'block px-6 py-3 text-2xl font-bold uppercase tracking-wider transition-all duration-300',
                                                isActive
                                                    ? 'text-cyan-400'
                                                    : 'text-white/70 hover:text-white'
                                            )}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className={cn(
                                                    'w-2 h-2 rounded-full',
                                                    isActive
                                                        ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]'
                                                        : 'bg-white/30'
                                                )} />
                                                {item.label}
                                            </span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            
                            {/* CTA Button */}
                            <motion.div
                                className="mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                            >
                                <Link
                                    href="/contact"
                                    className="inline-block px-8 py-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg
                                               text-cyan-400 text-lg font-bold uppercase tracking-wider
                                               shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Hire Me
                                </Link>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;
