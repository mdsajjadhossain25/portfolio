<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectType;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::with('projectType')
            ->active()
            ->ordered()
            ->get()
            ->map(fn ($project) => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'short_description' => $project->short_description,
                'project_type_id' => $project->project_type_id,
                'project_type_slug' => $project->project_type_slug,
                'project_type_label' => $project->project_type_label,
                'project_type_color' => $project->project_type_color,
                'tech_stack' => $project->tech_stack ?? [],
                'tags' => $project->tags ?? [],
                'thumbnail_url' => $project->thumbnail_url,
                'github_url' => $project->github_url,
                'live_url' => $project->live_url,
                'paper_url' => $project->paper_url,
                'is_featured' => $project->is_featured,
                'status' => $project->status,
                'status_label' => $project->status_label,
            ]);

        $featuredProjects = $projects->filter(fn ($p) => $p['is_featured']);

        // Get project types as array with id, name, slug, color
        $projectTypes = ProjectType::active()
            ->ordered()
            ->get()
            ->map(fn ($type) => [
                'id' => $type->id,
                'name' => $type->name,
                'slug' => $type->slug,
                'color' => $type->color,
            ]);

        return Inertia::render('Projects', [
            'projects' => $projects->values(),
            'featuredProjects' => $featuredProjects->values(),
            'projectTypes' => $projectTypes,
        ]);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): Response
    {
        // Ensure project is active
        if (!$project->is_active) {
            abort(404);
        }

        $project->load(['images', 'features', 'metrics', 'videos', 'projectType']);

        return Inertia::render('ProjectShow', [
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'short_description' => $project->short_description,
                'detailed_description' => $project->detailed_description,
                'project_type_id' => $project->project_type_id,
                'project_type_slug' => $project->project_type_slug,
                'project_type_label' => $project->project_type_label,
                'project_type_color' => $project->project_type_color,
                'tech_stack' => $project->tech_stack ?? [],
                'tags' => $project->tags ?? [],
                'thumbnail_url' => $project->thumbnail_url,
                'cover_url' => $project->cover_url,
                'github_url' => $project->github_url,
                'live_url' => $project->live_url,
                'paper_url' => $project->paper_url,
                'dataset_used' => $project->dataset_used,
                'role' => $project->role,
                'is_featured' => $project->is_featured,
                'status' => $project->status,
                'status_label' => $project->status_label,
                'images' => $project->images->map(fn ($image) => [
                    'id' => $image->id,
                    'image_url' => $image->image_url,
                    'alt_text' => $image->alt_text,
                    'caption' => $image->caption,
                ]),
                'features' => $project->features->map(fn ($feature) => [
                    'id' => $feature->id,
                    'title' => $feature->title,
                    'description' => $feature->description,
                    'icon' => $feature->icon,
                ]),
                'metrics' => $project->metrics->map(fn ($metric) => [
                    'id' => $metric->id,
                    'name' => $metric->name,
                    'value' => $metric->value,
                    'description' => $metric->description,
                ]),
                'videos' => $project->videos->map(fn ($video) => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'video_url' => $video->video_url,
                    'embed_url' => $video->embed_url,
                    'platform' => $video->platform,
                    'thumbnail_url' => $video->thumbnail_url,
                ]),
            ],
            'relatedProjects' => Project::with('projectType')
                ->active()
                ->where('id', '!=', $project->id)
                ->where('project_type_id', $project->project_type_id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'slug' => $p->slug,
                    'short_description' => $p->short_description,
                    'project_type_label' => $p->project_type_label,
                    'project_type_color' => $p->project_type_color,
                    'thumbnail_url' => $p->thumbnail_url,
                    'tech_stack' => $p->tech_stack ?? [],
                ]),
        ]);
    }
}
