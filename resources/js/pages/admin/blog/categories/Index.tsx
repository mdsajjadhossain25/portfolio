import { Head, Link, router } from '@inertiajs/react';
import { 
    Folder, 
    Plus, 
    Edit, 
    Trash2,
    FileText,
    ArrowLeft
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
    posts_count: number;
    created_at: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Blog', href: '/admin/blog/posts' },
    { title: 'Categories', href: '/admin/blog/categories' },
];

export default function CategoriesIndex({ categories }: Props) {
    const handleDelete = (category: Category) => {
        if (category.posts_count > 0) {
            alert(`Cannot delete category "${category.name}" because it has ${category.posts_count} post(s) attached.`);
            return;
        }
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(`/admin/blog/categories/${category.slug}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Categories" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                            <Folder className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Blog Categories</h1>
                            <p className="text-muted-foreground">
                                {categories.length} categories
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
                        <Link href="/admin/blog/categories/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Category
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Categories Table */}
                {categories.length > 0 ? (
                    <div className="rounded-xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium">Posts</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 font-medium">{category.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                                                {category.slug}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {category.description ? (
                                                <span className="line-clamp-1">{category.description}</span>
                                            ) : (
                                                <span className="italic opacity-50">No description</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                                                <FileText className="h-3 w-3" />
                                                {category.posts_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={`/admin/blog/categories/${category.slug}/edit`}
                                                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className={`rounded-lg p-2 text-muted-foreground ${
                                                        category.posts_count > 0
                                                            ? 'cursor-not-allowed opacity-50'
                                                            : 'hover:bg-red-500/10 hover:text-red-500'
                                                    }`}
                                                    disabled={category.posts_count > 0}
                                                    title={category.posts_count > 0 ? 'Cannot delete - has posts attached' : 'Delete category'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                        <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No categories yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Create your first blog category to organize posts.
                        </p>
                        <Link href="/admin/blog/categories/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Category
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
