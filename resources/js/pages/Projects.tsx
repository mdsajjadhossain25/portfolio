/**
 * Projects Page
 * 
 * Showcase of portfolio projects with:
 * - Animated project cards
 * - Filter system with animations
 * - Hover reveals with cinematic effects
 * - Modal/detail view transitions
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { staggerContainer, staggerItem } from '@/animations/transitions';

// Project categories
const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'cv', label: 'Computer Vision' },
    { id: 'nlp', label: 'NLP / LLM' },
    { id: 'har', label: 'Activity Recognition' },
    { id: 'integration', label: 'AI Integration' },
];

// Sample projects data
const projects = [
    {
        id: 1,
        title: 'Human Activity Recognition System',
        description: 'CNN+LSTM architecture for video-based activity classification. Achieved 94.2% accuracy on UCF-101 dataset with real-time inference.',
        category: 'har',
        tags: ['PyTorch', 'CNN', 'LSTM', 'Video Analysis'],
        image: null,
        color: 'cyan' as const,
        featured: true,
        link: '#',
        github: '#',
    },
    {
        id: 2,
        title: 'YOLO-based Object Detection Pipeline',
        description: 'Custom-trained YOLOv8 model for industrial defect detection. Deployed on edge devices with TensorRT optimization.',
        category: 'cv',
        tags: ['YOLOv8', 'TensorRT', 'Edge AI', 'OpenCV'],
        image: null,
        color: 'purple' as const,
        featured: true,
        link: '#',
        github: '#',
    },
    {
        id: 3,
        title: 'Medical Image Segmentation',
        description: 'U-Net architecture for tumor segmentation in MRI scans. Dice coefficient of 0.89 on BraTS dataset.',
        category: 'cv',
        tags: ['U-Net', 'Medical AI', 'Segmentation', 'TensorFlow'],
        image: null,
        color: 'green' as const,
        featured: false,
        link: '#',
    },
    {
        id: 4,
        title: 'RAG-powered Document QA System',
        description: 'LangChain-based retrieval system with GPT-4 for enterprise document search. Vector embeddings with ChromaDB.',
        category: 'nlp',
        tags: ['LangChain', 'RAG', 'GPT-4', 'ChromaDB'],
        image: null,
        color: 'crimson' as const,
        featured: true,
        link: '#',
        github: '#',
    },
    {
        id: 5,
        title: 'Face Verification System',
        description: 'Siamese network with triplet loss for face verification. ArcFace embeddings with 99.1% accuracy on LFW.',
        category: 'cv',
        tags: ['Face Recognition', 'ArcFace', 'Metric Learning'],
        image: null,
        color: 'purple' as const,
        featured: false,
        link: '#',
    },
    {
        id: 6,
        title: 'AI-Powered Web Analytics',
        description: 'Django + React platform with integrated anomaly detection for user behavior analysis using Isolation Forest.',
        category: 'integration',
        tags: ['Django', 'React', 'Anomaly Detection', 'REST API'],
        image: null,
        color: 'cyan' as const,
        featured: false,
        link: '#',
        github: '#',
    },
];

// Project card component
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const colorClasses = {
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-500/60',
        purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-500/60',
        crimson: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-500/60',
        green: 'from-green-500/20 to-green-500/5 border-green-500/30 hover:border-green-500/60',
    };
    
    const glowColors = {
        cyan: 'shadow-[0_0_30px_rgba(0,255,255,0.2)]',
        purple: 'shadow-[0_0_30px_rgba(167,139,250,0.2)]',
        crimson: 'shadow-[0_0_30px_rgba(220,38,127,0.2)]',
        green: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',
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
            <div
                className={`
                    relative h-full rounded-xl overflow-hidden border
                    bg-gradient-to-br ${colorClasses[project.color]}
                    transition-all duration-500
                    ${isHovered ? glowColors[project.color] : ''}
                `}
            >
                {/* Project image/preview area */}
                <div className="relative aspect-video bg-black/50 overflow-hidden">
                    {/* Placeholder gradient */}
                    <div className={`
                        absolute inset-0 bg-gradient-to-br 
                        ${project.color === 'cyan' ? 'from-cyan-900/50 to-black' : ''}
                        ${project.color === 'purple' ? 'from-purple-900/50 to-black' : ''}
                        ${project.color === 'crimson' ? 'from-pink-900/50 to-black' : ''}
                        ${project.color === 'green' ? 'from-green-900/50 to-black' : ''}
                    `} />
                    
                    {/* Grid pattern */}
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
                    
                    {/* Featured badge */}
                    {project.featured && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-xs font-mono uppercase">
                            Featured
                        </div>
                    )}
                    
                    {/* Hover overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {project.link && (
                            <motion.a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/50
                                           flex items-center justify-center text-cyan-400
                                           hover:bg-cyan-500/30 transition-colors"
                                initial={{ scale: 0 }}
                                animate={{ scale: isHovered ? 1 : 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </motion.a>
                        )}
                        {project.github && (
                            <motion.a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 border border-white/20
                                           flex items-center justify-center text-white/80
                                           hover:bg-white/20 transition-colors"
                                initial={{ scale: 0 }}
                                animate={{ scale: isHovered ? 1 : 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </motion.a>
                        )}
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
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs font-mono text-white/60 bg-white/5 rounded border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-current opacity-30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-current opacity-30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-current opacity-30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-current opacity-30" />
            </div>
        </motion.div>
    );
}

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Filter projects based on active category
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projects;
        return projects.filter(p => p.category === activeCategory);
    }, [activeCategory]);
    
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
                        <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">
                            // AI Projects Lab
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                            AI{' '}
                            <GlitchText as="span" className="text-cyan-400">
                                Projects
                            </GlitchText>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
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
                                    relative px-5 py-2.5 rounded-lg font-mono text-sm uppercase tracking-wider
                                    transition-all duration-300
                                    ${activeCategory === category.id
                                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/50'
                                        : 'text-white/60 bg-white/5 border border-white/10 hover:text-white hover:border-white/30'
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
                            <p className="text-white/50 text-lg">No projects found in this category.</p>
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
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                Need an AI solution?
                            </h2>
                            <p className="text-white/60 mb-8 max-w-xl mx-auto">
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
