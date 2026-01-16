/**
 * Blog Post Detail Page
 * 
 * Full blog post with:
 * - Clean typography for reading
 * - Markdown content rendering
 * - Social sharing buttons
 * - Comment system
 * - Related posts
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Head, Link, useForm } from '@inertiajs/react';
import { PortfolioLayout } from '@/layouts/portfolio';

interface Category {
    name: string;
    slug: string;
}

interface Tag {
    name: string;
    slug: string;
}

interface Comment {
    id: number;
    user_name: string;
    comment_body: string;
    time_ago: string;
    formatted_date: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_url: string | null;
    author_name: string;
    reading_time_text: string;
    formatted_date: string;
    views_count: number;
    categories: Category[];
    tags: Tag[];
    comments: Comment[];
    comments_count: number;
    twitter_share_url: string;
    linkedin_share_url: string;
    facebook_share_url: string;
    url: string;
    meta_title: string;
    meta_description: string;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_url: string | null;
    reading_time_text: string;
    formatted_date: string;
}

interface Props {
    post: Post;
    relatedPosts: RelatedPost[];
}

// Simple markdown-like content renderer
function ContentRenderer({ content }: { content: string }) {
    // Basic markdown to HTML conversion for display
    const renderContent = (text: string) => {
        // This is a simplified renderer - in production, use a proper Markdown library
        let html = text
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-neutral-900 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-cyan-400">$2</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-neutral-800 px-1.5 py-0.5 rounded text-cyan-400 text-sm">$1</code>')
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-12 mb-6">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener">$1</a>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 my-4 text-neutral-400 italic">$1</blockquote>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
            // Line breaks
            .replace(/\n/g, '<br />');

        return `<p class="mb-4 leading-relaxed">${html}</p>`;
    };

    return (
        <div 
            className="prose prose-invert prose-lg max-w-none text-neutral-300"
            dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        />
    );
}

// Share button component
function ShareButton({ 
    href, 
    icon, 
    label, 
    bgColor 
}: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    bgColor: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 ${bgColor}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
}

// Comment form component
function CommentForm({ postId }: { postId: number }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_name: '',
        user_email: '',
        comment_body: '',
        honeypot: '', // Anti-spam field
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/blog/${postId}/comment`, {
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center"
            >
                <svg className="mx-auto h-12 w-12 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-white mb-1">Thank you!</h4>
                <p className="text-sm text-neutral-400">Your comment has been submitted and is pending approval.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-cyan-400 text-sm hover:text-cyan-300"
                >
                    Submit another comment
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from users, traps bots */}
            <input
                type="text"
                name="honeypot"
                value={data.honeypot}
                onChange={(e) => setData('honeypot', e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <input
                        type="text"
                        value={data.user_name}
                        onChange={(e) => setData('user_name', e.target.value)}
                        placeholder="Your name *"
                        className="w-full rounded-lg border border-neutral-800 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                        required
                    />
                    {errors.user_name && (
                        <p className="mt-1 text-sm text-red-400">{errors.user_name}</p>
                    )}
                </div>
                <div>
                    <input
                        type="email"
                        value={data.user_email}
                        onChange={(e) => setData('user_email', e.target.value)}
                        placeholder="Your email *"
                        className="w-full rounded-lg border border-neutral-800 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                        required
                    />
                    {errors.user_email && (
                        <p className="mt-1 text-sm text-red-400">{errors.user_email}</p>
                    )}
                </div>
            </div>

            <div>
                <textarea
                    value={data.comment_body}
                    onChange={(e) => setData('comment_body', e.target.value)}
                    placeholder="Your comment *"
                    rows={4}
                    className="w-full rounded-lg border border-neutral-800 bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none resize-none"
                    required
                    minLength={5}
                    maxLength={2000}
                />
                {errors.comment_body && (
                    <p className="mt-1 text-sm text-red-400">{errors.comment_body}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-medium text-black hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
                {processing ? 'Submitting...' : 'Submit Comment'}
            </button>
        </form>
    );
}

// Related post card
function RelatedPostCard({ post }: { post: RelatedPost }) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <motion.div
                className="group rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden hover:border-cyan-500/50 transition-colors"
                whileHover={{ y: -5 }}
            >
                <div className="aspect-[16/9] overflow-hidden bg-neutral-900">
                    {post.cover_url ? (
                        <img
                            src={post.cover_url}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                            <svg className="h-8 w-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                    </h4>
                    <p className="mt-2 text-xs text-neutral-500">
                        {post.formatted_date} • {post.reading_time_text}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}

export default function BlogShow({ post, relatedPosts }: Props) {
    return (
        <PortfolioLayout>
            <Head title={post.meta_title}>
                <meta name="description" content={post.meta_description} />
                <meta property="og:title" content={post.meta_title} />
                <meta property="og:description" content={post.meta_description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={post.url} />
                {post.cover_url && <meta property="og:image" content={post.cover_url} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.meta_title} />
                <meta name="twitter:description" content={post.meta_description} />
            </Head>

            <article className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    {/* Back link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Blog
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10"
                    >
                        {/* Categories */}
                        {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/blog?category=${cat.slug}`}
                                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                    {post.author_name.charAt(0)}
                                </div>
                                {post.author_name}
                            </span>
                            <span>•</span>
                            <span>{post.formatted_date}</span>
                            <span>•</span>
                            <span>{post.reading_time_text}</span>
                            <span>•</span>
                            <span>{post.views_count} views</span>
                        </div>
                    </motion.header>

                    {/* Cover Image */}
                    {post.cover_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-10 overflow-hidden rounded-2xl"
                        >
                            <img
                                src={post.cover_url}
                                alt={post.title}
                                className="w-full aspect-video object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <ContentRenderer content={post.content} />
                    </motion.div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-10 flex flex-wrap gap-2"
                        >
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.slug}
                                    href={`/blog?tag=${tag.slug}`}
                                    className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}

                    {/* Share */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6"
                    >
                        <h3 className="text-sm font-medium text-neutral-400 mb-4">Share this article</h3>
                        <div className="flex flex-wrap gap-3">
                            <ShareButton
                                href={post.twitter_share_url}
                                bgColor="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
                                label="Twitter"
                                icon={
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                }
                            />
                            <ShareButton
                                href={post.linkedin_share_url}
                                bgColor="bg-[#0A66C2] hover:bg-[#094d92]"
                                label="LinkedIn"
                                icon={
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                }
                            />
                            <ShareButton
                                href={post.facebook_share_url}
                                bgColor="bg-[#1877F2] hover:bg-[#166fe5]"
                                label="Facebook"
                                icon={
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                }
                            />
                        </div>
                    </motion.div>

                    {/* Comments Section */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Comments ({post.comments_count})
                        </h2>

                        {/* Comment Form */}
                        <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                            <h3 className="font-medium text-white mb-4">Leave a comment</h3>
                            <CommentForm postId={post.id} />
                        </div>

                        {/* Comments List */}
                        {post.comments.length > 0 ? (
                            <div className="space-y-4">
                                {post.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                                                {comment.user_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-medium text-white">{comment.user_name}</span>
                                                <span className="text-xs text-neutral-500 ml-2">{comment.time_ago}</span>
                                            </div>
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed">{comment.comment_body}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 text-center py-8">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        )}
                    </motion.section>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedPosts.map((relatedPost) => (
                                    <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>
            </article>
        </PortfolioLayout>
    );
}
