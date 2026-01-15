import { Head, Link } from '@inertiajs/react';
import { User, Plus, Settings, Layers, Briefcase } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface AboutProfile {
    id: number;
    full_name: string;
    title: string;
    subtitle: string | null;
    short_bio: string;
    company: string | null;
    university: string | null;
    cgpa: number | null;
    profile_image: string | null;
    is_active: boolean;
}

interface Skill {
    id: number;
    name: string;
    icon: string | null;
    tag: string | null;
    is_featured: boolean;
}

interface SkillCategory {
    id: number;
    name: string;
    color: string;
    icon: string | null;
    skills: Skill[];
}

interface Experience {
    id: number;
    title: string;
    company: string;
    date_range: string;
    is_current: boolean;
    is_active: boolean;
}

interface Props {
    profile: AboutProfile | null;
    skillCategories: SkillCategory[];
    experiences: Experience[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'About', href: '/admin/about' },
];

export default function AboutIndex({ profile, skillCategories, experiences }: Props) {
    const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="About Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                            <User className="h-6 w-6 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">About Section</h1>
                            <p className="text-muted-foreground">
                                Manage your profile information and skills
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Profile Card */}
                    <div className="rounded-xl border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Profile Information</h2>
                            <Link href="/admin/about/edit">
                                <Button variant="outline" size="sm">
                                    <Settings className="mr-2 h-4 w-4" />
                                    {profile ? 'Edit Profile' : 'Create Profile'}
                                </Button>
                            </Link>
                        </div>

                        {profile ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    {profile.profile_image ? (
                                        <img
                                            src={profile.profile_image}
                                            alt={profile.full_name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                            <User className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{profile.full_name}</h3>
                                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                                        {profile.company && (
                                            <p className="text-sm text-muted-foreground">@ {profile.company}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2 text-sm">
                                    {profile.subtitle && (
                                        <p className="italic text-muted-foreground">"{profile.subtitle}"</p>
                                    )}
                                    <p className="line-clamp-3">{profile.short_bio}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {profile.university && (
                                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-500">
                                            🎓 {profile.university}
                                        </span>
                                    )}
                                    {profile.cgpa && (
                                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
                                            CGPA: {profile.cgpa}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                                        profile.is_active 
                                            ? 'bg-green-500/10 text-green-500' 
                                            : 'bg-red-500/10 text-red-500'
                                    }`}>
                                        <span className={`h-2 w-2 rounded-full ${
                                            profile.is_active ? 'bg-green-500' : 'bg-red-500'
                                        }`} />
                                        {profile.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <User className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No profile created yet</p>
                                <Link href="/admin/about/edit" className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Profile
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Skills Overview Card */}
                    <div className="rounded-xl border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Skills Overview</h2>
                            <Link href="/admin/about/skills">
                                <Button variant="outline" size="sm">
                                    <Layers className="mr-2 h-4 w-4" />
                                    Manage Skills
                                </Button>
                            </Link>
                        </div>

                        {skillCategories.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                        {skillCategories.length} Categories
                                    </span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">
                                        {totalSkills} Skills
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {skillCategories.slice(0, 4).map((category) => (
                                        <div key={category.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {category.icon && <span>{category.icon}</span>}
                                                <span className="text-sm font-medium">{category.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({category.skills.length})
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {category.skills.slice(0, 5).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className={`rounded-md border px-2 py-0.5 text-xs ${
                                                            category.color === 'cyan'
                                                                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                                                : category.color === 'purple'
                                                                ? 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                                : category.color === 'green'
                                                                ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                                                : 'border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400'
                                                        }`}
                                                    >
                                                        {skill.icon && `${skill.icon} `}{skill.name}
                                                    </span>
                                                ))}
                                                {category.skills.length > 5 && (
                                                    <span className="rounded-md border border-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                        +{category.skills.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {skillCategories.length > 4 && (
                                    <p className="text-xs text-muted-foreground">
                                        +{skillCategories.length - 4} more categories
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Layers className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No skills added yet</p>
                                <Link href="/admin/about/skills" className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Skills
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Experiences Card */}
                <div className="rounded-xl border p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Journey / Experience</h2>
                        <Link href="/admin/about/experiences">
                            <Button variant="outline" size="sm">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Manage Experiences
                            </Button>
                        </Link>
                    </div>

                    {experiences.length > 0 ? (
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                {experiences.length} Experience{experiences.length !== 1 ? 's' : ''} added
                            </div>

                            <div className="space-y-3">
                                {experiences.slice(0, 4).map((exp) => (
                                    <div key={exp.id} className="flex items-center gap-3 rounded-lg border p-3">
                                        <div className={`h-3 w-3 rounded-full ${exp.is_current ? 'bg-green-500 animate-pulse' : 'bg-pink-500'}`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{exp.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {exp.company} • {exp.date_range}
                                            </p>
                                        </div>
                                        {!exp.is_active && (
                                            <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-xs text-red-500">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {experiences.length > 4 && (
                                <p className="text-xs text-muted-foreground">
                                    +{experiences.length - 4} more experiences
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">No experiences added yet</p>
                            <Link href="/admin/about/experiences/create" className="mt-4">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Experience
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
