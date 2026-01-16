/**
 * Projects Page
 * 
 * Showcase of portfolio projects with:
 * - Animated project cards
 * - Filter system with animations
 * - Hover reveals with cinematic effects
 * - Dynamic data from database
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

// Types
interface Project {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    project_type_id: number;
    project_type_slug: string;
    project_type_label: string;
    project_type_color: string;
    tech_stack: string[];
    tags: string[];
    thumbnail_url: string | null;
    github_url: string | null;
    live_url: string | null;
    paper_url: string | null;
    is_featured: boolean;
    status: string;
    status_label: string;
}

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Props {
    projects: Project[];
    featuredProjects: Project[];
    projectTypes: ProjectType[];
}

// Color mappings - dynamically match colors to tailwind classes
const colorToClassMap: Record<string, 'cyan' | 'purple' | 'green' | 'crimson' | 'orange' | 'blue' | 'pink' | 'yellow' | 'teal' | 'indigo'> = {
    cyan: 'cyan',
    purple: 'purple',
    green: 'green',
    crimson: 'crimson',
    orange: 'orange',
    blue: 'blue',
    pink: 'pink',
    yellow: 'yellow',
    teal: 'teal',
    indigo: 'indigo',
};

// Project card component
function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const color = colorToClassMap[project.project_type_color] || 'cyan';
    
    const colorClasses: Record<string, string> = {
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-500/60',
        purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-500/60',
        crimson: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-500/60',
        green: 'from-green-500/20 to-green-500/5 border-green-500/30 hover:border-green-500/60',
        orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 hover:border-orange-500/60',
        blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-500/60',
        pink: 'from-pink-400/20 to-pink-400/5 border-pink-400/30 hover:border-pink-400/60',
        yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/60',
        teal: 'from-teal-500/20 to-teal-500/5 border-teal-500/30 hover:border-teal-500/60',
        indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:border-indigo-500/60',
    };
    
    const glowColors: Record<string, string> = {
        cyan: 'shadow-[0_0_30px_rgba(0,255,255,0.2)]',
        purple: 'shadow-[0_0_30px_rgba(167,139,250,0.2)]',
        crimson: 'shadow-[0_0_30px_rgba(220,38,127,0.2)]',
        green: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',
        orange: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]',
        blue: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        pink: 'shadow-[0_0_30px_rgba(244,114,182,0.2)]',
        yellow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
        teal: 'shadow-[0_0_30px_rgba(20,184,166,0.2)]',
        indigo: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    };
    
    const bgGradients: Record<string, string> = {
        cyan: 'from-cyan-900/50 to-black',
        purple: 'from-purple-900/50 to-black',
        crimson: 'from-pink-900/50 to-black',
        green: 'from-green-900/50 to-black',
        orange: 'from-orange-900/50 to-black',
        blue: 'from-blue-900/50 to-black',
        pink: 'from-pink-900/50 to-black',
        yellow: 'from-yellow-900/50 to-black',
        teal: 'from-teal-900/50 to-black',
        indigo: 'from-indigo-900/50 to-black',
    };
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/projects/${project.slug}`}>
                <div
                    className={`
                        relative h-full rounded-xl overflow-hidden border
                        bg-gradient-to-br ${colorClasses[color] || colorClasses.cyan}
                        transition-all duration-500 cursor-pointer
                        ${isHovered ? (glowColors[color] || glowColors.cyan) : ''}
                    `}
                >
                    {/* Project image/preview area */}
                    <div className="relative aspect-video bg-black/50 overflow-hidden">
                        {/* Thumbnail or gradient placeholder */}
                        {project.thumbnail_url ? (
                            <img
                                src={project.thumbnail_url}
                                alt={project.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <>
                                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[color] || bgGradients.cyan}`} />
                                <div 
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '20px 20px',
                                    }}
                                />
                            </>
                        )}
                        
                        {/* Featured badge */}
                        {project.is_featured && (
                            <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-xs font-mono uppercase">
                                Featured
                            </div>
                        )}

                        {/* Status badge */}
                        {project.status === 'ongoing' && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 text-xs font-mono uppercase">
                                Ongoing
                            </div>
                        )}
                        
                        {/* Hover overlay with links */}
                        <motion.div
                            className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 text-cyan-400 font-mono text-sm"
                                initial={{ scale: 0 }}
                                animate={{ scale: isHovered ? 1 : 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span>View Details</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.div>
                        </motion.div>
                        
                        {/* Scan line effect on hover */}
                        <motion.div
                            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                            initial={{ top: '0%', opacity: 0 }}
                            animate={{
                                top: isHovered ? ['0%', '100%'] : '0%',
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{
                                top: { duration: 1.5, repeat: Infinity },
                                opacity: { duration: 0.3 },
                            }}
                        />
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                        {/* Type badge */}
                        <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-mono uppercase tracking-wider text-gray-600 dark:text-white/60 bg-gray-100/80 dark:bg-white/5 rounded border border-gray-200/50 dark:border-white/10">
                            {project.project_type_label}
                        </span>
                        
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-white/50 text-sm mb-4 line-clamp-2">
                            {project.short_description}
                        </p>
                        
                        {/* Tech Tags */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.tech_stack.slice(0, 4).map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 text-xs font-mono text-gray-600 dark:text-white/60 bg-gray-100/80 dark:bg-white/5 rounded border border-gray-200/50 dark:border-white/10"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {project.tech_stack.length > 4 && (
                                    <span className="px-2 py-1 text-xs font-mono text-gray-500 dark:text-white/40">
                                        +{project.tech_stack.length - 4}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Links row */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-500 dark:text-white/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                            {project.paper_url && (
                                <a
                                    href={project.paper_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-gray-500 dark:text-white/40 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-current opacity-30" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-current opacity-30" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-current opacity-30" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-current opacity-30" />
                </div>
            </Link>
        </motion.div>
    );
}

export default function Projects({ projects, projectTypes }: Props) {
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Build categories from projectTypes
    const categories = useMemo(() => {
        return [
            { id: 'all', label: 'All Projects' },
            ...projectTypes.map((type) => ({ id: type.slug, label: type.name })),
        ];
    }, [projectTypes]);
    
    // Filter projects based on active category
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projects;
        return projects.filter(p => p.project_type_slug === activeCategory);
    }, [activeCategory, projects]);
    
    return (
        <PortfolioLayout transitionType="glitch">
            <Head title="Projects" />
            
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // AI Projects Lab
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
                            AI{' '}
                            <GlitchText as="span" className="text-cyan-600 dark:text-cyan-400">
                                Projects
                            </GlitchText>
                        </h1>
                        <p className="text-gray-600 dark:text-white/50 text-lg max-w-2xl mx-auto">
                            Computer Vision, Deep Learning, and NLP systems. From research prototypes 
                            to production-ready AI solutions.
                        </p>
                    </motion.div>
                    
                    {/* Filter tabs */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-2 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`
                                    relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-mono text-xs sm:text-sm uppercase tracking-wider
                                    transition-all duration-300
                                    ${activeCategory === category.id
                                        ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/50'
                                        : 'text-gray-600 dark:text-white/60 bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30'
                                    }
                                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {category.label}
                                
                                {/* Active indicator */}
                                {activeCategory === category.id && (
                                    <motion.div
                                        className="absolute inset-0 rounded-lg border border-cyan-500/30"
                                        layoutId="category-active"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                    
                    {/* Projects grid */}
                    <motion.div
                        layout
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    
                    {/* Empty state */}
                    {filteredProjects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-white/50 text-lg">No projects found in this category.</p>
                            <p className="text-gray-500 dark:text-white/30 text-sm mt-2">Check back soon for new additions!</p>
                        </motion.div>
                    )}
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard variant="gradient" size="lg" animatedBorder>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Need an AI solution?
                            </h2>
                            <p className="text-gray-600 dark:text-white/60 mb-8 max-w-xl mx-auto">
                                I can help build custom CV models, integrate LLMs, or design 
                                end-to-end AI pipelines for your specific use case.
                            </p>
                            <Link href="/contact">
                                <GlowButton variant="cyan" size="lg" animatedBorder>
                                    Discuss Your Project
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </GlowButton>
                            </Link>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>
        </PortfolioLayout>
    );
}
