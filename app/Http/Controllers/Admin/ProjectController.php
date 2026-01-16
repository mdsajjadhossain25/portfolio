<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Models\ProjectType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::with(['images', 'features', 'metrics', 'videos', 'projectType'])
            ->ordered()
            ->get()
            ->map(fn ($project) => [
                ...$project->toArray(),
                'thumbnail_url' => $project->thumbnail_url,
                'project_type_label' => $project->project_type_label,
                'project_type_slug' => $project->project_type_slug,
                'project_type_color' => $project->project_type_color,
                'status_label' => $project->status_label,
            ]);

        $projectTypes = ProjectType::active()->ordered()->get();

        return Inertia::render('admin/projects/Index', [
            'projects' => $projects,
            'projectTypes' => $projectTypes,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $projectTypes = ProjectType::active()->ordered()->get();

        return Inertia::render('admin/projects/ProjectForm', [
            'project' => null,
            'projectTypes' => $projectTypes,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(ProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail_image')) {
            $data['thumbnail_image'] = $request->file('thumbnail_image')
                ->store('projects/thumbnails', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')
                ->store('projects/covers', 'public');
        }

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Ensure unique slug
        $data['slug'] = $this->ensureUniqueSlug($data['slug']);

        // Create project
        $project = Project::create($data);

        // Handle gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $image) {
                $path = $image->store('projects/gallery', 'public');
                $project->images()->create([
                    'image_path' => $path,
                    'display_order' => $index,
                ]);
            }
        }

        // Handle features
        if (!empty($data['features'])) {
            foreach ($data['features'] as $index => $feature) {
                $project->features()->create([
                    ...$feature,
                    'display_order' => $index,
                ]);
            }
        }

        // Handle metrics
        if (!empty($data['metrics'])) {
            foreach ($data['metrics'] as $index => $metric) {
                $project->metrics()->create([
                    ...$metric,
                    'display_order' => $index,
                ]);
            }
        }

        // Handle videos
        if (!empty($data['videos'])) {
            foreach ($data['videos'] as $index => $video) {
                $project->videos()->create([
                    ...$video,
                    'display_order' => $index,
                ]);
            }
        }

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Show the form for editing a project.
     */
    public function edit(Project $project): Response
    {
        $project->load(['images', 'features', 'metrics', 'videos', 'projectType']);
        $projectTypes = ProjectType::active()->ordered()->get();

        return Inertia::render('admin/projects/ProjectForm', [
            'project' => [
                ...$project->toArray(),
                'thumbnail_url' => $project->thumbnail_url,
                'cover_url' => $project->cover_url,
            ],
            'projectTypes' => $projectTypes,
            'statuses' => Project::STATUSES,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail_image')) {
            // Delete old thumbnail
            if ($project->thumbnail_image) {
                Storage::disk('public')->delete($project->thumbnail_image);
            }
            $data['thumbnail_image'] = $request->file('thumbnail_image')
                ->store('projects/thumbnails', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover
            if ($project->cover_image) {
                Storage::disk('public')->delete($project->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')
                ->store('projects/covers', 'public');
        }

        // Generate slug if changed
        if (!empty($data['slug']) && $data['slug'] !== $project->slug) {
            $data['slug'] = $this->ensureUniqueSlug($data['slug'], $project->id);
        }

        // Update project
        $project->update($data);

        // Handle gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $image) {
                $path = $image->store('projects/gallery', 'public');
                $project->images()->create([
                    'image_path' => $path,
                    'display_order' => $project->images()->count() + $index,
                ]);
            }
        }

        // Update features
        if (isset($data['features'])) {
            $project->features()->delete();
            foreach ($data['features'] as $index => $feature) {
                $project->features()->create([
                    ...$feature,
                    'display_order' => $index,
                ]);
            }
        }

        // Update metrics
        if (isset($data['metrics'])) {
            $project->metrics()->delete();
            foreach ($data['metrics'] as $index => $metric) {
                $project->metrics()->create([
                    ...$metric,
                    'display_order' => $index,
                ]);
            }
        }

        // Update videos
        if (isset($data['videos'])) {
            $project->videos()->delete();
            foreach ($data['videos'] as $index => $video) {
                $project->videos()->create([
                    ...$video,
                    'display_order' => $index,
                ]);
            }
        }

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        // Delete images from storage
        if ($project->thumbnail_image) {
            Storage::disk('public')->delete($project->thumbnail_image);
        }
        if ($project->cover_image) {
            Storage::disk('public')->delete($project->cover_image);
        }
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * Toggle the featured status of a project.
     */
    public function toggleFeatured(Project $project): RedirectResponse
    {
        $project->update(['is_featured' => !$project->is_featured]);

        return redirect()
            ->back()
            ->with('success', 'Project featured status updated.');
    }

    /**
     * Toggle the active status of a project.
     */
    public function toggleActive(Project $project): RedirectResponse
    {
        $project->update(['is_active' => !$project->is_active]);

        return redirect()
            ->back()
            ->with('success', 'Project visibility updated.');
    }

    /**
     * Update the display order of projects.
     */
    public function reorder(): RedirectResponse
    {
        $validated = request()->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:projects,id',
            'projects.*.display_order' => 'required|integer',
        ]);

        foreach ($validated['projects'] as $projectData) {
            Project::where('id', $projectData['id'])
                ->update(['display_order' => $projectData['display_order']]);
        }

        return redirect()
            ->back()
            ->with('success', 'Projects reordered successfully.');
    }

    /**
     * Delete a project image.
     */
    public function deleteImage(Project $project, int $imageId): RedirectResponse
    {
        $image = $project->images()->findOrFail($imageId);
        
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return redirect()
            ->back()
            ->with('success', 'Image deleted successfully.');
    }

    /**
     * Ensure slug is unique.
     */
    private function ensureUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while (true) {
            $query = Project::where('slug', $slug);
            
            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
