import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Blog', href: '/admin/blog' },
];

export default function BlogIndex() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Management" />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10">
                    <FileText className="h-10 w-10 text-green-500" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Blog</h1>
                    <p className="mt-2 text-muted-foreground">
                        Blog management coming soon
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
