import { Head, Link, router } from '@inertiajs/react';
import { 
    Palette, 
    Plus, 
    Edit, 
    Trash2, 
    GripVertical, 
    Eye, 
    EyeOff,
    FolderKanban,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
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
    projects_count: number;
}

interface Props {
    projectTypes: ProjectType[];
    colors: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Project Types', href: '/admin/project-types' },
];

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

const colorBorderClasses: Record<string, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    green: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    crimson: 'border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400',
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pink: 'border-pink-400/30 bg-pink-400/10 text-pink-500 dark:text-pink-300',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    teal: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400',
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
};

export default function Index({ projectTypes, colors }: Props) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project type?')) {
            setDeleting(id);
            router.delete(`/admin/project-types/${id}`, {
                preserveScroll: true,
                onFinish: () => setDeleting(null),
            });
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/project-types/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Types | Admin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/projects">
                            <Button variant="ghost" size="icon" className="mr-2 text-neutral-400 hover:text-white">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Palette className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Project Types</h1>
                            <p className="text-sm text-muted-foreground">Manage project categories</p>
                        </div>
                    </div>
                    <Link href="/admin/project-types/create">
                        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600">
                            <Plus className="h-4 w-4" />
                            Add Project Type
                        </Button>
                    </Link>
                </div>

                {/* Project Types List */}
                {projectTypes.length === 0 ? (
                    <div className="rounded-xl border p-12 text-center">
                        <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No project types yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first project type to categorize your projects.</p>
                        <Link href="/admin/project-types/create">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Project Type
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-xl border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-10"></th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Projects</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {projectTypes.map((type) => (
                                        <tr key={type.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full ${colorClasses[type.color] || 'bg-muted'}`}></div>
                                                    <span className="text-xs text-muted-foreground capitalize">{type.color}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorBorderClasses[type.color] || 'border-muted bg-muted/50 text-muted-foreground'}`}>
                                                    {type.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                    {type.slug}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <FolderKanban className="h-4 w-4" />
                                                    <span className="text-sm">{type.projects_count}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleToggleActive(type.id)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                                        type.is_active
                                                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 hover:bg-green-500/20'
                                                            : 'bg-muted text-muted-foreground border hover:bg-muted/80'
                                                    }`}
                                                >
                                                    {type.is_active ? (
                                                        <>
                                                            <Eye className="h-3 w-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-3 w-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/project-types/${type.id}/edit`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                        onClick={() => handleDelete(type.id)}
                                                        disabled={deleting === type.id || type.projects_count > 0}
                                                        title={type.projects_count > 0 ? 'Cannot delete type with projects' : 'Delete'}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Tip:</strong> Project types with assigned projects cannot be deleted. 
                        Reassign or remove the projects first.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
