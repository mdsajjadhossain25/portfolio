import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Star, 
    StarOff,
    Eye,
    EyeOff,
    GripVertical,
    Filter,
    DollarSign,
    Clock,
    Briefcase,
} from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface ServiceFeature {
    id: number;
    feature_text: string;
    display_order: number;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    service_type: string;
    service_type_label: string;
    pricing_model: string;
    pricing_model_label: string;
    price_label: string | null;
    duration: string | null;
    icon: string | null;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
    features: ServiceFeature[];
    created_at: string;
}

interface ServiceType {
    value: string;
    label: string;
}

interface Props {
    services: {
        data: Service[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        type?: string;
        active?: string;
    };
    serviceTypes: ServiceType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Services', href: '/admin/services' },
];

const serviceTypeColors: Record<string, string> = {
    consulting: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    development: 'bg-green-500/20 text-green-400 border-green-500/30',
    research: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    freelance: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    hiring: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const pricingModelColors: Record<string, string> = {
    hourly: 'bg-cyan-500/20 text-cyan-400',
    project: 'bg-emerald-500/20 text-emerald-400',
    retainer: 'bg-amber-500/20 text-amber-400',
    custom: 'bg-violet-500/20 text-violet-400',
};

export default function ServicesIndex({ services, filters, serviceTypes }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [activeFilter, setActiveFilter] = useState(filters.active ?? 'all');

    const handleSearch = () => {
        router.get('/admin/services', {
            search: search || undefined,
            type: selectedType !== 'all' ? selectedType : undefined,
            active: activeFilter !== 'all' ? activeFilter : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (service: Service) => {
        router.delete(`/admin/services/${service.id}`, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (service: Service) => {
        router.post(`/admin/services/${service.id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    const handleToggleFeatured = (service: Service) => {
        router.post(`/admin/services/${service.id}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedType('all');
        setActiveFilter('all');
        router.get('/admin/services', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Services</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your services and pricing offerings
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/services/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Service
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search services..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-[180px]">
                                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Service Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {serviceTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={activeFilter} onValueChange={setActiveFilter}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={handleSearch} variant="secondary">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>

                        {(search || selectedType !== 'all' || activeFilter !== 'all') && (
                            <Button onClick={clearFilters} variant="ghost" size="sm">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Services Table */}
                <div className="rounded-lg border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Pricing</TableHead>
                                <TableHead>Features</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No services found. Create your first service to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.data.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">
                                                        {service.title}
                                                    </span>
                                                    {service.is_featured && (
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {service.short_description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="outline" 
                                                className={serviceTypeColors[service.service_type]}
                                            >
                                                {service.service_type_label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pricingModelColors[service.pricing_model]}`}>
                                                    {service.pricing_model_label}
                                                </span>
                                                {service.price_label && (
                                                    <p className="text-sm text-foreground flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        {service.price_label}
                                                    </p>
                                                )}
                                                {service.duration && (
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {service.duration}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {service.features.length} features
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(service)}
                                                    className={service.is_active ? 'text-green-500' : 'text-muted-foreground'}
                                                    title={service.is_active ? 'Active' : 'Inactive'}
                                                >
                                                    {service.is_active ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleFeatured(service)}
                                                    className={service.is_featured ? 'text-yellow-500' : 'text-muted-foreground'}
                                                    title={service.is_featured ? 'Featured' : 'Not Featured'}
                                                >
                                                    {service.is_featured ? (
                                                        <Star className="h-4 w-4 fill-current" />
                                                    ) : (
                                                        <StarOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={`/admin/services/${service.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Service
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{service.title}"? 
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(service)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {services.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                            {services.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'ghost'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={!link.url ? 'opacity-50' : ''}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
