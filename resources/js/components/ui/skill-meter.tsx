/**
 * SkillMeter Component
 * 
 * A futuristic HUD-style skill meter with animated fill,
 * percentage display, and optional pulsing effects.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface SkillMeterProps {
    /** Skill name */
    label: string;
    /** Skill level (0-100) */
    percentage: number;
    /** Meter color theme */
    color?: 'cyan' | 'purple' | 'crimson' | 'green' | 'gradient';
    /** Show percentage text */
    showPercentage?: boolean;
    /** Show level label (Novice, Intermediate, Expert, etc.) */
    showLevel?: boolean;
    /** Animate on scroll into view */
    animateOnView?: boolean;
    /** Additional class name */
    className?: string;
}

const colorStyles = {
    cyan: {
        fill: 'bg-cyan-500',
        glow: 'shadow-[0_0_20px_rgba(0,255,255,0.5)]',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
    },
    purple: {
        fill: 'bg-purple-500',
        glow: 'shadow-[0_0_20px_rgba(167,139,250,0.5)]',
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
    },
    crimson: {
        fill: 'bg-pink-500',
        glow: 'shadow-[0_0_20px_rgba(220,38,127,0.5)]',
        text: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
    },
    green: {
        fill: 'bg-green-500',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
        text: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
    },
    gradient: {
        fill: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500',
        glow: 'shadow-[0_0_20px_rgba(167,139,250,0.5)]',
        text: 'text-white',
        bg: 'bg-white/5',
        border: 'border-white/20',
    },
};

const getLevelLabel = (percentage: number): string => {
    if (percentage >= 90) return 'MASTER';
    if (percentage >= 75) return 'EXPERT';
    if (percentage >= 60) return 'PROFICIENT';
    if (percentage >= 40) return 'INTERMEDIATE';
    if (percentage >= 20) return 'LEARNING';
    return 'NOVICE';
};

export function SkillMeter({
    label,
    percentage,
    color = 'cyan',
    showPercentage = true,
    showLevel = false,
    animateOnView = true,
    className,
}: SkillMeterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const shouldAnimate = animateOnView ? isInView : true;
    const styles = colorStyles[color];
    
    return (
        <div ref={ref} className={cn('w-full', className)}>
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    {/* Status dot */}
                    <motion.div
                        className={cn('w-2 h-2 rounded-full', styles.fill)}
                        animate={shouldAnimate ? {
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    
                    {/* Label */}
                    <span className="text-sm font-mono font-medium text-white/90 uppercase tracking-wider">
                        {label}
                    </span>
                    
                    {/* Level badge */}
                    {showLevel && (
                        <span className={cn(
                            'px-2 py-0.5 text-[10px] font-mono rounded border',
                            styles.bg,
                            styles.border,
                            styles.text
                        )}>
                            {getLevelLabel(percentage)}
                        </span>
                    )}
                </div>
                
                {/* Percentage */}
                {showPercentage && (
                    <motion.span
                        className={cn('text-sm font-mono font-bold', styles.text)}
                        initial={{ opacity: 0 }}
                        animate={shouldAnimate ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        {percentage}%
                    </motion.span>
                )}
            </div>
            
            {/* Meter track */}
            <div className={cn(
                'relative h-2 rounded-full overflow-hidden border',
                styles.bg,
                styles.border
            )}>
                {/* Background grid pattern */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)',
                    }}
                />
                
                {/* Fill bar */}
                <motion.div
                    className={cn('h-full rounded-full relative', styles.fill, styles.glow)}
                    initial={{ width: 0 }}
                    animate={shouldAnimate ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{
                        duration: 1.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.2,
                    }}
                >
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={shouldAnimate ? { x: '200%' } : {}}
                        transition={{
                            duration: 1,
                            delay: 1,
                            ease: 'easeOut',
                        }}
                    />
                    
                    {/* Edge glow */}
                    <div className={cn(
                        'absolute right-0 top-0 bottom-0 w-4',
                        'bg-gradient-to-l from-white/50 to-transparent'
                    )} />
                </motion.div>
                
                {/* Notch markers */}
                <div className="absolute inset-0 flex justify-between px-[10%]">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className="w-[1px] h-full bg-white/10"
                        />
                    ))}
                </div>
            </div>
            
            {/* Tick marks below */}
            <div className="flex justify-between mt-1 px-1">
                {[0, 25, 50, 75, 100].map((tick) => (
                    <span
                        key={tick}
                        className="text-[9px] font-mono text-white/30"
                    >
                        {tick}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default SkillMeter;
