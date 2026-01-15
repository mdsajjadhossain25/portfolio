<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillRequest;
use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    /**
     * Display a listing of skills.
     */
    public function index(): Response
    {
        $categories = SkillCategory::with(['skills' => fn ($q) => $q->ordered()])
            ->ordered()
            ->get();

        return Inertia::render('admin/about/skills/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create(): Response
    {
        $categories = SkillCategory::active()->ordered()->get();

        return Inertia::render('admin/about/skills/SkillForm', [
            'skill' => null,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created skill.
     */
    public function store(SkillRequest $request): RedirectResponse
    {
        Skill::create($request->validated());

        return redirect()
            ->route('admin.about.skills.index')
            ->with('success', 'Skill created successfully.');
    }

    /**
     * Show the form for editing a skill.
     */
    public function edit(Skill $skill): Response
    {
        $categories = SkillCategory::active()->ordered()->get();

        return Inertia::render('admin/about/skills/SkillForm', [
            'skill' => $skill->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified skill.
     */
    public function update(SkillRequest $request, Skill $skill): RedirectResponse
    {
        $skill->update($request->validated());

        return redirect()
            ->route('admin.about.skills.index')
            ->with('success', 'Skill updated successfully.');
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->delete();

        return redirect()
            ->route('admin.about.skills.index')
            ->with('success', 'Skill deleted successfully.');
    }

    /**
     * Update the display order of skills.
     */
    public function reorder(): RedirectResponse
    {
        $validated = request()->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.display_order' => 'required|integer',
        ]);

        foreach ($validated['skills'] as $skillData) {
            Skill::where('id', $skillData['id'])
                ->update(['display_order' => $skillData['display_order']]);
        }

        return redirect()
            ->back()
            ->with('success', 'Skills reordered successfully.');
    }
}
