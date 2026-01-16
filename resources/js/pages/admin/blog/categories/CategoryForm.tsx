import { Head, useForm, router } from '@inertiajs/react';
import { 
    Folder, 
    Save, 
    ArrowLeft
} from 'lucide-react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
}

interface Props {
    category: Category | null;
}

export default function CategoryForm({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog', href: '/admin/blog/posts' },
        { title: 'Categories', href: '/admin/blog/categories' },
        { title: category ? 'Edit Category' : 'New Category', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        display_order: category?.display_order || 0,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (category) {
            put(`/admin/blog/categories/${category.id}`);
        } else {
            post('/admin/blog/categories');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={category ? 'Edit Category' : 'New Category'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <Folder className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {category ? 'Edit Category' : 'New Category'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {category ? 'Update category details' : 'Create a new blog category'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/blog/categories')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <div className="rounded-xl border p-6 space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., Machine Learning"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-muted-foreground">(auto-generated if empty)</span>
                            </Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="e.g., machine-learning"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-muted-foreground">(optional)</span>
                            </Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="A brief description of this category..."
                                rows={3}
                                className="w-full px-3 py-2 border border-input bg-transparent rounded-lg focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Display Order */}
                        <div className="space-y-2">
                            <Label htmlFor="display_order">
                                Display Order
                            </Label>
                            <Input
                                id="display_order"
                                type="number"
                                min="0"
                                value={data.display_order}
                                onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                className="w-32"
                            />
                            {errors.display_order && (
                                <p className="text-sm text-red-500">{errors.display_order}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/blog/categories')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
