<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogTagRequest;
use App\Models\BlogTag;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogTagController extends Controller
{
    /**
     * Display a listing of blog tags.
     */
    public function index(): Response
    {
        $tags = BlogTag::ordered()
            ->withCount(['posts' => function ($query) {
                $query->where('status', 'published');
            }])
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'posts_count' => $tag->posts_count,
                    'created_at' => $tag->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/blog/tags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new tag.
     */
    public function create(): Response
    {
        return Inertia::render('admin/blog/tags/TagForm', [
            'tag' => null,
        ]);
    }

    /**
     * Store a newly created tag.
     */
    public function store(BlogTagRequest $request)
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        BlogTag::create($data);

        return redirect()->route('admin.blog.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Show the form for editing a tag.
     */
    public function edit(BlogTag $tag): Response
    {
        return Inertia::render('admin/blog/tags/TagForm', [
            'tag' => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ],
        ]);
    }

    /**
     * Update the specified tag.
     */
    public function update(BlogTagRequest $request, BlogTag $tag)
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $tag->update($data);

        return redirect()->route('admin.blog.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(BlogTag $tag)
    {
        // Detach from all posts first
        $tag->posts()->detach();
        $tag->delete();

        return redirect()->route('admin.blog.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }
}
