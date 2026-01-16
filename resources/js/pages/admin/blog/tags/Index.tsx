import { Head, Link, router } from '@inertiajs/react';
import { 
    Tags, 
    Plus, 
    Edit, 
    Trash2,
    FileText,
    ArrowLeft
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
    created_at: string;
}

interface Props {
    tags: Tag[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Blog', href: '/admin/blog/posts' },
    { title: 'Tags', href: '/admin/blog/tags' },
];

export default function TagsIndex({ tags }: Props) {
    const handleDelete = (tag: Tag) => {
        if (confirm(`Are you sure you want to delete "${tag.name}"? It will be removed from all posts.`)) {
            router.delete(`/admin/blog/tags/${tag.slug}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Tags" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <Tags className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Blog Tags</h1>
                            <p className="text-muted-foreground">
                                {tags.length} tags
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/blog/posts">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Posts
                            </Button>
                        </Link>
                        <Link href="/admin/blog/tags/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Tag
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tags Grid */}
                {tags.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="group rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-medium">{tag.name}</h3>
                                        <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {tag.slug}
                                        </code>
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                                        <FileText className="h-3 w-3" />
                                        {tag.posts_count}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/blog/tags/${tag.slug}/edit`}
                                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(tag)}
                                        className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <Tags className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No tags yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Create your first blog tag.
                        </p>
                        <Link href="/admin/blog/tags/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Tag
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
