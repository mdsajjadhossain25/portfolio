/**
 * HUDPanel Component
 * 
 * A sci-fi HUD (Heads-Up Display) style panel with
 * technical decorations, status indicators, and data displays.
 */

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HUDPanelProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'title'> {
    /** Panel title displayed in the header */
    title?: string;
    /** Status indicator (online, offline, processing, warning, error) */
    status?: 'online' | 'offline' | 'processing' | 'warning' | 'error';
    /** Show header section */
    showHeader?: boolean;
    /** Show technical decoration lines */
    showDecorations?: boolean;
    /** Show data readout in corner */
    dataReadout?: string;
    /** Panel accent color */
    accentColor?: 'cyan' | 'purple' | 'crimson' | 'green';
    children: ReactNode;
}

const statusColors = {
    online: 'bg-green-500 shadow-green-500/50',
    offline: 'bg-gray-500 shadow-gray-500/50',
    processing: 'bg-cyan-500 shadow-cyan-500/50 animate-pulse',
    warning: 'bg-yellow-500 shadow-yellow-500/50',
    error: 'bg-red-500 shadow-red-500/50 animate-pulse',
};

const statusLabels = {
    online: 'ONLINE',
    offline: 'OFFLINE',
    processing: 'PROCESSING',
    warning: 'WARNING',
    error: 'ERROR',
};

const accentColors = {
    cyan: {
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/20',
        line: 'bg-cyan-500',
    },
    purple: {
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        glow: 'shadow-purple-500/20',
        line: 'bg-purple-500',
    },
    crimson: {
        border: 'border-pink-500/30',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/20',
        line: 'bg-pink-500',
    },
    green: {
        border: 'border-green-500/30',
        text: 'text-green-400',
        glow: 'shadow-green-500/20',
        line: 'bg-green-500',
    },
};

const HUDPanel = forwardRef<HTMLDivElement, HUDPanelProps>(
    ({ 
        className,
        title,
        status = 'online',
        showHeader = true,
        showDecorations = true,
        dataReadout,
        accentColor = 'cyan',
        children,
        ...props 
    }, ref) => {
        const colors = accentColors[accentColor];
        
        return (
            <motion.div
                ref={ref}
                className={cn(
                    'relative bg-black/40 backdrop-blur-md border rounded-lg overflow-hidden',
                    colors.border,
                    `shadow-lg ${colors.glow}`,
                    className
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                {...props}
            >
                {/* Background grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                    }}
                />
                
                {/* Decorative corner lines */}
                {showDecorations && (
                    <>
                        {/* Top-left decoration */}
                        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
                            <div className={cn('absolute top-0 left-0 w-12 h-[2px]', colors.line, 'opacity-60')} />
                            <div className={cn('absolute top-0 left-0 w-[2px] h-12', colors.line, 'opacity-60')} />
                            <div className={cn('absolute top-3 left-3 w-4 h-[1px]', colors.line, 'opacity-40')} />
                            <div className={cn('absolute top-3 left-3 w-[1px] h-4', colors.line, 'opacity-40')} />
                        </div>
                        
                        {/* Top-right decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
                            <div className={cn('absolute top-0 right-0 w-12 h-[2px]', colors.line, 'opacity-60')} />
                            <div className={cn('absolute top-0 right-0 w-[2px] h-12', colors.line, 'opacity-60')} />
                        </div>
                        
                        {/* Bottom decorations */}
                        <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none">
                            <div className={cn('absolute bottom-0 left-0 w-12 h-[2px]', colors.line, 'opacity-60')} />
                            <div className={cn('absolute bottom-0 left-0 w-[2px] h-12', colors.line, 'opacity-60')} />
                        </div>
                        
                        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
                            <div className={cn('absolute bottom-0 right-0 w-12 h-[2px]', colors.line, 'opacity-60')} />
                            <div className={cn('absolute bottom-0 right-0 w-[2px] h-12', colors.line, 'opacity-60')} />
                        </div>
                    </>
                )}
                
                {/* Header section */}
                {showHeader && (
                    <div className={cn('flex items-center justify-between px-4 py-2 border-b', colors.border, 'bg-white/5')}>
                        <div className="flex items-center gap-3">
                            {/* Status indicator */}
                            <div className="flex items-center gap-2">
                                <div className={cn('w-2 h-2 rounded-full shadow-lg', statusColors[status])} />
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                                    {statusLabels[status]}
                                </span>
                            </div>
                            
                            {/* Title */}
                            {title && (
                                <>
                                    <div className="w-[1px] h-4 bg-white/20" />
                                    <h3 className={cn('text-sm font-mono font-medium uppercase tracking-wider', colors.text)}>
                                        {title}
                                    </h3>
                                </>
                            )}
                        </div>
                        
                        {/* Data readout */}
                        {dataReadout && (
                            <div className="text-[10px] font-mono text-white/40">
                                {dataReadout}
                            </div>
                        )}
                        
                        {/* Technical decorations */}
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                        </div>
                    </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 p-4">
                    {children}
                </div>
                
                {/* Bottom scan line */}
                <motion.div
                    className={cn('absolute bottom-0 left-0 right-0 h-[1px] opacity-30', colors.line)}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        );
    }
);

HUDPanel.displayName = 'HUDPanel';

export { HUDPanel };
