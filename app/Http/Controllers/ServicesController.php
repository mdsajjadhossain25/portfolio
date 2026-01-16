<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display the public services page.
     */
    public function index(): Response
    {
        $services = Service::with('features')
            ->active()
            ->ordered()
            ->get();

        $featuredServices = $services->where('is_featured', true)->values();
        $regularServices = $services->where('is_featured', false)->values();

        // Group services by type for organized display
        $servicesByType = $services->groupBy('service_type')->map(function ($group) {
            return $group->values();
        });

        return Inertia::render('Services', [
            'featuredServices' => $featuredServices,
            'regularServices' => $regularServices,
            'servicesByType' => $servicesByType,
            'allServices' => $services,
        ]);
    }

    /**
     * Display a single service detail page.
     */
    public function show(Service $service): Response
    {
        if (!$service->is_active) {
            abort(404);
        }

        $service->load('features');

        // Get related services (same type, excluding current)
        $relatedServices = Service::with('features')
            ->active()
            ->where('id', '!=', $service->id)
            ->where('service_type', $service->service_type)
            ->ordered()
            ->take(3)
            ->get();

        return Inertia::render('ServiceShow', [
            'service' => $service,
            'relatedServices' => $relatedServices,
        ]);
    }
}
