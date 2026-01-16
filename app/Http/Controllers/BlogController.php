<?php

namespace App\Http\Controllers;

use App\Http\Requests\BlogCommentRequest;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\BlogComment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display the blog listing page.
     */
    public function index(Request $request): Response
    {
        // Get featured post
        $featuredPost = BlogPost::published()
            ->featured()
            ->with(['categories', 'tags'])
            ->latest('published_at')
            ->first();

        // Build query for posts
        $query = BlogPost::published()
            ->with(['categories', 'tags']);

        // Exclude featured from main list
        if ($featuredPost) {
            $query->where('id', '!=', $featuredPost->id);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->inCategory($request->category);
        }

        // Filter by tag
        if ($request->filled('tag')) {
            $query->withTag($request->tag);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $posts = $query->latest('published_at')
            ->paginate(9)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'cover_url' => $post->cover_url,
                    'author_name' => $post->author_name,
                    'reading_time_text' => $post->reading_time_text,
                    'formatted_date' => $post->formatted_date,
                    'categories' => $post->categories->map(fn ($c) => [
                        'name' => $c->name,
                        'slug' => $c->slug,
                    ]),
                    'tags' => $post->tags->map(fn ($t) => [
                        'name' => $t->name,
                        'slug' => $t->slug,
                    ]),
                ];
            });

        // Get all categories and tags for filters
        $categories = BlogCategory::ordered()
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->get()
            ->map(fn ($c) => [
                'name' => $c->name,
                'slug' => $c->slug,
                'posts_count' => $c->posts_count,
            ]);

        $tags = BlogTag::ordered()
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->get()
            ->map(fn ($t) => [
                'name' => $t->name,
                'slug' => $t->slug,
                'posts_count' => $t->posts_count,
            ]);

        return Inertia::render('Blog', [
            'featuredPost' => $featuredPost ? [
                'id' => $featuredPost->id,
                'title' => $featuredPost->title,
                'slug' => $featuredPost->slug,
                'excerpt' => $featuredPost->excerpt,
                'cover_url' => $featuredPost->cover_url,
                'author_name' => $featuredPost->author_name,
                'reading_time_text' => $featuredPost->reading_time_text,
                'formatted_date' => $featuredPost->formatted_date,
                'categories' => $featuredPost->categories->map(fn ($c) => [
                    'name' => $c->name,
                    'slug' => $c->slug,
                ]),
            ] : null,
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['category', 'tag', 'search']),
        ]);
    }

    /**
     * Display a single blog post.
     */
    public function show(string $slug): Response
    {
        $post = BlogPost::where('slug', $slug)
            ->published()
            ->with(['categories', 'tags', 'approvedComments'])
            ->firstOrFail();

        // Increment view count
        $post->incrementViews();

        // Get related posts (same categories)
        $relatedPosts = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function ($q) use ($post) {
                $q->whereIn('blog_categories.id', $post->categories->pluck('id'));
            })
            ->with('categories')
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'excerpt' => $p->excerpt,
                'cover_url' => $p->cover_url,
                'reading_time_text' => $p->reading_time_text,
                'formatted_date' => $p->formatted_date,
            ]);

        return Inertia::render('BlogShow', [
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
                'views_count' => $post->views_count,
                'categories' => $post->categories->map(fn ($c) => [
                    'name' => $c->name,
                    'slug' => $c->slug,
                ]),
                'tags' => $post->tags->map(fn ($t) => [
                    'name' => $t->name,
                    'slug' => $t->slug,
                ]),
                'comments' => $post->approvedComments->map(fn ($c) => [
                    'id' => $c->id,
                    'user_name' => $c->user_name,
                    'comment_body' => $c->comment_body,
                    'time_ago' => $c->time_ago,
                    'formatted_date' => $c->formatted_date,
                ]),
                'comments_count' => $post->approvedComments->count(),
                // Social sharing URLs
                'twitter_share_url' => $post->twitter_share_url,
                'linkedin_share_url' => $post->linkedin_share_url,
                'facebook_share_url' => $post->facebook_share_url,
                'url' => $post->url,
                // SEO meta
                'meta_title' => $post->meta_title_text,
                'meta_description' => $post->meta_description_text,
            ],
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Store a new comment.
     */
    public function storeComment(BlogCommentRequest $request, BlogPost $post)
    {
        // Check honeypot (anti-spam)
        if ($request->filled('honeypot')) {
            return back(); // Silently reject spam
        }

        // Rate limiting check (basic implementation)
        $recentComment = BlogComment::where('ip_address', $request->ip())
            ->where('created_at', '>=', now()->subMinutes(2))
            ->exists();

        if ($recentComment) {
            return back()->withErrors([
                'comment_body' => 'Please wait a moment before posting another comment.'
            ]);
        }

        BlogComment::create([
            'blog_post_id' => $post->id,
            'user_name' => $request->user_name,
            'user_email' => $request->user_email,
            'comment_body' => $request->comment_body,
            'is_approved' => false, // Requires moderation
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Your comment has been submitted and is pending approval.');
    }
}
