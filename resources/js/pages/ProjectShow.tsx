/**
 * Project Detail Page
 * 
 * Full project showcase with:
 * - Cover image with parallax effect
 * - Detailed description
 * - Image gallery
 * - Features list
 * - Metrics display
 * - Video embeds
 * - Related projects
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';

// Types
interface ProjectImage {
    id: number;
    image_url: string;
    alt_text: string | null;
    caption: string | null;
}

interface ProjectFeature {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
}

interface ProjectMetric {
    id: number;
    name: string;
    value: string;
    description: string | null;
}

interface ProjectVideo {
    id: number;
    title: string;
    video_url: string;
    embed_url: string | null;
    platform: string;
    thumbnail_url: string | null;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    detailed_description: string | null;
    project_type_id: number;
    project_type_slug: string;
    project_type_label: string;
    project_type_color: string;
    tech_stack: string[];
    tags: string[];
    thumbnail_url: string | null;
    cover_url: string | null;
    github_url: string | null;
    live_url: string | null;
    paper_url: string | null;
    dataset_used: string | null;
    role: string | null;
    is_featured: boolean;
    status: string;
    status_label: string;
    images: ProjectImage[];
    features: ProjectFeature[];
    metrics: ProjectMetric[];
    videos: ProjectVideo[];
}

interface RelatedProject {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    project_type_label: string;
    project_type_color: string;
    thumbnail_url: string | null;
    tech_stack: string[];
}

interface Props {
    project: Project;
    relatedProjects: RelatedProject[];
}

// Color mapping for dynamic project type colors
const colorToClassMap: Record<string, string> = {
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

// Image gallery modal component
function ImageModal({ 
    images, 
    currentIndex, 
    onClose, 
    onNext, 
    onPrev 
}: { 
    images: ProjectImage[]; 
    currentIndex: number; 
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 p-3 text-white/60 hover:text-white transition-colors"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={images[currentIndex].image_url}
                alt={images[currentIndex].alt_text || ''}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />
            
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 p-3 text-white/60 hover:text-white transition-colors"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            {images[currentIndex].caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 rounded-lg">
                    <p className="text-white text-sm">{images[currentIndex].caption}</p>
                </div>
            )}
            
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded text-white text-sm font-mono">
                {currentIndex + 1} / {images.length}
            </div>
        </motion.div>
    );
}

export default function ProjectShow({ project, relatedProjects }: Props) {
    const color = colorToClassMap[project.project_type_color] || 'cyan';
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
    
    const openGallery = (index: number) => setGalleryIndex(index);
    const closeGallery = () => setGalleryIndex(null);
    const nextImage = () => {
        if (galleryIndex !== null) {
            setGalleryIndex((galleryIndex + 1) % project.images.length);
        }
    };
    const prevImage = () => {
        if (galleryIndex !== null) {
            setGalleryIndex((galleryIndex - 1 + project.images.length) % project.images.length);
        }
    };
    
    const colorClasses: Record<string, string> = {
        cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
        purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        green: 'text-green-400 border-green-500/30 bg-green-500/10',
        crimson: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
        orange: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
        blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        pink: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
        yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
        teal: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
        indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    };
    
    return (
        <PortfolioLayout transitionType="fadeScale">
            <Head title={project.title} />
            
            {/* Hero/Cover Section */}
            <section className="relative">
                {/* Cover Image or Gradient */}
                <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
                    {project.cover_url || project.thumbnail_url ? (
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            src={project.cover_url || project.thumbnail_url || ''}
                            alt={project.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className={`h-full w-full bg-gradient-to-br from-${color === 'cyan' ? 'cyan' : color === 'purple' ? 'purple' : color === 'green' ? 'green' : 'pink'}-900/30 to-black`} />
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Grid pattern */}
                    <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>
                
                {/* Back button */}
                <Link 
                    href="/projects"
                    className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg text-white/80 hover:text-white hover:border-white/30 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-mono text-sm">Back</span>
                </Link>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full border text-xs font-mono uppercase ${colorClasses[color]}`}>
                                    {project.project_type_label}
                                </span>
                                <span className={`px-3 py-1 rounded-full border text-xs font-mono uppercase ${
                                    project.status === 'completed' 
                                        ? 'text-green-400 border-green-500/30 bg-green-500/10' 
                                        : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                                }`}>
                                    {project.status_label}
                                </span>
                                {project.is_featured && (
                                    <span className="px-3 py-1 rounded-full border text-xs font-mono uppercase text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                                        Featured
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                <GlitchText>{project.title}</GlitchText>
                            </h1>
                            
                            <p className="text-white/80 text-lg max-w-3xl">
                                {project.short_description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Content */}
            <section className="relative py-12 lg:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Description */}
                            {project.detailed_description && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-[2px] bg-cyan-500 dark:bg-cyan-400" />
                                        About This Project
                                    </h2>
                                    <div className="prose dark:prose-invert prose-cyan max-w-none">
                                        <p className="text-neutral-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                                            {project.detailed_description}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Features */}
                            {project.features.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-[2px] bg-purple-500 dark:bg-purple-400" />
                                        Key Features
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {project.features.map((feature, index) => (
                                            <motion.div
                                                key={feature.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/30 transition-colors"
                                            >
                                                {feature.icon && (
                                                    <span className="text-2xl mb-2 block">{feature.icon}</span>
                                                )}
                                                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{feature.title}</h3>
                                                {feature.description && (
                                                    <p className="text-sm text-neutral-600 dark:text-white/50">{feature.description}</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Metrics */}
                            {project.metrics.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-[2px] bg-green-500 dark:bg-green-400" />
                                        Performance Metrics
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {project.metrics.map((metric, index) => (
                                            <motion.div
                                                key={metric.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                                className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 dark:border-green-500/20 dark:bg-green-500/5 text-center"
                                            >
                                                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 font-mono">
                                                    {metric.value}
                                                </div>
                                                <div className="text-sm text-neutral-600 dark:text-white/60 mt-1">{metric.name}</div>
                                                {metric.description && (
                                                    <div className="text-xs text-neutral-500 dark:text-white/40 mt-1">{metric.description}</div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Gallery */}
                            {project.images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-[2px] bg-cyan-500 dark:bg-cyan-400" />
                                        Gallery
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {project.images.map((image, index) => (
                                            <motion.button
                                                key={image.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.7 + index * 0.1 }}
                                                onClick={() => openGallery(index)}
                                                className="aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 hover:border-cyan-500/50 transition-colors group"
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={image.alt_text || `Gallery image ${index + 1}`}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Videos */}
                            {project.videos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-[2px] bg-red-500 dark:bg-red-400" />
                                        Demo Videos
                                    </h2>
                                    <div className="space-y-4">
                                        {project.videos.map((video) => (
                                            <div key={video.id} className="rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10">
                                                <div className="aspect-video">
                                                    {video.embed_url ? (
                                                        <iframe
                                                            src={video.embed_url}
                                                            title={video.title}
                                                            className="h-full w-full"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <a
                                                            href={video.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-full w-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors"
                                                        >
                                                            <span className="text-neutral-600 dark:text-white/60">Watch: {video.title}</span>
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="p-3 bg-neutral-100 dark:bg-white/5">
                                                    <h3 className="font-medium text-neutral-900 dark:text-white">{video.title}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        
                        {/* Sidebar */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="sticky top-8"
                            >
                                <GlassCard className="p-6">
                                    {/* Role */}
                                    {project.role && (
                                        <div className="mb-6">
                                            <h3 className="text-xs font-mono uppercase text-neutral-500 dark:text-white/40 mb-1">Role</h3>
                                            <p className="text-neutral-900 dark:text-white font-medium">{project.role}</p>
                                        </div>
                                    )}
                                    
                                    {/* Dataset */}
                                    {project.dataset_used && (
                                        <div className="mb-6">
                                            <h3 className="text-xs font-mono uppercase text-neutral-500 dark:text-white/40 mb-1">Dataset</h3>
                                            <p className="text-neutral-700 dark:text-white/80">{project.dataset_used}</p>
                                        </div>
                                    )}
                                    
                                    {/* Tech Stack */}
                                    {project.tech_stack.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-xs font-mono uppercase text-neutral-500 dark:text-white/40 mb-2">Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech_stack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-1 text-xs font-mono text-neutral-700 dark:text-white/70 bg-neutral-100 dark:bg-white/5 rounded border border-neutral-200 dark:border-white/10"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Tags */}
                                    {project.tags.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-xs font-mono uppercase text-neutral-500 dark:text-white/40 mb-2">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className={`px-2 py-1 text-xs rounded-full border ${colorClasses[color]}`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Links */}
                                    <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-white/10">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-colors text-neutral-700 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                                View on GitHub
                                            </a>
                                        )}
                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-cyan-400"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Live Demo
                                            </a>
                                        )}
                                        {project.paper_url && (
                                            <a
                                                href={project.paper_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors text-green-400"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Read Paper
                                            </a>
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="relative py-12 lg:py-20 border-t border-neutral-200 dark:border-white/10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">Related Projects</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProjects.map((related, index) => (
                                    <motion.div
                                        key={related.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link 
                                            href={`/projects/${related.slug}`}
                                            className="block group"
                                        >
                                            <div className="rounded-xl border border-neutral-200 dark:border-white/10 overflow-hidden hover:border-cyan-500/50 dark:hover:border-cyan-500/30 transition-colors">
                                                <div className="aspect-video bg-neutral-100 dark:bg-white/5 overflow-hidden">
                                                    {related.thumbnail_url ? (
                                                        <img
                                                            src={related.thumbnail_url}
                                                            alt={related.title}
                                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <svg className="w-12 h-12 text-neutral-400 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-white/40">
                                                        {related.project_type_label}
                                                    </span>
                                                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mt-1">
                                                        {related.title}
                                                    </h3>
                                                    <p className="text-sm text-neutral-600 dark:text-white/50 line-clamp-2 mt-1">
                                                        {related.short_description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
            
            {/* CTA */}
            <section className="relative py-12 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <GlassCard variant="gradient" size="lg" animatedBorder>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                                Interested in similar work?
                            </h2>
                            <p className="text-neutral-600 dark:text-white/60 mb-8 max-w-xl mx-auto">
                                Let's discuss how I can help bring your AI project to life.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/contact">
                                    <GlowButton variant="cyan" size="lg" animatedBorder>
                                        Get in Touch
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </GlowButton>
                                </Link>
                                <Link href="/projects">
                                    <GlowButton variant="ghost" size="lg">
                                        View All Projects
                                    </GlowButton>
                                </Link>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>
            
            {/* Gallery Modal */}
            <AnimatePresence>
                {galleryIndex !== null && project.images.length > 0 && (
                    <ImageModal
                        images={project.images}
                        currentIndex={galleryIndex}
                        onClose={closeGallery}
                        onNext={nextImage}
                        onPrev={prevImage}
                    />
                )}
            </AnimatePresence>
        </PortfolioLayout>
    );
}
