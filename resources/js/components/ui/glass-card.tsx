/**
 * GlassCard Component
 * 
 * A glassmorphism card with animated borders, glow effects,
 * and futuristic HUD-style accents.
 */

import { forwardRef, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glassCardVariants = cva(
    // Base glassmorphism styles - Theme aware
    `relative backdrop-blur-xl border overflow-hidden
     transition-all duration-500`,
    {
        variants: {
            variant: {
                default: `bg-white/80 dark:bg-white/5 border-gray-200/50 dark:border-white/10
                          hover:bg-white/90 dark:hover:bg-white/10 hover:border-gray-300/50 dark:hover:border-white/20`,
                cyan: `bg-cyan-50/80 dark:bg-cyan-500/5 border-cyan-200/50 dark:border-cyan-500/20
                       hover:bg-cyan-100/80 dark:hover:bg-cyan-500/10 hover:border-cyan-300/50 dark:hover:border-cyan-500/40
                       shadow-[0_0_20px_rgba(8,145,178,0.1)] dark:shadow-[0_0_30px_rgba(0,255,255,0.1)]
                       hover:shadow-[0_0_30px_rgba(8,145,178,0.15)] dark:hover:shadow-[0_0_40px_rgba(0,255,255,0.2)]`,
                purple: `bg-purple-50/80 dark:bg-purple-500/5 border-purple-200/50 dark:border-purple-500/20
                         hover:bg-purple-100/80 dark:hover:bg-purple-500/10 hover:border-purple-300/50 dark:hover:border-purple-500/40
                         shadow-[0_0_20px_rgba(147,51,234,0.1)] dark:shadow-[0_0_30px_rgba(167,139,250,0.1)]
                         hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] dark:hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]`,
                crimson: `bg-pink-50/80 dark:bg-pink-500/5 border-pink-200/50 dark:border-pink-500/20
                          hover:bg-pink-100/80 dark:hover:bg-pink-500/10 hover:border-pink-300/50 dark:hover:border-pink-500/40
                          shadow-[0_0_20px_rgba(219,39,119,0.1)] dark:shadow-[0_0_30px_rgba(220,38,127,0.1)]
                          hover:shadow-[0_0_30px_rgba(219,39,119,0.15)] dark:hover:shadow-[0_0_40px_rgba(220,38,127,0.2)]`,
                gradient: `bg-gradient-to-br from-cyan-50/80 via-purple-50/80 to-pink-50/80 dark:from-cyan-500/10 dark:via-purple-500/10 dark:to-pink-500/10
                           border-gray-200/50 dark:border-white/10 hover:border-gray-300/50 dark:hover:border-white/30`,
            },
            size: {
                sm: 'p-4 rounded-lg',
                md: 'p-6 rounded-xl',
                lg: 'p-8 rounded-2xl',
            },
            hover: {
                none: '',
                lift: 'hover:-translate-y-2',
                scale: 'hover:scale-[1.02]',
                glow: 'hover:shadow-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            hover: 'lift',
        },
    }
);

export interface GlassCardProps
    extends Omit<HTMLMotionProps<'div'>, 'ref'>,
        VariantProps<typeof glassCardVariants> {
    /** Show HUD-style corner accents */
    hudCorners?: boolean;
    /** Show animated border gradient */
    animatedBorder?: boolean;
    /** Show noise texture overlay */
    noiseOverlay?: boolean;
    /** Show scan line animation */
    scanLine?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ 
        className, 
        variant, 
        size, 
        hover,
        hudCorners = true,
        animatedBorder = false,
        noiseOverlay = true,
        scanLine = false,
        children, 
        ...props 
    }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(glassCardVariants({ variant, size, hover }), className)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                {...props}
            >
                {/* Noise texture overlay for depth */}
                {noiseOverlay && (
                    <div 
                        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />
                )}
                
                {/* Animated border gradient */}
                {animatedBorder && (
                    <motion.div
                        className="absolute inset-0 rounded-[inherit] pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, rgba(0,255,255,0.3), rgba(167,139,250,0.3), rgba(220,38,127,0.3), rgba(0,255,255,0.3))',
                            backgroundSize: '300% 100%',
                            padding: '1px',
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'xor',
                            WebkitMaskComposite: 'xor',
                        }}
                        animate={{
                            backgroundPosition: ['0% 0%', '300% 0%'],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                )}
                
                {/* Scan line effect */}
                {scanLine && (
                    <motion.div
                        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
                        animate={{
                            top: ['0%', '100%'],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                )}
                
                {/* HUD-style corner accents - Theme aware */}
                {hudCorners && (
                    <>
                        {/* Top-left corner */}
                        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-600 dark:from-cyan-400 to-transparent" />
                            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-cyan-600 dark:from-cyan-400 to-transparent" />
                        </div>
                        
                        {/* Top-right corner */}
                        <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-600 dark:from-cyan-400 to-transparent" />
                            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-cyan-600 dark:from-cyan-400 to-transparent" />
                        </div>
                        
                        {/* Bottom-left corner */}
                        <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none">
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-600 dark:from-cyan-400 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-cyan-600 dark:from-cyan-400 to-transparent" />
                        </div>
                        
                        {/* Bottom-right corner */}
                        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
                            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-600 dark:from-cyan-400 to-transparent" />
                            <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-cyan-600 dark:from-cyan-400 to-transparent" />
                        </div>
                    </>
                )}
                
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                
                {/* Card content */}
                <div className="relative z-10">
                    {children as React.ReactNode}
                </div>
            </motion.div>
        );
    }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };
