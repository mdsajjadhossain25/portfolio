import { Head, useForm, router } from '@inertiajs/react';
import { Zap, Save, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface SkillCategory {
    id: number;
    name: string;
    color: string;
}

interface Skill {
    id: number;
    skill_category_id: number;
    name: string;
    icon: string | null;
    tag: string | null;
    description: string | null;
    display_order: number;
    is_featured: boolean;
    is_active: boolean;
    category?: SkillCategory;
}

interface Props {
    skill: Skill | null;
    categories: SkillCategory[];
}

export default function SkillForm({ skill, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'About', href: '/admin/about' },
        { title: 'Skills', href: '/admin/about/skills' },
        { title: skill ? 'Edit Skill' : 'New Skill', href: '#' },
    ];

    // Get category from URL if creating new skill
    const urlParams = new URLSearchParams(window.location.search);
    const defaultCategoryId = urlParams.get('category') || '';

    const { data, setData, post, put, processing, errors } = useForm({
        skill_category_id: skill?.skill_category_id?.toString() || defaultCategoryId,
        name: skill?.name || '',
        icon: skill?.icon || '',
        tag: skill?.tag || '',
        description: skill?.description || '',
        display_order: skill?.display_order?.toString() || '0',
        is_featured: skill?.is_featured ?? false,
        is_active: skill?.is_active ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (skill) {
            put(`/admin/about/skills/${skill.id}`);
        } else {
            post('/admin/about/skills');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={skill ? 'Edit Skill' : 'New Skill'} />
            
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                            <Zap className="h-5 w-5 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {skill ? 'Edit Skill' : 'New Skill'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {skill ? 'Update skill details' : 'Add a new skill to your portfolio'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-xl border p-6">
                        <div className="grid gap-6">
                            {/* Category */}
                            <div>
                                <Label htmlFor="skill_category_id">Category *</Label>
                                <select
                                    id="skill_category_id"
                                    value={data.skill_category_id}
                                    onChange={(e) => setData('skill_category_id', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.skill_category_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.skill_category_id}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Skill Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., PyTorch, TensorFlow, YOLO"
                                    className="mt-1"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Icon */}
                            <div>
                                <Label htmlFor="icon">Icon (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    placeholder="🔥"
                                    className="mt-1"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Use an emoji as the skill icon
                                </p>
                                {errors.icon && (
                                    <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
                                )}
                            </div>

                            {/* Tag */}
                            <div>
                                <Label htmlFor="tag">Tag</Label>
                                <Input
                                    id="tag"
                                    value={data.tag}
                                    onChange={(e) => setData('tag', e.target.value)}
                                    placeholder="e.g., Primary, Expert, New"
                                    className="mt-1"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Optional label for the skill
                                </p>
                                {errors.tag && (
                                    <p className="mt-1 text-sm text-red-500">{errors.tag}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the skill..."
                                    rows={3}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
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

                            {/* Featured */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Featured Skill</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Highlight this skill on your portfolio
                                    </p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-500 peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show this skill on the public site
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
                            {processing ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
