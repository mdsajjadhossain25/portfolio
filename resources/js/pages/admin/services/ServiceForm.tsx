import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save,
    Plus,
    Trash2,
    GripVertical,
    Briefcase,
    DollarSign,
    Clock,
    FileText,
    List,
} from 'lucide-react';
import { FormEventHandler } from 'react';

import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

interface ServiceFeature {
    id?: number;
    feature_text: string;
    display_order: number;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    detailed_description: string | null;
    service_type: string;
    pricing_model: string;
    price_label: string | null;
    duration: string | null;
    icon: string | null;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
    features: ServiceFeature[];
}

interface ServiceType {
    value: string;
    label: string;
}

interface PricingModel {
    value: string;
    label: string;
}

interface Props {
    service: Service | null;
    serviceTypes: ServiceType[];
    pricingModels: PricingModel[];
}

export default function ServiceForm({ service, serviceTypes, pricingModels }: Props) {
    const isEditing = !!service;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
        { title: isEditing ? 'Edit Service' : 'Create Service', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: service?.title || '',
        slug: service?.slug || '',
        short_description: service?.short_description || '',
        detailed_description: service?.detailed_description || '',
        service_type: service?.service_type || 'consulting',
        pricing_model: service?.pricing_model || 'custom',
        price_label: service?.price_label || '',
        duration: service?.duration || '',
        icon: service?.icon || '',
        is_featured: service?.is_featured || false,
        is_active: service?.is_active ?? true,
        display_order: service?.display_order || 0,
        features: service?.features || [] as ServiceFeature[],
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(`/admin/services/${service.id}`);
        } else {
            post('/admin/services');
        }
    };

    const addFeature = () => {
        setData('features', [
            ...data.features,
            { feature_text: '', display_order: data.features.length },
        ]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        // Reorder remaining features
        newFeatures.forEach((feature, i) => {
            feature.display_order = i;
        });
        setData('features', newFeatures);
    };

    const updateFeature = (index: number, text: string) => {
        const newFeatures = [...data.features];
        newFeatures[index].feature_text = text;
        setData('features', newFeatures);
    };

    const moveFeature = (index: number, direction: 'up' | 'down') => {
        const newFeatures = [...data.features];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newFeatures.length) return;
        
        [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
        newFeatures.forEach((feature, i) => {
            feature.display_order = i;
        });
        setData('features', newFeatures);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${service.title}` : 'Create Service'} />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/admin/services">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Services
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isEditing ? 'Edit Service' : 'Create New Service'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditing 
                            ? 'Update your service details and features'
                            : 'Add a new service to your portfolio'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Service Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., AI Consulting"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Short Description *</Label>
                                <Textarea
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="A brief description of your service (max 500 characters)"
                                    rows={3}
                                />
                                <div className="flex justify-between">
                                    <InputError message={errors.short_description} />
                                    <span className="text-xs text-muted-foreground">
                                        {data.short_description.length}/500
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="detailed_description">Detailed Description</Label>
                                <Textarea
                                    id="detailed_description"
                                    value={data.detailed_description}
                                    onChange={(e) => setData('detailed_description', e.target.value)}
                                    placeholder="Provide a comprehensive description of your service..."
                                    rows={6}
                                />
                                <InputError message={errors.detailed_description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="service_type">Service Type *</Label>
                                    <Select 
                                        value={data.service_type} 
                                        onValueChange={(value) => setData('service_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.service_type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon Name</Label>
                                    <Input
                                        id="icon"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        placeholder="e.g., brain, code, search"
                                    />
                                    <InputError message={errors.icon} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <h2 className="text-lg font-semibold text-foreground">Pricing</h2>
                        </div>

                        <div className="grid gap-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="pricing_model">Pricing Model *</Label>
                                    <Select 
                                        value={data.pricing_model} 
                                        onValueChange={(value) => setData('pricing_model', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pricingModels.map((model) => (
                                                <SelectItem key={model.value} value={model.value}>
                                                    {model.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.pricing_model} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price_label">Price Label</Label>
                                    <Input
                                        id="price_label"
                                        value={data.price_label}
                                        onChange={(e) => setData('price_label', e.target.value)}
                                        placeholder="e.g., $150/hr, Starting at $2,000"
                                    />
                                    <InputError message={errors.price_label} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g., 2-4 weeks, Ongoing"
                                    />
                                    <InputError message={errors.duration} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <List className="h-5 w-5 text-purple-500" />
                                <h2 className="text-lg font-semibold text-foreground">Features</h2>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Feature
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {data.features.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">
                                    No features added yet. Click "Add Feature" to get started.
                                </p>
                            ) : (
                                data.features.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveFeature(index, 'up')}
                                                disabled={index === 0}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveFeature(index, 'down')}
                                                disabled={index === data.features.length - 1}
                                                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={feature.feature_text}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder="Enter feature description..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFeature(index)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Active</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make this service visible on the public page
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Featured</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Highlight this service on the public page
                                    </p>
                                </div>
                                <Switch
                                    checked={data.is_featured}
                                    onCheckedChange={(checked: boolean) => setData('is_featured', checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    min="0"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                    className="w-32"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/services">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
