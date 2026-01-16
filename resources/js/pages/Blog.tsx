/**
 * Blog Page
 * 
 * Blog listing with:
 * - Featured post highlight
 * - Animated post cards
 * - Category/tag filters
 * - Search functionality
 * - Pagination
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Head, Link, router } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';
import { GlitchText } from '@/components/ui/glitch-text';

interface Category {
    name: string;
    slug: string;
    posts_count: number;
}

interface Tag {
    name: string;
    slug: string;
    posts_count: number;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_url: string | null;
    author_name: string;
    reading_time_text: string;
    formatted_date: string;
    categories: Category[];
    tags: Tag[];
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    featuredPost: Post | null;
    posts: PaginatedPosts;
    categories: Category[];
    tags: Tag[];
    filters: {
        category?: string;
        tag?: string;
        search?: string;
    };
}

// Featured post component
function FeaturedPost({ post }: { post: Post }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
        >
                        <div className="mb-4 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-cyan-500" />
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Featured Post</span>
            </div>            <Link href={`/blog/${post.slug}`}>
                <motion.div
                    className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid md:grid-cols-2 gap-6 p-6 lg:p-8">
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-black/50">
                            {post.cover_url ? (
                                <img
                                    src={post.cover_url}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-900/50 to-black">
                                    <svg className="h-16 w-16 text-cyan-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center space-y-4">
                            {post.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.categories.map((cat) => (
                                        <span
                                            key={cat.slug}
                                            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                {post.title}
                            </h2>

                            {post.excerpt && (
                                <p className="text-gray-600 dark:text-neutral-400 line-clamp-3">
                                    {post.excerpt}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                                <span>{post.formatted_date}</span>
                                <span>•</span>
                                <span>{post.reading_time_text}</span>
                            </div>

                            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                                <span>Read Article</span>
                                <motion.svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    animate={{ x: isHovered ? 4 : 0 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{
                            boxShadow: isHovered
                                ? '0 0 60px rgba(0, 255, 255, 0.2), inset 0 0 60px rgba(0, 255, 255, 0.05)'
                                : '0 0 0 rgba(0, 255, 255, 0)',
                        }}
                    />
                </motion.div>
            </Link>
        </motion.div>
    );
}

// Post card component
function PostCard({ post, index }: { post: Post; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`}>
                <motion.div
                    className="group relative h-full rounded-xl overflow-hidden border border-gray-200/50 dark:border-neutral-800 bg-gradient-to-br from-gray-50 dark:from-neutral-900 to-white dark:to-black hover:border-cyan-500/50 transition-all duration-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ y: -5 }}
                >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                        {post.cover_url ? (
                            <img
                                src={post.cover_url}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                                <svg className="h-12 w-12 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>

                    <div className="p-5 space-y-3">
                        {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {post.categories.slice(0, 2).map((cat) => (
                                    <span
                                        key={cat.slug}
                                        className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        {post.excerpt && (
                            <p className="text-sm text-gray-600 dark:text-neutral-500 line-clamp-2">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-600 pt-2 border-t border-gray-200/50 dark:border-neutral-800">
                            <span>{post.formatted_date}</span>
                            <span>{post.reading_time_text}</span>
                        </div>
                    </div>

                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        animate={{
                            boxShadow: isHovered
                                ? '0 0 30px rgba(0, 255, 255, 0.15)'
                                : '0 0 0 rgba(0, 255, 255, 0)',
                        }}
                    />
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default function Blog({ featuredPost, posts, categories, tags, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedTag, setSelectedTag] = useState(filters.tag || '');

    const handleFilter = () => {
        router.get('/blog', {
            search: search || undefined,
            category: selectedCategory || undefined,
            tag: selectedTag || undefined,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedTag('');
        router.get('/blog');
    };

    const hasFilters = search || selectedCategory || selectedTag;

    return (
        <PortfolioLayout>
            <Head title="Blog - AI Engineering & Research">
                <meta name="description" content="Articles on AI, Machine Learning, Deep Learning, and software engineering. Thoughts and insights from an AI Engineer." />
                <meta property="og:title" content="Blog - AI Engineering & Research" />
                <meta property="og:description" content="Articles on AI, Machine Learning, Deep Learning, and software engineering." />
                <meta property="og:type" content="website" />
            </Head>

            <div className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500" />
                            <span className="font-mono text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                                Knowledge Base
                            </span>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <GlitchText as="span" className="text-gray-900 dark:text-white">
                                Blog & Articles
                            </GlitchText>
                        </h1>

                        <p className="text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Thoughts, tutorials, and insights on AI, Machine Learning, 
                            software engineering, and the future of technology.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        className="mb-8 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    placeholder="Search articles..."
                                    className="w-full rounded-lg border border-gray-200/50 dark:border-neutral-800 bg-gray-50 dark:bg-black/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-5 py-2.5 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setTimeout(handleFilter, 0);
                                }}
                                className="rounded-lg border border-gray-200/50 dark:border-neutral-800 bg-gray-50 dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name} ({cat.posts_count})
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedTag}
                                onChange={(e) => {
                                    setSelectedTag(e.target.value);
                                    setTimeout(handleFilter, 0);
                                }}
                                className="rounded-lg border border-gray-200/50 dark:border-neutral-800 bg-gray-50 dark:bg-black/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">All Tags</option>
                                {tags.map((tag) => (
                                    <option key={tag.slug} value={tag.slug}>
                                        {tag.name} ({tag.posts_count})
                                    </option>
                                ))}
                            </select>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-lg border border-gray-200/50 dark:border-neutral-800 bg-gray-50 dark:bg-black/50 px-3 py-2 text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Featured Post */}
                    {featuredPost && !hasFilters && (
                        <FeaturedPost post={featuredPost} />
                    )}

                    {/* Posts Grid */}
                    {posts.data.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {posts.data.map((post, index) => (
                                        <PostCard key={post.id} post={post} index={index} />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {posts.last_page > 1 && (
                                <motion.div
                                    className="mt-12 flex items-center justify-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {posts.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`
                                                rounded-lg px-4 py-2 text-sm font-medium transition-all
                                                ${link.active
                                                    ? 'bg-cyan-500 text-black'
                                                    : link.url
                                                    ? 'border border-neutral-800 text-neutral-400 hover:border-cyan-500/50 hover:text-cyan-400'
                                                    : 'text-neutral-600 cursor-not-allowed'
                                                }
                                            `}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <svg
                                className="mx-auto h-16 w-16 text-neutral-700 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                            <p className="text-gray-600 dark:text-neutral-500">
                                {hasFilters
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'Check back soon for new articles!'}
                            </p>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-cyan-400 hover:text-cyan-300"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </PortfolioLayout>
    );
}
