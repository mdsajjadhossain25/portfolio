/**
 * Footer Component
 * 
 * A futuristic footer with glassmorphism, animated elements,
 * social links, and HUD-style decorations.
 */

import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface SocialLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
    {
        label: 'GitHub',
        href: 'https://github.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        ),
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
    },
    {
        label: 'Email',
        href: 'mailto:hello@example.com',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="relative mt-20 overflow-hidden">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />
            
            {/* Grid pattern */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand section */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                                />
                                <div className="absolute inset-[2px] bg-black rounded-lg flex items-center justify-center">
                                    <span className="text-cyan-400 font-bold text-xl font-mono">S</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-white font-bold text-xl tracking-wider">SAJJAD</span>
                                <span className="text-cyan-400 font-bold text-xl">.</span>
                                <span className="text-cyan-400/70 text-sm font-mono ml-1">CODES</span>
                            </div>
                        </div>
                        
                        <p className="text-white/60 text-sm leading-relaxed max-w-md mb-6">
                            Building next-generation digital experiences with cutting-edge technology.
                            Specializing in full-stack development, UI/UX design, and creative solutions.
                        </p>
                        
                        {/* Social links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-10 h-10 flex items-center justify-center
                                               bg-white/5 border border-white/10 rounded-lg
                                               text-white/60 hover:text-cyan-400 hover:border-cyan-500/50
                                               transition-all duration-300"
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social.icon}
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-lg bg-cyan-500/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Quick links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h3 className="text-cyan-400 font-mono font-semibold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                            Navigation
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-300
                                                   flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-cyan-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    
                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h3 className="text-cyan-400 font-mono font-semibold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                            Contact
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-white/60 text-sm flex items-start gap-2">
                                <span className="text-cyan-400/70 mt-0.5">→</span>
                                <span>hello@example.com</span>
                            </li>
                            <li className="text-white/60 text-sm flex items-start gap-2">
                                <span className="text-cyan-400/70 mt-0.5">→</span>
                                <span>Available for freelance</span>
                            </li>
                            <li className="text-white/60 text-sm flex items-start gap-2">
                                <span className="text-cyan-400/70 mt-0.5">→</span>
                                <span>Remote / Worldwide</span>
                            </li>
                        </ul>
                        
                        {/* Status indicator */}
                        <div className="mt-4 flex items-center gap-2">
                            <motion.span
                                className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-green-400 text-xs font-mono uppercase">Available for work</span>
                        </div>
                    </motion.div>
                </div>
                
                {/* Bottom bar */}
                <motion.div
                    className="pt-8 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-white/40 text-sm font-mono">
                            © {currentYear} <span className="text-cyan-400/70">SAJJAD.CODES</span>. All rights reserved.
                        </p>
                        
                        {/* Tech stack badge */}
                        <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                            <span>Built with</span>
                            <span className="text-cyan-400/70">React</span>
                            <span>+</span>
                            <span className="text-purple-400/70">Laravel</span>
                            <span>+</span>
                            <span className="text-pink-400/70">Inertia</span>
                        </div>
                        
                        {/* System status */}
                        <div className="flex items-center gap-3 text-xs font-mono text-white/30">
                            <span>SYS: ONLINE</span>
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span>v1.0.0</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Bottom decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
                {/* Scan line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Corner accents */}
                <div className="absolute bottom-4 left-4 w-8 h-8">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-cyan-500/50 to-transparent" />
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
                    <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-cyan-500/50 to-transparent" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
