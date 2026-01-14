/**
 * ParticleBackground Component
 * 
 * An animated particle system background with mouse interaction,
 * particle connections, and configurable appearance.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

interface ParticleBackgroundProps {
    /** Number of particles */
    particleCount?: number;
    /** Particle colors */
    colors?: string[];
    /** Whether particles connect when close */
    showConnections?: boolean;
    /** Distance at which particles connect */
    connectionDistance?: number;
    /** Mouse attraction strength */
    mouseAttraction?: number;
    /** Background gradient colors */
    gradientColors?: string[];
    /** Additional class name */
    className?: string;
}

export function ParticleBackground({
    particleCount = 50,
    colors = ['#00ffff', '#a78bfa', '#dc267f'],
    showConnections = true,
    connectionDistance = 120,
    mouseAttraction = 0.02,
    gradientColors = ['#000000', '#0a0a1a', '#000000'],
    className,
}: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationRef = useRef<number | undefined>(undefined);
    
    // Check for reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    // Initialize particles
    const initParticles = useCallback((width: number, height: number) => {
        particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
    }, [particleCount, colors]);
    
    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const particles = particlesRef.current;
        const mouse = mouseRef.current;
        
        // Update and draw particles
        particles.forEach((particle, i) => {
            // Mouse attraction
            if (mouse.x > 0 && mouse.y > 0) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    particle.vx += (dx / distance) * mouseAttraction;
                    particle.vy += (dy / distance) * mouseAttraction;
                }
            }
            
            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw glow
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 4
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = particle.opacity * 0.3;
            ctx.fill();
            
            // Draw connections
            if (showConnections) {
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = (1 - distance / connectionDistance) * 0.2;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        });
        
        ctx.globalAlpha = 1;
        
        animationRef.current = requestAnimationFrame(animate);
    }, [showConnections, connectionDistance, mouseAttraction]);
    
    // Handle resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, [initParticles]);
    
    // Handle mouse move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        
        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);
    
    // Start animation
    useEffect(() => {
        if (prefersReducedMotion) return;
        
        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, prefersReducedMotion]);
    
    if (prefersReducedMotion) {
        // Return static gradient for reduced motion
        return (
            <div
                className={cn('fixed inset-0 -z-10', className)}
                style={{
                    background: `linear-gradient(180deg, ${gradientColors.join(', ')})`,
                }}
            />
        );
    }
    
    return (
        <div className={cn('fixed inset-0 -z-10', className)}>
            {/* Gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(180deg, ${gradientColors.join(', ')})`,
                }}
            />
            
            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />
            
            {/* Vignette overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                }}
            />
            
            {/* Scan line effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }}
            />
        </div>
    );
}

export default ParticleBackground;
