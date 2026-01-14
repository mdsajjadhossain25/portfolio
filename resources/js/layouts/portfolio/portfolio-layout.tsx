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
 */

import { ReactNode } from 'react';
import { AnimatedCursor } from '@/components/animated-cursor';
import { GameTransition, GameTransitionType } from '@/components/game-transition';
import { GameMenu } from '@/components/game-menu';
import { Footer } from '@/components/footer';
import { ParticleBackground } from '@/components/ui/particle-background';

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
    return (
        <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
            {/* Animated custom cursor */}
            <AnimatedCursor />
            
            {/* Particle background (only on non-map pages) */}
            {showParticles && !isMapPage && (
                <ParticleBackground
                    particleCount={40}
                    colors={['#00ffff', '#a78bfa', '#dc267f']}
                    showConnections={true}
                    connectionDistance={100}
                    gradientColors={['#000000', '#050510', '#0a0a1a', '#050510', '#000000']}
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
