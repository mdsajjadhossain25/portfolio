<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Models\Service;
use App\Models\ServiceFeature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request): Response
    {
        $query = Service::with('features')->ordered();

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Service type filter
        if ($type = $request->input('type')) {
            $query->where('service_type', $type);
        }

        // Status filter
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $services = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/services/Index', [
            'services' => $services,
            'filters' => $request->only(['search', 'type', 'active']),
            'serviceTypes' => $this->getServiceTypes(),
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create(): Response
    {
        return Inertia::render('admin/services/ServiceForm', [
            'service' => null,
            'serviceTypes' => $this->getServiceTypes(),
            'pricingModels' => $this->getPricingModels(),
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(ServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $features = $validated['features'] ?? [];
        unset($validated['features']);

        $service = Service::create($validated);

        // Create features
        foreach ($features as $index => $feature) {
            $service->features()->create([
                'feature_text' => $feature['feature_text'],
                'display_order' => $feature['display_order'] ?? $index,
            ]);
        }

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit(Service $service): Response
    {
        $service->load('features');

        return Inertia::render('admin/services/ServiceForm', [
            'service' => $service,
            'serviceTypes' => $this->getServiceTypes(),
            'pricingModels' => $this->getPricingModels(),
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();
        $features = $validated['features'] ?? [];
        unset($validated['features']);

        $service->update($validated);

        // Sync features: delete old and create new
        $service->features()->delete();
        foreach ($features as $index => $feature) {
            $service->features()->create([
                'feature_text' => $feature['feature_text'],
                'display_order' => $feature['display_order'] ?? $index,
            ]);
        }

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }

    /**
     * Toggle the active status of a service.
     */
    public function toggleActive(Service $service): RedirectResponse
    {
        $service->update(['is_active' => !$service->is_active]);

        return back()->with('success', 'Service status updated.');
    }

    /**
     * Toggle the featured status of a service.
     */
    public function toggleFeatured(Service $service): RedirectResponse
    {
        $service->update(['is_featured' => !$service->is_featured]);

        return back()->with('success', 'Featured status updated.');
    }

    /**
     * Reorder services.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'services' => ['required', 'array'],
            'services.*.id' => ['required', 'exists:services,id'],
            'services.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($request->input('services') as $item) {
            Service::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
        }

        return back()->with('success', 'Services reordered successfully.');
    }

    /**
     * Get available service types.
     */
    private function getServiceTypes(): array
    {
        return [
            ['value' => 'consulting', 'label' => 'Consulting'],
            ['value' => 'development', 'label' => 'Development'],
            ['value' => 'research', 'label' => 'Research'],
            ['value' => 'freelance', 'label' => 'Freelance'],
            ['value' => 'hiring', 'label' => 'Hiring'],
        ];
    }

    /**
     * Get available pricing models.
     */
    private function getPricingModels(): array
    {
        return [
            ['value' => 'hourly', 'label' => 'Hourly Rate'],
            ['value' => 'project', 'label' => 'Per Project'],
            ['value' => 'retainer', 'label' => 'Monthly Retainer'],
            ['value' => 'custom', 'label' => 'Custom Quote'],
        ];
    }
}
