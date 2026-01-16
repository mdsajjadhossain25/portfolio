/**
 * ThemeToggle Component
 * 
 * A futuristic theme toggle button with:
 * - Animated sun/moon icons with smooth transitions
 * - Keyboard accessibility
 * - Consistent styling for both frontend and admin
 * - Subtle glow effects matching the cyberpunk aesthetic
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';

import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    /** Visual style variant */
    variant?: 'default' | 'minimal' | 'cyber';
    /** Size of the toggle */
    size?: 'sm' | 'md' | 'lg';
    /** Additional class names */
    className?: string;
    /** Show label text */
    showLabel?: boolean;
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
};

const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

export function ThemeToggle({ 
    variant = 'default',
    size = 'md',
    className,
    showLabel = false,
}: ThemeToggleProps) {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = useCallback(() => {
        // Toggle between light and dark (skip system on toggle)
        updateAppearance(isDark ? 'light' : 'dark');
    }, [isDark, updateAppearance]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    }, [toggleTheme]);

    const variantClasses = {
        default: cn(
            'rounded-lg border transition-all duration-300',
            'bg-white/5 dark:bg-black/50 backdrop-blur-md',
            'border-gray-300/50 dark:border-cyan-500/30',
            'hover:border-cyan-500/60 hover:bg-cyan-500/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50',
            'shadow-sm dark:shadow-[0_0_15px_rgba(0,255,255,0.1)]',
            'hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]',
        ),
        minimal: cn(
            'rounded-md transition-all duration-300',
            'hover:bg-gray-100 dark:hover:bg-white/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50',
        ),
        cyber: cn(
            'rounded-lg border-2 transition-all duration-300',
            'bg-gradient-to-br from-cyan-500/10 to-purple-500/10',
            'border-cyan-500/40 dark:border-cyan-500/40',
            'hover:border-cyan-400 hover:from-cyan-500/20 hover:to-purple-500/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
            'shadow-[0_0_20px_rgba(0,255,255,0.2)]',
            'hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]',
        ),
    };

    return (
        <motion.button
            onClick={toggleTheme}
            onKeyDown={handleKeyDown}
            className={cn(
                'relative flex items-center justify-center',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            role="switch"
            aria-checked={isDark}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Moon 
                            className={cn(
                                iconSizes[size],
                                'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]',
                            )} 
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Sun 
                            className={cn(
                                iconSizes[size],
                                'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
                            )} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle background glow effect */}
            <motion.div
                className={cn(
                    'absolute inset-0 rounded-lg opacity-0',
                    isDark 
                        ? 'bg-cyan-500/20' 
                        : 'bg-amber-500/20',
                )}
                animate={{
                    opacity: [0, 0.3, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Label (optional) */}
            {showLabel && (
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </motion.button>
    );
}

export default ThemeToggle;
