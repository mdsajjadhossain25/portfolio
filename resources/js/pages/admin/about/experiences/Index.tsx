import { Head, Link, router } from '@inertiajs/react';
import { Plus, Briefcase, Edit, Trash2, GripVertical, Calendar, MapPin, Building } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Experience {
    id: number;
    title: string;
    company: string;
    location: string | null;
    type: string;
    start_date: string;
    end_date: string | null;
    date_range: string;
    is_current: boolean;
    description: string | null;
    highlights: string[] | null;
    display_order: number;
    is_active: boolean;
}

interface Props {
    experiences: Experience[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'About', href: '/admin/about' },
    { title: 'Experiences', href: '/admin/about/experiences' },
];

const typeColors: Record<string, string> = {
    'full-time': 'bg-green-500/10 text-green-500 border-green-500/30',
    'part-time': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    'contract': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    'freelance': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    'internship': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    'research': 'bg-pink-500/10 text-pink-500 border-pink-500/30',
};

export default function ExperiencesIndex({ experiences }: Props) {
    const handleDelete = (experience: Experience) => {
        if (confirm(`Are you sure you want to delete "${experience.title}" at ${experience.company}?`)) {
            router.delete(`/admin/about/experiences/${experience.id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Experience Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                            <Briefcase className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Experience Management</h1>
                            <p className="text-muted-foreground">
                                Manage your work experience and journey timeline
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/about/experiences/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Experience
                        </Button>
                    </Link>
                </div>

                {/* Back to About */}
                <div>
                    <Link href="/admin/about" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to About Management
                    </Link>
                </div>

                {/* Experiences List */}
                {experiences.length > 0 ? (
                    <div className="space-y-4">
                        {experiences.map((experience, index) => (
                            <div
                                key={experience.id}
                                className="group rounded-xl border p-4 transition-colors hover:border-pink-500/30 hover:bg-pink-500/5"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Drag Handle */}
                                    <div className="flex h-10 w-10 cursor-grab items-center justify-center rounded-lg bg-muted text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    {/* Timeline Indicator */}
                                    <div className="flex flex-col items-center">
                                        <div className={`h-4 w-4 rounded-full ${experience.is_current ? 'bg-green-500 animate-pulse' : 'bg-pink-500'}`} />
                                        {index < experiences.length - 1 && (
                                            <div className="mt-1 h-full w-0.5 bg-gradient-to-b from-pink-500/50 to-transparent" style={{ minHeight: '60px' }} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{experience.title}</h3>
                                                    {experience.is_current && (
                                                        <span className="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-xs text-green-500">
                                                            Current
                                                        </span>
                                                    )}
                                                    {!experience.is_active && (
                                                        <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-xs text-red-500">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Building className="h-4 w-4" />
                                                        {experience.company}
                                                    </span>
                                                    {experience.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {experience.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {experience.date_range}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${typeColors[experience.type] || 'bg-gray-500/10 text-gray-500'}`}>
                                                    {experience.type.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        {experience.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {experience.description}
                                            </p>
                                        )}

                                        {experience.highlights && experience.highlights.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {experience.highlights.slice(0, 3).map((highlight, i) => (
                                                    <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">
                                                        {highlight.length > 50 ? highlight.substring(0, 50) + '...' : highlight}
                                                    </span>
                                                ))}
                                                {experience.highlights.length > 3 && (
                                                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                        +{experience.highlights.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/about/experiences/${experience.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(experience)}
                                            className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold">No experiences yet</h3>
                        <p className="mt-1 text-muted-foreground">
                            Add your work experiences to show on the Journey section
                        </p>
                        <Link href="/admin/about/experiences/create" className="mt-4">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Experience
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
