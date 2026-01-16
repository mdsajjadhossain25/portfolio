import { Head, Link, router } from '@inertiajs/react';
import { 
    FolderKanban, 
    Plus, 
    Edit, 
    Trash2, 
    GripVertical, 
    Star, 
    Eye, 
    EyeOff,
    ExternalLink,
    Github,
    FileText,
    Search,
    Filter,
    Palette
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

interface ProjectImage {
    id: number;
    image_path: string;
    alt_text: string | null;
    caption: string | null;
    display_order: number;
}

interface ProjectFeature {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
    display_order: number;
}

interface ProjectMetric {
    id: number;
    name: string;
    value: string;
    description: string | null;
    display_order: number;
}

interface ProjectVideo {
    id: number;
    title: string;
    video_url: string;
    platform: string;
    thumbnail: string | null;
    display_order: number;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    detailed_description: string | null;
    project_type_id: number | null;
    project_type_label: string;
    project_type_slug: string;
    project_type_color: string;
    tech_stack: string[] | null;
    tags: string[] | null;
    thumbnail_image: string | null;
    thumbnail_url: string | null;
    cover_image: string | null;
    github_url: string | null;
    live_url: string | null;
    paper_url: string | null;
    dataset_used: string | null;
    role: string | null;
    is_featured: boolean;
    status: string;
    status_label: string;
    display_order: number;
    is_active: boolean;
    images: ProjectImage[];
    features: ProjectFeature[];
    metrics: ProjectMetric[];
    videos: ProjectVideo[];
}

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Props {
    projects: Project[];
    projectTypes: ProjectType[];
    statuses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Projects', href: '/admin/projects' },
];

const colorToClasses: Record<string, string> = {
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

const statusColorClasses: Record<string, string> = {
    completed: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    ongoing: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
};

export default function ProjectsIndex({ projects, projectTypes }: Props) {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.short_description.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || project.project_type_slug === filterType;
        return matchesSearch && matchesType;
    });

    const featuredCount = projects.filter(p => p.is_featured).length;
    const activeCount = projects.filter(p => p.is_active).length;

    const handleDelete = (project: Project) => {
        if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
            router.delete(`/admin/projects/${project.slug}`);
        }
    };

    const handleToggleFeatured = (project: Project) => {
        router.post(`/admin/projects/${project.slug}/toggle-featured`);
    };

    const handleToggleActive = (project: Project) => {
        router.post(`/admin/projects/${project.slug}/toggle-active`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <FolderKanban className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Projects Management</h1>
                            <p className="text-muted-foreground">
                                {projects.length} projects • {featuredCount} featured • {activeCount} active
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/project-types">
                            <Button variant="outline" className="gap-2">
                                <Palette className="h-4 w-4" />
                                Manage Types
                            </Button>
                        </Link>
                        <Link href="/admin/projects/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Project
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <option value="all">All Types</option>
                            {projectTypes.map((type) => (
                                <option key={type.id} value={type.slug}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Projects List */}
                {filteredProjects.length > 0 ? (
                    <div className="space-y-4">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className={`group rounded-xl border transition-colors hover:bg-muted/50 ${
                                    !project.is_active ? 'opacity-60' : ''
                                }`}
                            >
                                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                                    {/* Drag Handle & Thumbnail */}
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="hidden h-5 w-5 cursor-move text-muted-foreground lg:block" />
                                        <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                            {project.thumbnail_url ? (
                                                <img
                                                    src={project.thumbnail_url}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                                                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">{project.title}</h3>
                                            {project.is_featured && (
                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            )}
                                            <span className={`rounded-full border px-2 py-0.5 text-xs ${colorToClasses[project.project_type_color] || 'border-neutral-500/30 bg-neutral-500/10 text-neutral-400'}`}>
                                                {project.project_type_label}
                                            </span>
                                            <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColorClasses[project.status]}`}>
                                                {project.status_label}
                                            </span>
                                        </div>
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {project.short_description}
                                        </p>
                                        {project.tech_stack && project.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.tech_stack.slice(0, 5).map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.tech_stack.length > 5 && (
                                                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                                                        +{project.tech_stack.length - 5}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-2">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Github className="h-4 w-4" />
                                            </a>
                                        )}
                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                        {project.paper_url && (
                                            <a
                                                href={project.paper_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleFeatured(project)}
                                            title={project.is_featured ? 'Remove from featured' : 'Add to featured'}
                                        >
                                            <Star className={`h-4 w-4 ${project.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleActive(project)}
                                            title={project.is_active ? 'Hide project' : 'Show project'}
                                        >
                                            {project.is_active ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Link href={`/admin/projects/${project.slug}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(project)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
                        <FolderKanban className="mb-4 h-16 w-16 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold">
                            {search || filterType !== 'all' ? 'No projects found' : 'No projects yet'}
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                            {search || filterType !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Start by creating your first project'}
                        </p>
                        {!search && filterType === 'all' && (
                            <Link href="/admin/projects/create" className="mt-4">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
