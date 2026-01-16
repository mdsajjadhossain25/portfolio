import { Head, useForm, router } from '@inertiajs/react';
import { 
    FileText, 
    Save, 
    ArrowLeft, 
    Upload, 
    X,
    Image as ImageIcon,
    Calendar,
    Eye
} from 'lucide-react';
import { FormEventHandler, useState, useRef } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    cover_url: string | null;
    author_name: string;
    reading_time: number | null;
    status: string;
    published_at: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    category_ids: number[];
    tag_ids: number[];
}

interface Props {
    post: Post | null;
    categories: Category[];
    tags: Tag[];
    statuses: Record<string, string>;
}

export default function PostForm({ post, categories, tags, statuses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog', href: '/admin/blog/posts' },
        { title: 'Posts', href: '/admin/blog/posts' },
        { title: post ? 'Edit Post' : 'New Post', href: '#' },
    ];

    const coverInputRef = useRef<HTMLInputElement>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(post?.cover_url || null);

    const { data, setData, post: submitPost, processing, errors } = useForm<{
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        cover_image: File | null;
        author_name: string;
        status: string;
        published_at: string;
        is_featured: boolean;
        meta_title: string;
        meta_description: string;
        categories: number[];
        tags: number[];
        _method?: string;
    }>({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        cover_image: null,
        author_name: post?.author_name || 'Sajjad Hossain',
        status: post?.status || 'draft',
        published_at: post?.published_at || '',
        is_featured: post?.is_featured || false,
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        categories: post?.category_ids || [],
        tags: post?.tag_ids || [],
        _method: post ? 'PUT' : undefined,
    });

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const removeCover = () => {
        setData('cover_image', null);
        setCoverPreview(null);
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    const handleCategoryToggle = (categoryId: number) => {
        if (data.categories.includes(categoryId)) {
            setData('categories', data.categories.filter(id => id !== categoryId));
        } else {
            setData('categories', [...data.categories, categoryId]);
        }
    };

    const handleTagToggle = (tagId: number) => {
        if (data.tags.includes(tagId)) {
            setData('tags', data.tags.filter(id => id !== tagId));
        } else {
            setData('tags', [...data.tags, tagId]);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const url = post ? `/admin/blog/posts/${post.id}` : '/admin/blog/posts';
        
        submitPost(url, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={post ? 'Edit Post' : 'New Post'} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {post ? 'Edit Post' : 'New Post'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {post ? 'Update your blog post' : 'Create a new blog post'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/blog/posts')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title & Slug */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter post title..."
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">
                                    Slug <span className="text-muted-foreground">(auto-generated if empty)</span>
                                </Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="post-url-slug"
                                />
                                {errors.slug && (
                                    <p className="text-sm text-red-500">{errors.slug}</p>
                                )}
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="rounded-xl border p-6 space-y-2">
                            <Label htmlFor="excerpt">
                                Excerpt <span className="text-muted-foreground">(short summary)</span>
                            </Label>
                            <textarea
                                id="excerpt"
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                placeholder="A brief summary of your post..."
                                rows={3}
                                className="w-full px-3 py-2 border border-input bg-transparent rounded-lg focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {data.excerpt.length}/500
                            </p>
                            {errors.excerpt && (
                                <p className="text-sm text-red-500">{errors.excerpt}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="rounded-xl border p-6 space-y-2">
                            <Label htmlFor="content">
                                Content <span className="text-red-500">*</span>
                                <span className="text-muted-foreground ml-2">(Markdown supported)</span>
                            </Label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Write your post content here... Markdown is supported."
                                rows={20}
                                className="w-full px-3 py-2 border border-input bg-transparent rounded-lg focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-y font-mono text-sm"
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500">{errors.content}</p>
                            )}
                        </div>

                        {/* SEO Settings */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <h3 className="font-semibold">SEO Settings</h3>
                            
                            <div className="space-y-2">
                                <Label htmlFor="meta_title">
                                    Meta Title <span className="text-muted-foreground">(max 70 characters)</span>
                                </Label>
                                <Input
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder="SEO title (defaults to post title)"
                                    maxLength={70}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {data.meta_title.length}/70
                                </p>
                                {errors.meta_title && (
                                    <p className="text-sm text-red-500">{errors.meta_title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta_description">
                                    Meta Description <span className="text-muted-foreground">(max 160 characters)</span>
                                </Label>
                                <textarea
                                    id="meta_description"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder="SEO description (defaults to excerpt)"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-input bg-transparent rounded-lg focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                                    maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {data.meta_description.length}/160
                                </p>
                                {errors.meta_description && (
                                    <p className="text-sm text-red-500">{errors.meta_description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <h3 className="font-semibold">Publish Settings</h3>
                            
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Publish Date
                                </Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary"
                                />
                                <Label htmlFor="is_featured" className="cursor-pointer">
                                    Featured Post
                                </Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author_name">Author</Label>
                                <Input
                                    id="author_name"
                                    value={data.author_name}
                                    onChange={(e) => setData('author_name', e.target.value)}
                                    placeholder="Author name"
                                />
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <h3 className="font-semibold">Cover Image</h3>
                            
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                                className="hidden"
                            />

                            {coverPreview ? (
                                <div className="relative">
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full rounded-lg object-cover aspect-video"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCover}
                                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
                                >
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Click to upload</span>
                                </button>
                            )}
                            {errors.cover_image && (
                                <p className="text-sm text-red-500">{errors.cover_image}</p>
                            )}
                        </div>

                        {/* Categories */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <h3 className="font-semibold">Categories</h3>
                            
                            {categories.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label
                                            key={category.id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.categories.includes(category.id)}
                                                onChange={() => handleCategoryToggle(category.id)}
                                                className="w-4 h-4 rounded border-input bg-transparent text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No categories yet.</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="rounded-xl border p-6 space-y-4">
                            <h3 className="font-semibold">Tags</h3>
                            
                            {tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => handleTagToggle(tag.id)}
                                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                                data.tags.includes(tag.id)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No tags yet.</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/admin/blog/posts')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1 gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving...' : post ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
