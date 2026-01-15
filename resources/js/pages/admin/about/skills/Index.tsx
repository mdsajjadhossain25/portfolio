import { Head, Link, router } from '@inertiajs/react';
import { Layers, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Skill {
    id: number;
    name: string;
    icon: string | null;
    tag: string | null;
    display_order: number;
    is_featured: boolean;
    is_active: boolean;
}

interface SkillCategory {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string;
    display_order: number;
    is_active: boolean;
    skills: Skill[];
}

interface Props {
    categories: SkillCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'About', href: '/admin/about' },
    { title: 'Skills', href: '/admin/about/skills' },
];

const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    green: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    crimson: 'border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400',
};

export default function SkillsIndex({ categories }: Props) {
    const totalSkills = categories.reduce((acc, cat) => acc + cat.skills.length, 0);

    const handleDeleteSkill = (skillId: number) => {
        if (confirm('Are you sure you want to delete this skill?')) {
            router.delete(`/admin/about/skills/${skillId}`);
        }
    };

    const handleDeleteCategory = (categoryId: number) => {
        if (confirm('Are you sure you want to delete this category? All skills in this category will also be deleted.')) {
            router.delete(`/admin/about/skills/categories/${categoryId}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Skills Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <Layers className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Skills Management</h1>
                            <p className="text-muted-foreground">
                                {categories.length} categories • {totalSkills} skills
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/about/skills/categories/create">
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </Link>
                        <Link href="/admin/about/skills/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Skill
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Categories and Skills */}
                {categories.length > 0 ? (
                    <div className="space-y-6">
                        {categories.map((category) => (
                            <div key={category.id} className="rounded-xl border">
                                {/* Category Header */}
                                <div className="flex items-center justify-between border-b p-4">
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
                                        {category.icon && (
                                            <span className="text-xl">{category.icon}</span>
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {category.skills.length} skills
                                            </p>
                                        </div>
                                        <span className={`rounded-full border px-2 py-0.5 text-xs ${colorClasses[category.color] || colorClasses.cyan}`}>
                                            {category.color}
                                        </span>
                                        {!category.is_active && (
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/about/skills/categories/${category.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Skills List */}
                                <div className="p-4">
                                    {category.skills.length > 0 ? (
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {category.skills.map((skill) => (
                                                <div
                                                    key={skill.id}
                                                    className={`group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                                                        !skill.is_active ? 'opacity-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-4 w-4 cursor-move text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                                        {skill.icon && (
                                                            <span>{skill.icon}</span>
                                                        )}
                                                        <span className="text-sm font-medium">{skill.name}</span>
                                                        {skill.tag && (
                                                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                                                                {skill.tag}
                                                            </span>
                                                        )}
                                                        {skill.is_featured && (
                                                            <span className="text-yellow-500">⭐</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Link href={`/admin/about/skills/${skill.id}/edit`}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <Edit className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => handleDeleteSkill(skill.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                No skills in this category
                                            </p>
                                            <Link href={`/admin/about/skills/create?category=${category.id}`} className="mt-2">
                                                <Button variant="outline" size="sm">
                                                    <Plus className="mr-2 h-3 w-3" />
                                                    Add Skill
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
                        <Layers className="mb-4 h-16 w-16 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold">No skill categories yet</h3>
                        <p className="mt-1 text-muted-foreground">
                            Start by creating a skill category
                        </p>
                        <Link href="/admin/about/skills/categories/create" className="mt-4">
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
