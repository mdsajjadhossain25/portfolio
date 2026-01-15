<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillCategoryRequest;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SkillCategoryController extends Controller
{
    /**
     * Display a listing of skill categories.
     */
    public function index(): Response
    {
        $categories = SkillCategory::with('skills')
            ->ordered()
            ->get();

        return Inertia::render('admin/about/skills/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new skill category.
     */
    public function create(): Response
    {
        return Inertia::render('admin/about/skills/CategoryForm', [
            'category' => null,
        ]);
    }

    /**
     * Store a newly created skill category.
     */
    public function store(SkillCategoryRequest $request): RedirectResponse
    {
        SkillCategory::create($request->validated());

        return redirect()
            ->route('admin.about.skills.categories.index')
            ->with('success', 'Skill category created successfully.');
    }

    /**
     * Show the form for editing a skill category.
     */
    public function edit(SkillCategory $category): Response
    {
        return Inertia::render('admin/about/skills/CategoryForm', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified skill category.
     */
    public function update(SkillCategoryRequest $request, SkillCategory $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('admin.about.skills.categories.index')
            ->with('success', 'Skill category updated successfully.');
    }

    /**
     * Remove the specified skill category.
     */
    public function destroy(SkillCategory $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('admin.about.skills.categories.index')
            ->with('success', 'Skill category deleted successfully.');
    }

    /**
     * Update the display order of skill categories.
     */
    public function reorder(): RedirectResponse
    {
        $validated = request()->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:skill_categories,id',
            'categories.*.display_order' => 'required|integer',
        ]);

        foreach ($validated['categories'] as $categoryData) {
            SkillCategory::where('id', $categoryData['id'])
                ->update(['display_order' => $categoryData['display_order']]);
        }

        return redirect()
            ->back()
            ->with('success', 'Categories reordered successfully.');
    }
}
