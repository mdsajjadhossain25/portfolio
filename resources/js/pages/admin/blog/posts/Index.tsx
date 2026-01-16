import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, 
    Plus, 
    Edit, 
    Trash2, 
    Star, 
    Eye, 
    EyeOff,
    Search,
    Filter,
    Calendar,
    Clock,
    MessageSquare,
    BarChart3,
    Folder,
    Tags
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_url: string | null;
    author_name: string;
    reading_time: number;
    status: string;
    is_featured: boolean;
    views_count: number;
    published_at: string | null;
    formatted_date: string;
    categories: Category[];
    tags: Tag[];
    comments_count: number;
    created_at: string;
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    posts: PaginatedPosts;
    categories: Category[];
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
    statuses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Blog', href: '/admin/blog/posts' },
    { title: 'Posts', href: '/admin/blog/posts' },
];

const statusClasses: Record<string, string> = {
    published: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    draft: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
};

export default function PostsIndex({ posts, categories, filters, statuses }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterCategory, setFilterCategory] = useState(filters.category || '');

    const publishedCount = posts.data.filter(p => p.status === 'published').length;
    const draftCount = posts.data.filter(p => p.status === 'draft').length;

    const handleFilter = () => {
        router.get('/admin/blog/posts', {
            search: search || undefined,
            status: filterStatus || undefined,
            category: filterCategory || undefined,
        }, { preserveState: true });
    };

    const handleDelete = (post: Post) => {
        if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
            router.delete(`/admin/blog/posts/${post.id}`);
        }
    };

    const handleToggleFeatured = (post: Post) => {
        router.post(`/admin/blog/posts/${post.id}/toggle-featured`);
    };

    const handleTogglePublish = (post: Post) => {
        router.post(`/admin/blog/posts/${post.id}/toggle-publish`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Posts" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                            <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Blog Posts</h1>
                            <p className="text-muted-foreground">
                                {posts.total} posts • {publishedCount} published • {draftCount} drafts
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/blog/categories">
                            <Button variant="outline" className="gap-2">
                                <Folder className="h-4 w-4" />
                                Categories
                            </Button>
                        </Link>
                        <Link href="/admin/blog/tags">
                            <Button variant="outline" className="gap-2">
                                <Tags className="h-4 w-4" />
                                Tags
                            </Button>
                        </Link>
                        <Link href="/admin/blog/comments">
                            <Button variant="outline" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Comments
                            </Button>
                        </Link>
                        <Link href="/admin/blog/posts/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="">All Status</option>
                            {Object.entries(statuses).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                        <Button variant="outline" size="sm" onClick={handleFilter}>
                            Apply
                        </Button>
                    </div>
                </div>

                {/* Posts List */}
                {posts.data.length > 0 ? (
                    <div className="space-y-4">
                        {posts.data.map((post) => (
                            <div
                                key={post.id}
                                className={`group rounded-xl border transition-colors hover:bg-muted/50 ${
                                    post.status === 'draft' ? 'opacity-75' : ''
                                }`}
                            >
                                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                                    {/* Cover Image */}
                                    <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                        {post.cover_url ? (
                                            <img
                                                src={post.cover_url}
                                                alt={post.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{post.title}</h3>
                                            {post.is_featured && (
                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            )}
                                            <span className={`rounded-full border px-2 py-0.5 text-xs ${statusClasses[post.status]}`}>
                                                {statuses[post.status]}
                                            </span>
                                        </div>
                                        {post.excerpt && (
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {post.formatted_date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.reading_time} min read
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BarChart3 className="h-3 w-3" />
                                                {post.views_count} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" />
                                                {post.comments_count} comments
                                            </span>
                                        </div>
                                        {post.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories.map((cat) => (
                                                    <span
                                                        key={cat.id}
                                                        className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400"
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleToggleFeatured(post)}
                                            className={`rounded-lg p-2 transition-colors ${
                                                post.is_featured
                                                    ? 'bg-yellow-500/10 text-yellow-500'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                            title={post.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                        >
                                            <Star className={`h-4 w-4 ${post.is_featured ? 'fill-current' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => handleTogglePublish(post)}
                                            className={`rounded-lg p-2 transition-colors ${
                                                post.status === 'published'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                            title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                                        >
                                            {post.status === 'published' ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/admin/blog/posts/${post.id}/edit`}
                                            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post)}
                                            className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No posts yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Get started by creating your first blog post.
                        </p>
                        <Link href="/admin/blog/posts/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Post
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {posts.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                        ? 'hover:bg-muted'
                                        : 'cursor-not-allowed opacity-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
