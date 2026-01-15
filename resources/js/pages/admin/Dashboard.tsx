import { Head } from '@inertiajs/react';
import { LayoutGrid, User, FolderKanban, FileText, Briefcase, Mail } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
];

const quickLinks = [
    {
        title: 'About',
        description: 'Manage profile, bio, and skills',
        href: '/admin/about',
        icon: User,
        color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    },
    {
        title: 'Projects',
        description: 'Showcase your work',
        href: '/admin/projects',
        icon: FolderKanban,
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    {
        title: 'Blog',
        description: 'Write articles and posts',
        href: '/admin/blog',
        icon: FileText,
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    {
        title: 'Services',
        description: 'Define your offerings',
        href: '/admin/services',
        icon: Briefcase,
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    {
        title: 'Contact',
        description: 'View messages and inquiries',
        href: '/admin/contact',
        icon: Mail,
        color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    },
];

export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <LayoutGrid className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your portfolio content
                        </p>
                    </div>
                </div>

                {/* Quick Links Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            className="group relative flex flex-col gap-4 rounded-xl border p-6 transition-all hover:border-primary/50 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${link.color}`}>
                                <link.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold group-hover:text-primary">
                                    {link.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {link.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Status Section */}
                <div className="rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">Quick Stats</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">Total Skills</p>
                            <p className="text-2xl font-bold">-</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">Projects</p>
                            <p className="text-2xl font-bold">-</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">Blog Posts</p>
                            <p className="text-2xl font-bold">-</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">Messages</p>
                            <p className="text-2xl font-bold">-</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
