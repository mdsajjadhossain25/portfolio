<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogPostRequest;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request): Response
    {
        $query = BlogPost::with(['categories', 'tags'])
            ->withCount('comments');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->inCategory($request->category);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query->latest('created_at')
            ->paginate(10)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'cover_url' => $post->cover_url,
                    'author_name' => $post->author_name,
                    'reading_time' => $post->reading_time,
                    'status' => $post->status,
                    'is_featured' => $post->is_featured,
                    'views_count' => $post->views_count,
                    'published_at' => $post->published_at?->format('Y-m-d H:i'),
                    'formatted_date' => $post->formatted_date,
                    'categories' => $post->categories->map(fn ($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'slug' => $c->slug,
                    ]),
                    'tags' => $post->tags->map(fn ($t) => [
                        'id' => $t->id,
                        'name' => $t->name,
                        'slug' => $t->slug,
                    ]),
                    'comments_count' => $post->comments_count,
                    'created_at' => $post->created_at->format('Y-m-d H:i'),
                ];
            });

        $categories = BlogCategory::ordered()->get(['id', 'name', 'slug']);
        
        return Inertia::render('admin/blog/posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['status', 'category', 'search']),
            'statuses' => BlogPost::STATUSES,
        ]);
    }

    /**
     * Show the form for creating a new blog post.
     */
    public function create(): Response
    {
        $categories = BlogCategory::ordered()->get(['id', 'name']);
        $tags = BlogTag::ordered()->get(['id', 'name']);

        return Inertia::render('admin/blog/posts/PostForm', [
            'post' => null,
            'categories' => $categories,
            'tags' => $tags,
            'statuses' => BlogPost::STATUSES,
        ]);
    }

    /**
     * Store a newly created blog post.
     */
    public function store(BlogPostRequest $request)
    {
        $data = $request->validated();

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')
                ->store('blog/covers', 'public');
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Set published_at if publishing
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Set default author if not provided
        if (empty($data['author_name'])) {
            $data['author_name'] = 'Sajjad Hossain';
        }

        $post = BlogPost::create($data);

        // Sync categories and tags
        if (isset($data['categories'])) {
            $post->categories()->sync($data['categories']);
        }
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return redirect()->route('admin.blog.posts.index')
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Show the form for editing a blog post.
     */
    public function edit(BlogPost $post): Response
    {
        $post->load(['categories', 'tags']);
        
        $categories = BlogCategory::ordered()->get(['id', 'name']);
        $tags = BlogTag::ordered()->get(['id', 'name']);

        return Inertia::render('admin/blog/posts/PostForm', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'cover_image' => $post->cover_image,
                'cover_url' => $post->cover_url,
                'author_name' => $post->author_name,
                'reading_time' => $post->reading_time,
                'status' => $post->status,
                'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
                'is_featured' => $post->is_featured,
                'meta_title' => $post->meta_title,
                'meta_description' => $post->meta_description,
                'category_ids' => $post->categories->pluck('id')->toArray(),
                'tag_ids' => $post->tags->pluck('id')->toArray(),
            ],
            'categories' => $categories,
            'tags' => $tags,
            'statuses' => BlogPost::STATUSES,
        ]);
    }

    /**
     * Update the specified blog post.
     */
    public function update(BlogPostRequest $request, BlogPost $post)
    {
        $data = $request->validated();

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old image
            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')
                ->store('blog/covers', 'public');
        }

        // Set published_at if publishing for the first time
        if ($data['status'] === 'published' && !$post->published_at && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post->update($data);

        // Sync categories and tags
        if (isset($data['categories'])) {
            $post->categories()->sync($data['categories']);
        }
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        return redirect()->route('admin.blog.posts.index')
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified blog post.
     */
    public function destroy(BlogPost $post)
    {
        // Delete cover image
        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return redirect()->route('admin.blog.posts.index')
            ->with('success', 'Blog post deleted successfully.');
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(BlogPost $post)
    {
        $post->update(['is_featured' => !$post->is_featured]);

        return back()->with('success', 
            $post->is_featured ? 'Post marked as featured.' : 'Post removed from featured.'
        );
    }

    /**
     * Toggle publish status.
     */
    public function togglePublish(BlogPost $post)
    {
        if ($post->status === 'published') {
            $post->update(['status' => 'draft']);
            $message = 'Post moved to draft.';
        } else {
            $post->update([
                'status' => 'published',
                'published_at' => $post->published_at ?? now(),
            ]);
            $message = 'Post published successfully.';
        }

        return back()->with('success', $message);
    }

    /**
     * Preview a blog post.
     */
    public function preview(BlogPost $post): Response
    {
        $post->load(['categories', 'tags', 'approvedComments']);

        return Inertia::render('admin/blog/posts/Preview', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'cover_url' => $post->cover_url,
                'author_name' => $post->author_name,
                'reading_time_text' => $post->reading_time_text,
                'formatted_date' => $post->formatted_date,
                'status' => $post->status,
                'categories' => $post->categories,
                'tags' => $post->tags,
            ],
        ]);
    }
}
