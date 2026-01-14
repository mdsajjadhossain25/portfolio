/**
 * GlowButton Component
 * 
 * A futuristic button with neon glow effects, hover animations,
 * and multiple variants for different contexts.
 */

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glowButtonVariants = cva(
    // Base styles
    `relative inline-flex items-center justify-center font-medium 
     transition-all duration-300 overflow-hidden
     disabled:opacity-50 disabled:cursor-not-allowed
     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black`,
    {
        variants: {
            variant: {
                cyan: `bg-cyan-500/20 text-cyan-400 border border-cyan-500/50
                       hover:bg-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300
                       focus-visible:ring-cyan-500
                       shadow-[0_0_20px_rgba(0,255,255,0.3)]
                       hover:shadow-[0_0_30px_rgba(0,255,255,0.5),0_0_60px_rgba(0,255,255,0.3)]`,
                purple: `bg-purple-500/20 text-purple-400 border border-purple-500/50
                         hover:bg-purple-500/30 hover:border-purple-400 hover:text-purple-300
                         focus-visible:ring-purple-500
                         shadow-[0_0_20px_rgba(167,139,250,0.3)]
                         hover:shadow-[0_0_30px_rgba(167,139,250,0.5),0_0_60px_rgba(167,139,250,0.3)]`,
                crimson: `bg-pink-500/20 text-pink-400 border border-pink-500/50
                          hover:bg-pink-500/30 hover:border-pink-400 hover:text-pink-300
                          focus-visible:ring-pink-500
                          shadow-[0_0_20px_rgba(220,38,127,0.3)]
                          hover:shadow-[0_0_30px_rgba(220,38,127,0.5),0_0_60px_rgba(220,38,127,0.3)]`,
                ghost: `bg-white/5 text-white/80 border border-white/20
                        hover:bg-white/10 hover:border-white/40 hover:text-white
                        focus-visible:ring-white/50`,
                outline: `bg-transparent text-cyan-400 border-2 border-cyan-500
                          hover:bg-cyan-500/10 hover:text-cyan-300
                          focus-visible:ring-cyan-500`,
            },
            size: {
                sm: 'h-9 px-4 text-sm rounded-md',
                md: 'h-11 px-6 text-base rounded-lg',
                lg: 'h-14 px-8 text-lg rounded-xl',
                xl: 'h-16 px-10 text-xl rounded-2xl',
            },
        },
        defaultVariants: {
            variant: 'cyan',
            size: 'md',
        },
    }
);

export interface GlowButtonProps
    extends Omit<HTMLMotionProps<'button'>, 'ref'>,
        VariantProps<typeof glowButtonVariants> {
    /** Show animated border effect */
    animatedBorder?: boolean;
    /** Show scan line effect on hover */
    scanLine?: boolean;
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ 
        className, 
        variant, 
        size, 
        animatedBorder = false,
        scanLine = true,
        children, 
        ...props 
    }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(glowButtonVariants({ variant, size }), className)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                {...props}
            >
                {/* Animated border gradient */}
                {animatedBorder && (
                    <motion.span
                        className="absolute inset-0 rounded-[inherit]"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.4), transparent)',
                            backgroundSize: '200% 100%',
                        }}
                        animate={{
                            backgroundPosition: ['200% 0', '-200% 0'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                )}
                
                {/* Scan line effect */}
                {scanLine && (
                    <motion.span
                        className="absolute inset-0 rounded-[inherit] overflow-hidden opacity-0 hover:opacity-100"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                    >
                        <motion.span
                            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            initial={{ top: '-100%' }}
                            whileHover={{
                                top: ['0%', '100%'],
                                transition: {
                                    duration: 0.6,
                                    repeat: Infinity,
                                    ease: 'linear',
                                },
                            }}
                        />
                    </motion.span>
                )}
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children as React.ReactNode}
                </span>
                
                {/* Corner accents */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
            </motion.button>
        );
    }
);

GlowButton.displayName = 'GlowButton';

export { GlowButton, glowButtonVariants };
