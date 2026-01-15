import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, Save, X, Plus, Trash2 } from 'lucide-react';
import React, { FormEventHandler, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { type BreadcrumbItem } from '@/types';

interface Experience {
    id: number;
    title: string;
    company: string;
    location: string | null;
    type: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    highlights: string[] | null;
    display_order: number;
    is_active: boolean;
}

interface Props {
    experience: Experience | null;
}

const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
    { value: 'research', label: 'Research' },
];

export default function ExperienceForm({ experience }: Props) {
    const isEditing = !!experience;
    const [highlights, setHighlights] = useState<string[]>(experience?.highlights || []);
    const [newHighlight, setNewHighlight] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'About', href: '/admin/about' },
        { title: 'Experiences', href: '/admin/about/experiences' },
        { title: isEditing ? 'Edit Experience' : 'Add Experience', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: experience?.title || '',
        company: experience?.company || '',
        location: experience?.location || '',
        type: experience?.type || 'full-time',
        start_date: experience?.start_date || '',
        end_date: experience?.end_date || '',
        is_current: experience?.is_current || false,
        description: experience?.description || '',
        highlights: experience?.highlights || [],
        display_order: experience?.display_order || 0,
        is_active: experience?.is_active ?? true,
    });

    const addHighlight = () => {
        if (newHighlight.trim()) {
            const updated = [...highlights, newHighlight.trim()];
            setHighlights(updated);
            setData('highlights', updated);
            setNewHighlight('');
        }
    };

    const removeHighlight = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index);
        setHighlights(updated);
        setData('highlights', updated);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(`/admin/about/experiences/${experience.id}`);
        } else {
            post('/admin/about/experiences');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Experience' : 'Add Experience'} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                            <Briefcase className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {isEditing ? 'Edit Experience' : 'Add Experience'}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditing 
                                    ? 'Update the experience details' 
                                    : 'Add a new experience to your journey'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Job Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Senior AI Engineer"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input
                                    id="company"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="e.g., TechCorp Inc."
                                    className={errors.company ? 'border-red-500' : ''}
                                />
                                {errors.company && (
                                    <p className="text-sm text-red-500">{errors.company}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g., San Francisco, CA (Remote)"
                                />
                            </div>

                            {/* Employment Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Employment Type *</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {employmentTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-sm text-red-500">{errors.type}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Date Range */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className={errors.start_date ? 'border-red-500' : ''}
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-red-500">{errors.start_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date || ''}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        disabled={data.is_current}
                                        className={data.is_current ? 'opacity-50' : ''}
                                    />
                                    {errors.end_date && (
                                        <p className="text-sm text-red-500">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Is Current */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_current"
                                    checked={data.is_current}
                                    onCheckedChange={(checked) => {
                                        setData('is_current', checked as boolean);
                                        if (checked) {
                                            setData('end_date', '');
                                        }
                                    }}
                                />
                                <Label htmlFor="is_current" className="cursor-pointer">
                                    I currently work here
                                </Label>
                            </div>

                            {/* Display Order */}
                            <div className="space-y-2">
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    min="0"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Show on public page
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            placeholder="Describe your role and responsibilities..."
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.description.length}/1000 characters
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-4">
                        <Label>Key Highlights / Achievements</Label>
                        
                        <div className="flex gap-2">
                            <Input
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                placeholder="Add a key achievement..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addHighlight();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addHighlight} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {highlights.length > 0 && (
                            <div className="space-y-2">
                                {highlights.map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2"
                                    >
                                        <span className="flex-1 text-sm">{highlight}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeHighlight(index)}
                                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 border-t pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : (isEditing ? 'Update Experience' : 'Create Experience')}
                        </Button>
                        <Link href="/admin/about/experiences">
                            <Button type="button" variant="outline">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
