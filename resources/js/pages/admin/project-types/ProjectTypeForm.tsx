import { Head, useForm, router } from '@inertiajs/react';
import { 
    Palette, 
    Save, 
    ArrowLeft
} from 'lucide-react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon: string | null;
    description: string | null;
    display_order: number;
    is_active: boolean;
}

interface Props {
    projectType: ProjectType | null;
    colors: Record<string, string>;
}

const colorClasses: Record<string, string> = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    crimson: 'bg-pink-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    pink: 'bg-pink-400',
    yellow: 'bg-yellow-500',
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500',
};

export default function ProjectTypeForm({ projectType, colors }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Project Types', href: '/admin/project-types' },
        { title: projectType ? 'Edit Type' : 'New Type', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: projectType?.name ?? '',
        slug: projectType?.slug ?? '',
        color: projectType?.color ?? 'cyan',
        icon: projectType?.icon ?? '',
        description: projectType?.description ?? '',
        display_order: projectType?.display_order ?? 0,
        is_active: projectType?.is_active ?? true,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (projectType) {
            put(`/admin/project-types/${projectType.id}`);
        } else {
            post('/admin/project-types');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`${projectType ? 'Edit' : 'New'} Project Type | Admin`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Palette className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {projectType ? 'Edit Project Type' : 'New Project Type'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {projectType ? 'Update type details' : 'Create a new project category'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/project-types')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border p-6 space-y-6">
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

                        {/* Color Selection */}
                        <div className="space-y-3">
                            <Label>
                                Color <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-5 gap-3">
                                {Object.entries(colors).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setData('color', key)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                                            data.color === key
                                                ? 'border-primary bg-muted ring-2 ring-primary/20'
                                                : 'border-input hover:border-muted-foreground hover:bg-muted/50'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${colorClasses[key]}`}></div>
                                        <span className="text-xs text-muted-foreground">{label}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.color && (
                                <p className="text-sm text-red-500">{errors.color}</p>
                            )}
                        </div>

                        {/* Icon */}
                        <div className="space-y-2">
                            <Label htmlFor="icon">
                                Icon <span className="text-muted-foreground">(optional, Lucide icon name)</span>
                            </Label>
                            <Input
                                id="icon"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                placeholder="e.g., brain, code, server"
                            />
                            {errors.icon && (
                                <p className="text-sm text-red-500">{errors.icon}</p>
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
                                placeholder="A brief description of this project type..."
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

                        {/* Active Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Active <span className="text-muted-foreground">(visible in project forms)</span>
                            </Label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/project-types')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : projectType ? 'Update Type' : 'Create Type'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
