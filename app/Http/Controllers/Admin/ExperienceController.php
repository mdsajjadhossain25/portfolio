<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    /**
     * Display a listing of experiences.
     */
    public function index(): Response
    {
        $experiences = Experience::ordered()->get();

        return Inertia::render('admin/about/experiences/Index', [
            'experiences' => $experiences->map(function ($experience) {
                return [
                    'id' => $experience->id,
                    'title' => $experience->title,
                    'company' => $experience->company,
                    'location' => $experience->location,
                    'type' => $experience->type,
                    'start_date' => $experience->start_date->format('Y-m-d'),
                    'end_date' => $experience->end_date?->format('Y-m-d'),
                    'date_range' => $experience->date_range,
                    'is_current' => $experience->is_current,
                    'description' => $experience->description,
                    'highlights' => $experience->highlights,
                    'display_order' => $experience->display_order,
                    'is_active' => $experience->is_active,
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new experience.
     */
    public function create(): Response
    {
        return Inertia::render('admin/about/experiences/ExperienceForm', [
            'experience' => null,
        ]);
    }

    /**
     * Store a newly created experience.
     */
    public function store(ExperienceRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        // Set display order to max + 1 if not provided
        if (!isset($data['display_order'])) {
            $data['display_order'] = Experience::max('display_order') + 1;
        }

        Experience::create($data);

        return redirect()
            ->route('admin.about.experiences.index')
            ->with('success', 'Experience created successfully.');
    }

    /**
     * Show the form for editing an experience.
     */
    public function edit(Experience $experience): Response
    {
        return Inertia::render('admin/about/experiences/ExperienceForm', [
            'experience' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'company' => $experience->company,
                'location' => $experience->location,
                'type' => $experience->type,
                'start_date' => $experience->start_date->format('Y-m-d'),
                'end_date' => $experience->end_date?->format('Y-m-d'),
                'is_current' => $experience->is_current,
                'description' => $experience->description,
                'highlights' => $experience->highlights,
                'display_order' => $experience->display_order,
                'is_active' => $experience->is_active,
            ],
        ]);
    }

    /**
     * Update the specified experience.
     */
    public function update(ExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $experience->update($request->validated());

        return redirect()
            ->route('admin.about.experiences.index')
            ->with('success', 'Experience updated successfully.');
    }

    /**
     * Remove the specified experience.
     */
    public function destroy(Experience $experience): RedirectResponse
    {
        $experience->delete();

        return redirect()
            ->route('admin.about.experiences.index')
            ->with('success', 'Experience deleted successfully.');
    }

    /**
     * Reorder experiences.
     */
    public function reorder(): RedirectResponse
    {
        $order = request()->input('order', []);

        foreach ($order as $index => $id) {
            Experience::where('id', $id)->update(['display_order' => $index]);
        }

        return redirect()
            ->route('admin.about.experiences.index')
            ->with('success', 'Experiences reordered successfully.');
    }
}
