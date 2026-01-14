/**
 * Blog Page
 * 
 * Futuristic blog listing with:
 * - Animated article cards
 * - Smooth scroll-entry effects
 * - Category filtering
 * - Search functionality
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';
import { GlassCard } from '@/components/ui/glass-card';
import { GlowButton } from '@/components/ui/glow-button';
import { staggerContainer, staggerItem } from '@/animations/transitions';

// Blog categories
const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'cv', label: 'Computer Vision' },
    { id: 'nlp', label: 'NLP & LLMs' },
    { id: 'research', label: 'Research Notes' },
    { id: 'tutorials', label: 'Tutorials' },
];

// Sample blog posts
const blogPosts = [
    {
        id: 1,
        title: 'Understanding Attention Mechanisms in Vision Transformers',
        excerpt: 'Deep dive into self-attention for image classification. How ViT processes patches and learns spatial relationships.',
        category: 'cv',
        date: '2024-01-10',
        readTime: '12 min read',
        tags: ['ViT', 'Transformers', 'Attention'],
        featured: true,
    },
    {
        id: 2,
        title: 'Building RAG Systems: Lessons from Production',
        excerpt: 'Practical insights on chunking strategies, embedding models, and retrieval optimization for LLM applications.',
        category: 'nlp',
        date: '2024-01-05',
        readTime: '10 min read',
        tags: ['RAG', 'LangChain', 'Vector DB'],
        featured: true,
    },
    {
        id: 3,
        title: 'CNN+LSTM for Human Activity Recognition: A Benchmark Study',
        excerpt: 'Comparing architectures for video-based HAR. Accuracy vs. inference speed trade-offs on UCF-101.',
        category: 'research',
        date: '2023-12-20',
        readTime: '15 min read',
        tags: ['HAR', 'CNN', 'LSTM', 'Research'],
        featured: false,
    },
    {
        id: 4,
        title: 'Grad-CAM: Making CNNs Explainable',
        excerpt: 'Step-by-step guide to implementing gradient-weighted class activation mapping for model interpretability.',
        category: 'tutorials',
        date: '2023-12-15',
        readTime: '8 min read',
        tags: ['Tutorial', 'Grad-CAM', 'XAI'],
        featured: false,
    },
    {
        id: 5,
        title: 'YOLO vs Faster R-CNN: When to Use Which',
        excerpt: 'Practical comparison of single-shot and two-stage detectors. Benchmarks on custom industrial datasets.',
        category: 'cv',
        date: '2023-12-10',
        readTime: '9 min read',
        tags: ['YOLO', 'Object Detection', 'Benchmarks'],
        featured: false,
    },
    {
        id: 6,
        title: 'Fine-tuning LLMs with LoRA: A Practical Guide',
        excerpt: 'Efficient adaptation of large language models using Low-Rank Adaptation. Reduced compute, comparable results.',
        category: 'nlp',
        date: '2023-12-05',
        readTime: '11 min read',
        tags: ['LLM', 'LoRA', 'Fine-tuning'],
        featured: false,
    },
];

// Format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Blog card component
function BlogCard({ post, index, featured = false }: { post: typeof blogPosts[0]; index: number; featured?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`group ${featured ? 'md:col-span-2' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/blog/${post.id}`}>
                <GlassCard
                    variant="default"
                    size="md"
                    hover="lift"
                    className="h-full"
                >
                    {/* Image placeholder */}
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-900/30 to-purple-900/30">
                        {/* Grid pattern */}
                        <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                            }}
                        />
                        
                        {/* Featured badge */}
                        {post.featured && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-xs font-mono uppercase">
                                Featured
                            </div>
                        )}
                        
                        {/* Category badge */}
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white/70 text-xs font-mono uppercase">
                            {post.category}
                        </div>
                        
                        {/* Hover scan line */}
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
                    <div className="flex items-center gap-3 text-white/40 text-xs font-mono mb-3">
                        <span>{formatDate(post.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                        {post.title}
                    </h3>
                    
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs font-mono text-white/50 bg-white/5 rounded border border-white/10"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    
                    {/* Read more indicator */}
                    <motion.div
                        className="flex items-center gap-2 mt-4 text-cyan-400 text-sm font-medium"
                        initial={{ x: 0 }}
                        animate={{ x: isHovered ? 5 : 0 }}
                    >
                        <span>Read Article</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.div>
                </GlassCard>
            </Link>
        </motion.article>
    );
}

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter posts based on category and search
    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
            const matchesSearch = !searchQuery || 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);
    
    // Separate featured and regular posts
    const featuredPosts = filteredPosts.filter(p => p.featured);
    const regularPosts = filteredPosts.filter(p => !p.featured);
    
    return (
        <PortfolioLayout transitionType="fadeScale">
            <Head title="Blog" />
            
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
                            // Research Notes & Insights
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
                            <GlitchText as="span" className="text-cyan-400">
                                Research Blog
                            </GlitchText>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Experiment notes, model comparisons, and practical insights from 
                            building computer vision and NLP systems.
                        </p>
                    </motion.div>
                    
                    {/* Search and filter */}
                    <motion.div
                        className="max-w-3xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {/* Search bar */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search research notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-4 pl-12 bg-white/5 border border-white/10 rounded-xl
                                           text-white placeholder-white/40 font-mono text-sm
                                           focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30
                                           transition-all duration-300"
                            />
                            <svg 
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        {/* Category filters */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`
                                        px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300
                                        ${activeCategory === category.id
                                            ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/50'
                                            : 'text-white/60 bg-white/5 border border-white/10 hover:text-white hover:border-white/30'
                                        }
                                    `}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {category.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Featured posts */}
                    {featuredPosts.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-lg font-mono text-cyan-400 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                Featured Posts
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {featuredPosts.map((post, index) => (
                                    <BlogCard key={post.id} post={post} index={index} featured />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Regular posts */}
                    {regularPosts.length > 0 && (
                        <div>
                            <h2 className="text-lg font-mono text-white/60 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white/40" />
                                All Posts
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {regularPosts.map((post, index) => (
                                        <BlogCard key={post.id} post={post} index={index} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                    
                    {/* Empty state */}
                    {filteredPosts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="text-5xl mb-4">📝</div>
                            <p className="text-white/50 text-lg mb-4">No posts found matching your criteria.</p>
                            <GlowButton
                                variant="ghost"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                            >
                                Clear Filters
                            </GlowButton>
                        </motion.div>
                    )}
                </div>
            </section>
            
            {/* Newsletter CTA */}
            <section className="relative py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard variant="gradient" size="lg" animatedBorder>
                            <div className="text-center">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                    Stay Updated on AI Research
                                </h2>
                                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                                    Subscribe for new research notes, model benchmarks, and practical ML insights.
                                </p>
                                
                                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                                                   text-white placeholder-white/40 text-sm
                                                   focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                                    />
                                    <GlowButton variant="cyan" type="submit">
                                        Subscribe
                                    </GlowButton>
                                </form>
                                
                                <p className="text-white/30 text-xs mt-4">
                                    No spam. Unsubscribe anytime.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>
        </PortfolioLayout>
    );
}
