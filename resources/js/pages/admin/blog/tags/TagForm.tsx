import { Head, useForm, router } from '@inertiajs/react';
import { 
    Tag, 
    Save, 
    ArrowLeft
} from 'lucide-react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface TagData {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    tag: TagData | null;
}

export default function TagForm({ tag }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog', href: '/admin/blog/posts' },
        { title: 'Tags', href: '/admin/blog/tags' },
        { title: tag ? 'Edit Tag' : 'New Tag', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: tag?.name || '',
        slug: tag?.slug || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (tag) {
            put(`/admin/blog/tags/${tag.id}`);
        } else {
            post('/admin/blog/tags');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={tag ? 'Edit Tag' : 'New Tag'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Tag className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {tag ? 'Edit Tag' : 'New Tag'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {tag ? 'Update tag details' : 'Create a new blog tag'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/blog/tags')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-md space-y-6">
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
                                placeholder="e.g., Python"
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
                                placeholder="e.g., python"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/blog/tags')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : tag ? 'Update Tag' : 'Create Tag'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
