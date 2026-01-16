<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogCategoryRequest;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of blog categories.
     */
    public function index(): Response
    {
        $categories = BlogCategory::ordered()
            ->withCount(['posts' => function ($query) {
                $query->where('status', 'published');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'display_order' => $category->display_order,
                    'posts_count' => $category->posts_count,
                    'created_at' => $category->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/blog/categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('admin/blog/categories/CategoryForm', [
            'category' => null,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(BlogCategoryRequest $request)
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        BlogCategory::create($data);

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing a category.
     */
    public function edit(BlogCategory $category): Response
    {
        return Inertia::render('admin/blog/categories/CategoryForm', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'display_order' => $category->display_order,
            ],
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(BlogCategoryRequest $request, BlogCategory $category)
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(BlogCategory $category)
    {
        $postsCount = $category->posts()->count();

        if ($postsCount > 0) {
            return back()->with('error', 
                "Cannot delete category. It has {$postsCount} post(s) attached. Remove posts from this category first."
            );
        }

        $category->delete();

        return redirect()->route('admin.blog.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    /**
     * Reorder categories.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:blog_categories,id',
            'categories.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($request->categories as $categoryData) {
            BlogCategory::where('id', $categoryData['id'])
                ->update(['display_order' => $categoryData['display_order']]);
        }

        return back()->with('success', 'Categories reordered successfully.');
    }
}
