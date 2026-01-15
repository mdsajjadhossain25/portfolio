import { Head, useForm, router } from '@inertiajs/react';
import { User, Save, ArrowLeft, Upload } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface AboutProfile {
    id: number;
    full_name: string;
    title: string;
    subtitle: string | null;
    short_bio: string;
    long_bio: string | null;
    profile_image: string | null;
    company: string | null;
    location: string | null;
    years_of_experience: number | null;
    university: string | null;
    cgpa: number | null;
    academic_highlight: string | null;
    resume_url: string | null;
    email: string | null;
    phone: string | null;
    social_links: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    } | null;
    status: string;
    is_active: boolean;
}

interface Props {
    profile: AboutProfile | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'About', href: '/admin/about' },
    { title: 'Edit Profile', href: '/admin/about/edit' },
];

export default function ProfileForm({ profile }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        profile?.profile_image || null
    );

    const { data, setData, post, processing, errors } = useForm({
        full_name: profile?.full_name || '',
        title: profile?.title || '',
        subtitle: profile?.subtitle || '',
        short_bio: profile?.short_bio || '',
        long_bio: profile?.long_bio || '',
        profile_image: null as File | null,
        company: profile?.company || '',
        location: profile?.location || '',
        years_of_experience: profile?.years_of_experience?.toString() || '',
        university: profile?.university || '',
        cgpa: profile?.cgpa?.toString() || '',
        academic_highlight: profile?.academic_highlight || '',
        resume_url: profile?.resume_url || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        social_links: {
            github: profile?.social_links?.github || '',
            linkedin: profile?.social_links?.linkedin || '',
            twitter: profile?.social_links?.twitter || '',
            website: profile?.social_links?.website || '',
        },
        status: profile?.status || 'Open to Opportunities',
        is_active: profile?.is_active ?? true,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/about', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={profile ? 'Edit Profile' : 'Create Profile'} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/admin/about')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                                <User className="h-5 w-5 text-cyan-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">
                                    {profile ? 'Edit Profile' : 'Create Profile'}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage your about section content
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Profile Image */}
                            <div className="sm:col-span-2">
                                <Label>Profile Image</Label>
                                <div className="mt-2 flex items-center gap-4">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <label className="cursor-pointer">
                                            <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted">
                                                <Upload className="h-4 w-4" />
                                                Choose Image
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            JPG, PNG, WebP up to 5MB
                                        </p>
                                    </div>
                                </div>
                                {errors.profile_image && (
                                    <p className="mt-1 text-sm text-red-500">{errors.profile_image}</p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div>
                                <Label htmlFor="full_name">Full Name *</Label>
                                <Input
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="John Doe"
                                    className="mt-1"
                                />
                                {errors.full_name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Junior AI Engineer"
                                    className="mt-1"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Subtitle */}
                            <div className="sm:col-span-2">
                                <Label htmlFor="subtitle">Subtitle / Tagline</Label>
                                <Input
                                    id="subtitle"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="Building intelligent systems that see and understand"
                                    className="mt-1"
                                />
                                {errors.subtitle && (
                                    <p className="mt-1 text-sm text-red-500">{errors.subtitle}</p>
                                )}
                            </div>

                            {/* Short Bio */}
                            <div className="sm:col-span-2">
                                <Label htmlFor="short_bio">Short Bio *</Label>
                                <textarea
                                    id="short_bio"
                                    value={data.short_bio}
                                    onChange={(e) => setData('short_bio', e.target.value)}
                                    placeholder="A brief introduction about yourself..."
                                    rows={3}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                {errors.short_bio && (
                                    <p className="mt-1 text-sm text-red-500">{errors.short_bio}</p>
                                )}
                            </div>

                            {/* Long Bio */}
                            <div className="sm:col-span-2">
                                <Label htmlFor="long_bio">Long Bio</Label>
                                <textarea
                                    id="long_bio"
                                    value={data.long_bio}
                                    onChange={(e) => setData('long_bio', e.target.value)}
                                    placeholder="A detailed biography..."
                                    rows={5}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                {errors.long_bio && (
                                    <p className="mt-1 text-sm text-red-500">{errors.long_bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Professional Information</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="Deep Mind Labs Ltd."
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Dhaka, Bangladesh"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="years_of_experience">Years of Experience</Label>
                                <Input
                                    id="years_of_experience"
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={data.years_of_experience}
                                    onChange={(e) => setData('years_of_experience', e.target.value)}
                                    placeholder="2"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    placeholder="Open to Opportunities"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Academic Information</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="university">University</Label>
                                <Input
                                    id="university"
                                    value={data.university}
                                    onChange={(e) => setData('university', e.target.value)}
                                    placeholder="University of Rajshahi"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="cgpa">CGPA</Label>
                                <Input
                                    id="cgpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={data.cgpa}
                                    onChange={(e) => setData('cgpa', e.target.value)}
                                    placeholder="3.69"
                                    className="mt-1"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="academic_highlight">Academic Highlight</Label>
                                <Input
                                    id="academic_highlight"
                                    value={data.academic_highlight}
                                    onChange={(e) => setData('academic_highlight', e.target.value)}
                                    placeholder="Placed 6th in department"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+880 1234 567890"
                                    className="mt-1"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="resume_url">Resume URL</Label>
                                <Input
                                    id="resume_url"
                                    value={data.resume_url}
                                    onChange={(e) => setData('resume_url', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Social Links</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="github">GitHub</Label>
                                <Input
                                    id="github"
                                    value={data.social_links.github}
                                    onChange={(e) => setData('social_links', { ...data.social_links, github: e.target.value })}
                                    placeholder="https://github.com/username"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    value={data.social_links.linkedin}
                                    onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/username"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="twitter">Twitter</Label>
                                <Input
                                    id="twitter"
                                    value={data.social_links.twitter}
                                    onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                                    placeholder="https://twitter.com/username"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="website">Personal Website</Label>
                                <Input
                                    id="website"
                                    value={data.social_links.website}
                                    onChange={(e) => setData('social_links', { ...data.social_links, website: e.target.value })}
                                    placeholder="https://yourwebsite.com"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="rounded-xl border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Profile Status</h2>
                                <p className="text-sm text-muted-foreground">
                                    Enable or disable your profile visibility
                                </p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/about')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
