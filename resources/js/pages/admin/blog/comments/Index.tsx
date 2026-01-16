import { Head, Link, router } from '@inertiajs/react';
import { 
    MessageSquare, 
    Check, 
    X, 
    Trash2,
    Search,
    Filter,
    ArrowLeft,
    Mail,
    Clock,
    FileText,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

interface Post {
    id: number;
    title: string;
    slug: string;
}

interface Comment {
    id: number;
    user_name: string;
    user_email: string;
    comment_body: string;
    is_approved: boolean;
    ip_address: string | null;
    post: Post | null;
    time_ago: string;
    created_at: string;
}

interface PaginatedComments {
    data: Comment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    comments: PaginatedComments;
    filters: {
        status?: string;
        search?: string;
    };
    counts: {
        pending: number;
        approved: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Blog', href: '/admin/blog/posts' },
    { title: 'Comments', href: '/admin/blog/comments' },
];

export default function CommentsIndex({ comments, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleFilter = () => {
        router.get('/admin/blog/comments', {
            search: search || undefined,
            status: filterStatus || undefined,
        }, { preserveState: true });
    };

    const handleToggleApproval = (comment: Comment) => {
        router.post(`/admin/blog/comments/${comment.id}/toggle-approval`);
    };

    const handleDelete = (comment: Comment) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/admin/blog/comments/${comment.id}`);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === comments.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(comments.data.map(c => c.id));
        }
    };

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        router.post('/admin/blog/comments/bulk-approve', { ids: selectedIds }, {
            onSuccess: () => setSelectedIds([])
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedIds.length} comment(s)?`)) {
            router.post('/admin/blog/comments/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Comments" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                            <MessageSquare className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Comments</h1>
                            <p className="text-muted-foreground">
                                {counts.total} total • {counts.pending} pending • {counts.approved} approved
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/blog/posts">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Posts
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search comments..."
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
                            <option value="">All Comments</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={handleFilter}>
                            Apply
                        </Button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                        <span className="text-sm font-medium">
                            {selectedIds.length} selected
                        </span>
                        <Button size="sm" variant="outline" onClick={handleBulkApprove} className="gap-1">
                            <Check className="h-3 w-3" />
                            Approve All
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleBulkDelete} className="gap-1 text-red-600 hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                            Delete All
                        </Button>
                    </div>
                )}

                {/* Comments List */}
                {comments.data.length > 0 ? (
                    <div className="space-y-4">
                        {/* Select All */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === comments.data.length}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">Select all</span>
                        </div>

                        {comments.data.map((comment) => (
                            <div
                                key={comment.id}
                                className={`group rounded-xl border p-4 transition-colors ${
                                    comment.is_approved ? '' : 'border-yellow-500/30 bg-yellow-500/5'
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(comment.id)}
                                        onChange={() => handleSelect(comment.id)}
                                        className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary mt-1"
                                    />

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium">{comment.user_name}</span>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {comment.user_email}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {comment.time_ago}
                                            </span>
                                            {comment.is_approved ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                                                    <XCircle className="h-3 w-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm">{comment.comment_body}</p>

                                        {comment.post && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <FileText className="h-3 w-3" />
                                                <span>on</span>
                                                <Link
                                                    href={`/admin/blog/posts/${comment.post.id}/edit`}
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {comment.post.title}
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-start gap-1">
                                        <button
                                            onClick={() => handleToggleApproval(comment)}
                                            className={`rounded-lg p-2 transition-colors ${
                                                comment.is_approved
                                                    ? 'text-yellow-500 hover:bg-yellow-500/10'
                                                    : 'text-green-500 hover:bg-green-500/10'
                                            }`}
                                            title={comment.is_approved ? 'Unapprove' : 'Approve'}
                                        >
                                            {comment.is_approved ? (
                                                <X className="h-4 w-4" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment)}
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
                        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No comments yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Comments will appear here when visitors leave them on your posts.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {comments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {comments.links.map((link, index) => (
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
