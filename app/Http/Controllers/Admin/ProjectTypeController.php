<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectTypeRequest;
use App\Models\ProjectType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTypeController extends Controller
{
    /**
     * Display a listing of project types.
     */
    public function index(): Response
    {
        $projectTypes = ProjectType::withCount('projects')
            ->ordered()
            ->get();

        return Inertia::render('admin/project-types/Index', [
            'projectTypes' => $projectTypes,
            'colors' => ProjectType::COLORS,
        ]);
    }

    /**
     * Show the form for creating a new project type.
     */
    public function create(): Response
    {
        return Inertia::render('admin/project-types/ProjectTypeForm', [
            'projectType' => null,
            'colors' => ProjectType::COLORS,
        ]);
    }

    /**
     * Store a newly created project type.
     */
    public function store(ProjectTypeRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Ensure unique slug
        $data['slug'] = $this->ensureUniqueSlug($data['slug']);

        ProjectType::create($data);

        return redirect()->route('admin.project-types.index')
            ->with('success', 'Project type created successfully.');
    }

    /**
     * Show the form for editing a project type.
     */
    public function edit(ProjectType $projectType): Response
    {
        return Inertia::render('admin/project-types/ProjectTypeForm', [
            'projectType' => $projectType,
            'colors' => ProjectType::COLORS,
        ]);
    }

    /**
     * Update the specified project type.
     */
    public function update(ProjectTypeRequest $request, ProjectType $projectType): RedirectResponse
    {
        $data = $request->validated();

        // Update slug if name changed and slug not manually set
        if (empty($data['slug']) || $data['slug'] === $projectType->slug) {
            if ($projectType->name !== $data['name']) {
                $data['slug'] = $this->ensureUniqueSlug(Str::slug($data['name']), $projectType->id);
            }
        } else {
            $data['slug'] = $this->ensureUniqueSlug($data['slug'], $projectType->id);
        }

        $projectType->update($data);

        return redirect()->route('admin.project-types.index')
            ->with('success', 'Project type updated successfully.');
    }

    /**
     * Remove the specified project type.
     */
    public function destroy(ProjectType $projectType): RedirectResponse
    {
        // Check if there are projects using this type
        if ($projectType->projects()->exists()) {
            return redirect()->route('admin.project-types.index')
                ->with('error', 'Cannot delete project type that has projects assigned. Please reassign the projects first.');
        }

        $projectType->delete();

        return redirect()->route('admin.project-types.index')
            ->with('success', 'Project type deleted successfully.');
    }

    /**
     * Reorder project types.
     */
    public function reorder(): RedirectResponse
    {
        $order = request()->input('order', []);

        foreach ($order as $index => $id) {
            ProjectType::where('id', $id)->update(['display_order' => $index]);
        }

        return redirect()->back()->with('success', 'Project types reordered successfully.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(ProjectType $projectType): RedirectResponse
    {
        $projectType->update(['is_active' => !$projectType->is_active]);

        $status = $projectType->is_active ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Project type {$status} successfully.");
    }

    /**
     * Ensure the slug is unique.
     */
    private function ensureUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while (true) {
            $query = ProjectType::where('slug', $slug);
            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
