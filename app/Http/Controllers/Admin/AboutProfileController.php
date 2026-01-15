<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AboutProfileRequest;
use App\Models\AboutProfile;
use App\Models\Experience;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutProfileController extends Controller
{
    /**
     * Display the about profile management page.
     */
    public function index(): Response
    {
        $profile = AboutProfile::first();
        $skillCategories = SkillCategory::with('skills')->ordered()->get();
        $experiences = Experience::ordered()->get();

        return Inertia::render('admin/about/Index', [
            'profile' => $profile ? [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'title' => $profile->title,
                'subtitle' => $profile->subtitle,
                'short_bio' => $profile->short_bio,
                'company' => $profile->company,
                'university' => $profile->university,
                'cgpa' => $profile->cgpa,
                'profile_image' => $profile->profile_image_url, // Use accessor for proper URL
                'is_active' => $profile->is_active,
            ] : null,
            'skillCategories' => $skillCategories,
            'experiences' => $experiences->map(function ($exp) {
                return [
                    'id' => $exp->id,
                    'title' => $exp->title,
                    'company' => $exp->company,
                    'date_range' => $exp->date_range,
                    'is_current' => $exp->is_current,
                    'is_active' => $exp->is_active,
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating/editing the about profile.
     */
    public function edit(): Response
    {
        $profile = AboutProfile::first();

        return Inertia::render('admin/about/ProfileForm', [
            'profile' => $profile ? [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'title' => $profile->title,
                'subtitle' => $profile->subtitle,
                'short_bio' => $profile->short_bio,
                'long_bio' => $profile->long_bio,
                'profile_image' => $profile->profile_image_url, // Use accessor for proper URL
                'company' => $profile->company,
                'location' => $profile->location,
                'years_of_experience' => $profile->years_of_experience,
                'university' => $profile->university,
                'cgpa' => $profile->cgpa,
                'academic_highlight' => $profile->academic_highlight,
                'resume_url' => $profile->resume_url,
                'email' => $profile->email,
                'phone' => $profile->phone,
                'social_links' => $profile->social_links,
                'status' => $profile->status,
                'is_active' => $profile->is_active,
            ] : null,
        ]);
    }

    /**
     * Store or update the about profile.
     */
    public function store(AboutProfileRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile', 'public');
            $data['profile_image'] = $path;
        }

        // Handle resume upload
        if ($request->hasFile('resume_file')) {
            $path = $request->file('resume_file')->store('resume', 'public');
            $data['resume_url'] = $path;
        }

        // Get or create the profile (single record)
        $profile = AboutProfile::first();

        if ($profile) {
            // Delete old profile image if new one is uploaded
            if ($request->hasFile('profile_image') && $profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }
            
            $profile->update($data);
        } else {
            $profile = AboutProfile::create($data);
        }

        return redirect()
            ->route('admin.about.index')
            ->with('success', 'About profile updated successfully.');
    }
}
