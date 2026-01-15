import { Head } from '@inertiajs/react';
import { FolderKanban } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Projects', href: '/admin/projects' },
];

export default function ProjectsIndex() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Management" />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/10">
                    <FolderKanban className="h-10 w-10 text-purple-500" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="mt-2 text-muted-foreground">
                        Projects management coming soon
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
