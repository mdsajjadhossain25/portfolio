import { Head } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Services', href: '/admin/services' },
];

export default function ServicesIndex() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Services Management" />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10">
                    <Briefcase className="h-10 w-10 text-orange-500" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="mt-2 text-muted-foreground">
                        Services management coming soon
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
