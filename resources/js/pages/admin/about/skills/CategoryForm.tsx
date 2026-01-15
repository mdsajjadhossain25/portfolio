import { Head, useForm, router } from '@inertiajs/react';
import { Layers, Save, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface SkillCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string;
    display_order: number;
    is_active: boolean;
}

interface Props {
    category: SkillCategory | null;
}

export default function CategoryForm({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'About', href: '/admin/about' },
        { title: 'Skills', href: '/admin/about/skills' },
        { title: category ? 'Edit Category' : 'New Category', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        icon: category?.icon || '',
        color: category?.color || 'cyan',
        display_order: category?.display_order?.toString() || '0',
        is_active: category?.is_active ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (category) {
            put(`/admin/about/skills/categories/${category.id}`);
        } else {
            post('/admin/about/skills/categories');
        }
    };

    const colors = [
        { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
        { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { value: 'green', label: 'Green', class: 'bg-green-500' },
        { value: 'crimson', label: 'Crimson', class: 'bg-pink-500' },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={category ? 'Edit Category' : 'New Category'} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.visit('/admin/about/skills')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Layers className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {category ? 'Edit Category' : 'New Category'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {category ? 'Update skill category details' : 'Create a new skill category'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-xl border p-6">
                        <div className="grid gap-6">
                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., AI & Machine Learning"
                                    className="mt-1"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="ai-machine-learning (auto-generated if empty)"
                                    className="mt-1"
                                />
                                {errors.slug && (
                                    <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of this skill category..."
                                    rows={3}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            {/* Icon */}
                            <div>
                                <Label htmlFor="icon">Icon (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    placeholder="🤖"
                                    className="mt-1"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Use an emoji as the category icon
                                </p>
                                {errors.icon && (
                                    <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <Label>Color Theme</Label>
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <label
                                            key={color.value}
                                            className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                                                data.color === color.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted/50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="color"
                                                value={color.value}
                                                checked={data.color === color.value}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`h-4 w-4 rounded-full ${color.class}`} />
                                            <span className="text-sm">{color.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.color && (
                                    <p className="mt-1 text-sm text-red-500">{errors.color}</p>
                                )}
                            </div>

                            {/* Display Order */}
                            <div>
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    min="0"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                    className="mt-1 w-32"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                                {errors.display_order && (
                                    <p className="mt-1 text-sm text-red-500">{errors.display_order}</p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show this category on the public site
                                    </p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/about/skills')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
