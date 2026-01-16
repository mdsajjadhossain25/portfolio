/**
 * Portfolio Layout Component
 * 
 * Main layout wrapper for all portfolio pages.
 * Includes:
 * - Animated cursor
 * - Game-style page transitions
 * - Floating HUD game menu (replaces traditional navbar)
 * - Footer
 * - Particle background
 * - Light/Dark mode support
 */

import { ReactNode } from 'react';
import { AnimatedCursor } from '@/components/animated-cursor';
import { GameTransition, GameTransitionType } from '@/components/game-transition';
import { GameMenu } from '@/components/game-menu';
import { Footer } from '@/components/footer';
import { ParticleBackground } from '@/components/ui/particle-background';
import { useAppearance } from '@/hooks/use-appearance';

interface PortfolioLayoutProps {
    children: ReactNode;
    /** Type of page transition */
    transitionType?: GameTransitionType;
    /** Whether to show particle background */
    showParticles?: boolean;
    /** Whether to show footer */
    showFooter?: boolean;
    /** Whether to show the game menu */
    showGameMenu?: boolean;
    /** Custom class for main content */
    className?: string;
    /** Whether this is the home/map page (full height, no padding) */
    isMapPage?: boolean;
}

export default function PortfolioLayout({
    children,
    transitionType = 'warp',
    showParticles = true,
    showFooter = true,
    showGameMenu = true,
    className = '',
    isMapPage = false,
}: PortfolioLayoutProps) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    
    // Theme-aware particle colors
    const particleColors = isDark 
        ? ['#00ffff', '#a78bfa', '#dc267f'] 
        : ['#0891b2', '#7c3aed', '#db2777'];
    
    // Theme-aware gradient colors for particle background
    const gradientColors = isDark
        ? ['#000000', '#050510', '#0a0a1a', '#050510', '#000000']
        : ['#f8fafc', '#f1f5f9', '#e2e8f0', '#f1f5f9', '#f8fafc'];
    
    return (
        <div className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300">
            {/* Animated custom cursor */}
            <AnimatedCursor />
            
            {/* Particle background (only on non-map pages) */}
            {showParticles && !isMapPage && (
                <ParticleBackground
                    particleCount={40}
                    colors={particleColors}
                    showConnections={true}
                    connectionDistance={100}
                    gradientColors={gradientColors}
                />
            )}
            
            {/* Floating HUD Game Menu (replaces navbar) */}
            {showGameMenu && <GameMenu />}
            
            {/* Main content with game-style transitions */}
            <GameTransition transitionType={transitionType}>
                <main className={`relative ${isMapPage ? '' : 'pt-4'} ${className}`}>
                    {children}
                </main>
                
                {/* Footer (only on non-map pages) */}
                {showFooter && !isMapPage && <Footer />}
            </GameTransition>
        </div>
    );
}
