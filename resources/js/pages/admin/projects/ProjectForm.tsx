import { Head, useForm, router } from '@inertiajs/react';
import { 
    FolderKanban, 
    Save, 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Upload, 
    X,
    Image as ImageIcon,
    Video,
    Sparkles,
    BarChart3
} from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface ProjectImage {
    id: number;
    image_path: string;
    alt_text: string | null;
    caption: string | null;
    display_order: number;
    image_url?: string;
}

interface ProjectFeature {
    id?: number;
    title: string;
    description: string;
    icon: string;
}

interface ProjectMetric {
    id?: number;
    name: string;
    value: string;
    description: string;
}

interface ProjectVideo {
    id?: number;
    title: string;
    video_url: string;
    platform: string;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    detailed_description: string | null;
    project_type_id: number | null;
    tech_stack: string[] | null;
    tags: string[] | null;
    thumbnail_image: string | null;
    thumbnail_url: string | null;
    cover_image: string | null;
    cover_url: string | null;
    github_url: string | null;
    live_url: string | null;
    paper_url: string | null;
    dataset_used: string | null;
    role: string | null;
    is_featured: boolean;
    status: string;
    display_order: number;
    is_active: boolean;
    images: ProjectImage[];
    features: ProjectFeature[];
    metrics: ProjectMetric[];
    videos: ProjectVideo[];
}

interface ProjectType {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Props {
    project: Project | null;
    projectTypes: ProjectType[];
    statuses: Record<string, string>;
}

export default function ProjectForm({ project, projectTypes, statuses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Projects', href: '/admin/projects' },
        { title: project ? 'Edit Project' : 'New Project', href: '#' },
    ];

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        project?.thumbnail_url || null
    );
    const [coverPreview, setCoverPreview] = useState<string | null>(
        project?.cover_url || null
    );
    const [existingImages, setExistingImages] = useState<ProjectImage[]>(
        project?.images || []
    );

    // Tech stack input
    const [techInput, setTechInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        slug: string;
        short_description: string;
        detailed_description: string;
        project_type_id: string;
        tech_stack: string[];
        tags: string[];
        thumbnail_image: File | null;
        cover_image: File | null;
        gallery_images: File[];
        github_url: string;
        live_url: string;
        paper_url: string;
        dataset_used: string;
        role: string;
        is_featured: boolean;
        status: string;
        display_order: string;
        is_active: boolean;
        features: ProjectFeature[];
        metrics: ProjectMetric[];
        videos: ProjectVideo[];
        _method?: string;
    }>({
        title: project?.title || '',
        slug: project?.slug || '',
        short_description: project?.short_description || '',
        detailed_description: project?.detailed_description || '',
        project_type_id: project?.project_type_id?.toString() || (projectTypes[0]?.id?.toString() || ''),
        tech_stack: project?.tech_stack || [],
        tags: project?.tags || [],
        thumbnail_image: null,
        cover_image: null,
        gallery_images: [],
        github_url: project?.github_url || '',
        live_url: project?.live_url || '',
        paper_url: project?.paper_url || '',
        dataset_used: project?.dataset_used || '',
        role: project?.role || '',
        is_featured: project?.is_featured ?? false,
        status: project?.status || 'completed',
        display_order: project?.display_order?.toString() || '0',
        is_active: project?.is_active ?? true,
        features: project?.features || [],
        metrics: project?.metrics || [],
        videos: project?.videos || [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Basic fields
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('short_description', data.short_description);
        formData.append('detailed_description', data.detailed_description);
        formData.append('project_type_id', data.project_type_id);
        formData.append('github_url', data.github_url);
        formData.append('live_url', data.live_url);
        formData.append('paper_url', data.paper_url);
        formData.append('dataset_used', data.dataset_used);
        formData.append('role', data.role);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('status', data.status);
        formData.append('display_order', data.display_order);
        formData.append('is_active', data.is_active ? '1' : '0');

        // Tech stack
        data.tech_stack.forEach((tech, index) => {
            formData.append(`tech_stack[${index}]`, tech);
        });

        // Tags
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });

        // Files
        if (data.thumbnail_image) {
            formData.append('thumbnail_image', data.thumbnail_image);
        }
        if (data.cover_image) {
            formData.append('cover_image', data.cover_image);
        }
        data.gallery_images.forEach((file, index) => {
            formData.append(`gallery_images[${index}]`, file);
        });

        // Features
        data.features.forEach((feature, index) => {
            formData.append(`features[${index}][title]`, feature.title);
            formData.append(`features[${index}][description]`, feature.description);
            formData.append(`features[${index}][icon]`, feature.icon);
        });

        // Metrics
        data.metrics.forEach((metric, index) => {
            formData.append(`metrics[${index}][name]`, metric.name);
            formData.append(`metrics[${index}][value]`, metric.value);
            formData.append(`metrics[${index}][description]`, metric.description);
        });

        // Videos
        data.videos.forEach((video, index) => {
            formData.append(`videos[${index}][title]`, video.title);
            formData.append(`videos[${index}][video_url]`, video.video_url);
            formData.append(`videos[${index}][platform]`, video.platform);
        });

        if (project) {
            formData.append('_method', 'PUT');
            post(`/admin/projects/${project.slug}`, {
                forceFormData: true,
            });
        } else {
            post('/admin/projects', {
                forceFormData: true,
            });
        }
    };

    // Tech stack handlers
    const addTech = () => {
        if (techInput.trim() && !data.tech_stack.includes(techInput.trim())) {
            setData('tech_stack', [...data.tech_stack, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setData('tech_stack', data.tech_stack.filter(t => t !== tech));
    };

    // Tags handlers
    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter(t => t !== tag));
    };

    // Image handlers
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_image', file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setData('gallery_images', [...data.gallery_images, ...Array.from(files)]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setData('gallery_images', data.gallery_images.filter((_, i) => i !== index));
    };

    const deleteExistingImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(`/admin/projects/${project?.slug}/images/${imageId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setExistingImages(existingImages.filter(img => img.id !== imageId));
                },
            });
        }
    };

    // Features handlers
    const addFeature = () => {
        setData('features', [...data.features, { title: '', description: '', icon: '' }]);
    };

    const updateFeature = (index: number, field: keyof ProjectFeature, value: string) => {
        const updated = [...data.features];
        updated[index] = { ...updated[index], [field]: value };
        setData('features', updated);
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    // Metrics handlers
    const addMetric = () => {
        setData('metrics', [...data.metrics, { name: '', value: '', description: '' }]);
    };

    const updateMetric = (index: number, field: keyof ProjectMetric, value: string) => {
        const updated = [...data.metrics];
        updated[index] = { ...updated[index], [field]: value };
        setData('metrics', updated);
    };

    const removeMetric = (index: number) => {
        setData('metrics', data.metrics.filter((_, i) => i !== index));
    };

    // Videos handlers
    const addVideo = () => {
        setData('videos', [...data.videos, { title: '', video_url: '', platform: 'youtube' }]);
    };

    const updateVideo = (index: number, field: keyof ProjectVideo, value: string) => {
        const updated = [...data.videos];
        updated[index] = { ...updated[index], [field]: value };
        setData('videos', updated);
    };

    const removeVideo = (index: number) => {
        setData('videos', data.videos.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={project ? 'Edit Project' : 'New Project'} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.visit('/admin/projects')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <FolderKanban className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {project ? 'Edit Project' : 'New Project'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {project ? 'Update project details' : 'Add a new project to your portfolio'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-8 pb-8">
                    {/* Basic Information */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Title */}
                            <div className="lg:col-span-2">
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Human Activity Recognition System"
                                    className="mt-1"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="auto-generated-from-title"
                                    className="mt-1"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Leave empty to auto-generate from title
                                </p>
                                {errors.slug && (
                                    <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                                )}
                            </div>

                            {/* Project Type */}
                            <div>
                                <Label htmlFor="project_type_id">Project Type *</Label>
                                <select
                                    id="project_type_id"
                                    value={data.project_type_id}
                                    onChange={(e) => setData('project_type_id', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    {projectTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {errors.project_type_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.project_type_id}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Status *</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <Label htmlFor="role">Your Role</Label>
                                <Input
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    placeholder="e.g., Lead Developer, Researcher"
                                    className="mt-1"
                                />
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="lg:col-span-2">
                                <Label htmlFor="short_description">Short Description *</Label>
                                <textarea
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="Brief summary of the project (max 500 characters)"
                                    rows={3}
                                    maxLength={500}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {data.short_description.length}/500 characters
                                </p>
                                {errors.short_description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.short_description}</p>
                                )}
                            </div>

                            {/* Detailed Description */}
                            <div className="lg:col-span-2">
                                <Label htmlFor="detailed_description">Detailed Description</Label>
                                <textarea
                                    id="detailed_description"
                                    value={data.detailed_description}
                                    onChange={(e) => setData('detailed_description', e.target.value)}
                                    placeholder="Full project description, methodology, results..."
                                    rows={6}
                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                {errors.detailed_description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.detailed_description}</p>
                                )}
                            </div>

                            {/* Dataset Used */}
                            <div className="lg:col-span-2">
                                <Label htmlFor="dataset_used">Dataset Used</Label>
                                <Input
                                    id="dataset_used"
                                    value={data.dataset_used}
                                    onChange={(e) => setData('dataset_used', e.target.value)}
                                    placeholder="e.g., UCF-101, ImageNet, Custom Dataset"
                                    className="mt-1"
                                />
                                {errors.dataset_used && (
                                    <p className="mt-1 text-sm text-red-500">{errors.dataset_used}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack & Tags */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Tech Stack & Tags</h2>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Tech Stack */}
                            <div>
                                <Label>Tech Stack</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTech();
                                            }
                                        }}
                                        placeholder="Add technology..."
                                    />
                                    <Button type="button" onClick={addTech} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {data.tech_stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs font-medium"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTech(tech)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label>Tags</Label>
                                <div className="mt-1 flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                        placeholder="Add tag..."
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {data.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-cyan-800 dark:hover:text-cyan-200"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Project Links</h2>
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div>
                                <Label htmlFor="github_url">GitHub URL</Label>
                                <Input
                                    id="github_url"
                                    type="url"
                                    value={data.github_url}
                                    onChange={(e) => setData('github_url', e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="mt-1"
                                />
                                {errors.github_url && (
                                    <p className="mt-1 text-sm text-red-500">{errors.github_url}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="live_url">Live Demo URL</Label>
                                <Input
                                    id="live_url"
                                    type="url"
                                    value={data.live_url}
                                    onChange={(e) => setData('live_url', e.target.value)}
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                                {errors.live_url && (
                                    <p className="mt-1 text-sm text-red-500">{errors.live_url}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="paper_url">Paper/Publication URL</Label>
                                <Input
                                    id="paper_url"
                                    type="url"
                                    value={data.paper_url}
                                    onChange={(e) => setData('paper_url', e.target.value)}
                                    placeholder="https://arxiv.org/..."
                                    className="mt-1"
                                />
                                {errors.paper_url && (
                                    <p className="mt-1 text-sm text-red-500">{errors.paper_url}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Images</h2>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Thumbnail */}
                            <div>
                                <Label>Thumbnail Image</Label>
                                <div
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="mt-1 flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
                                >
                                    {thumbnailPreview ? (
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Click to upload thumbnail
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Max 2MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />
                                {errors.thumbnail_image && (
                                    <p className="mt-1 text-sm text-red-500">{errors.thumbnail_image}</p>
                                )}
                            </div>

                            {/* Cover Image */}
                            <div>
                                <Label>Cover Image</Label>
                                <div
                                    onClick={() => coverInputRef.current?.click()}
                                    className="mt-1 flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50"
                                >
                                    {coverPreview ? (
                                        <img
                                            src={coverPreview}
                                            alt="Cover preview"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Click to upload cover
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Max 4MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                />
                                {errors.cover_image && (
                                    <p className="mt-1 text-sm text-red-500">{errors.cover_image}</p>
                                )}
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <Label>Image Gallery</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => galleryInputRef.current?.click()}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Add Images
                                </Button>
                            </div>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                className="hidden"
                            />
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                {/* Existing images */}
                                {existingImages.map((image) => (
                                    <div key={image.id} className="group relative aspect-video">
                                        <img
                                            src={image.image_url || `/storage/${image.image_path}`}
                                            alt={image.alt_text || ''}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingImage(image.id)}
                                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {/* New images to upload */}
                                {data.gallery_images.map((file, index) => (
                                    <div key={index} className="group relative aspect-video">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New image ${index + 1}`}
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                        <span className="absolute left-1 top-1 rounded bg-cyan-500 px-1.5 py-0.5 text-[10px] text-white">
                                            New
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="rounded-xl border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                <h2 className="text-lg font-semibold">Key Features</h2>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Feature
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-4 rounded-lg border p-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-3">
                                            <div className="w-20">
                                                <Input
                                                    value={feature.icon}
                                                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                    placeholder="🔥"
                                                    className="text-center"
                                                />
                                            </div>
                                            <Input
                                                value={feature.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                placeholder="Feature title"
                                                className="flex-1"
                                            />
                                        </div>
                                        <Input
                                            value={feature.description}
                                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                            placeholder="Feature description"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFeature(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            {data.features.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No features added yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="rounded-xl border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-green-500" />
                                <h2 className="text-lg font-semibold">Project Metrics</h2>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Metric
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.metrics.map((metric, index) => (
                                <div key={index} className="flex gap-4 rounded-lg border p-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-3">
                                            <Input
                                                value={metric.name}
                                                onChange={(e) => updateMetric(index, 'name', e.target.value)}
                                                placeholder="Metric name (e.g., Accuracy)"
                                                className="flex-1"
                                            />
                                            <Input
                                                value={metric.value}
                                                onChange={(e) => updateMetric(index, 'value', e.target.value)}
                                                placeholder="Value (e.g., 94.2%)"
                                                className="w-32"
                                            />
                                        </div>
                                        <Input
                                            value={metric.description}
                                            onChange={(e) => updateMetric(index, 'description', e.target.value)}
                                            placeholder="Description (optional)"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMetric(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            {data.metrics.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No metrics added yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Videos */}
                    <div className="rounded-xl border p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-red-500" />
                                <h2 className="text-lg font-semibold">Demo Videos</h2>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addVideo}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Video
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.videos.map((video, index) => (
                                <div key={index} className="flex gap-4 rounded-lg border p-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-3">
                                            <Input
                                                value={video.title}
                                                onChange={(e) => updateVideo(index, 'title', e.target.value)}
                                                placeholder="Video title"
                                                className="flex-1"
                                            />
                                            <select
                                                value={video.platform}
                                                onChange={(e) => updateVideo(index, 'platform', e.target.value)}
                                                className="w-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                            >
                                                <option value="youtube">YouTube</option>
                                                <option value="vimeo">Vimeo</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <Input
                                            value={video.video_url}
                                            onChange={(e) => updateVideo(index, 'video_url', e.target.value)}
                                            placeholder="Video URL"
                                            type="url"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeVideo(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            {data.videos.length === 0 && (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No videos added yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="rounded-xl border p-6">
                        <h2 className="mb-4 text-lg font-semibold">Settings</h2>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Display Order */}
                            <div>
                                <Label htmlFor="display_order">Display Order</Label>
                                <Input
                                    id="display_order"
                                    type="number"
                                    min="0"
                                    value={data.display_order}
                                    onChange={(e) => setData('display_order', e.target.value)}
                                    className="mt-1 w-32"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>

                            {/* Featured */}
                            <div className="flex items-center justify-between lg:col-span-1">
                                <div>
                                    <Label>Featured Project</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Highlight on homepage
                                    </p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-500 peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between lg:col-span-1">
                                <div>
                                    <Label>Active Status</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show on public site
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
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/projects')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
