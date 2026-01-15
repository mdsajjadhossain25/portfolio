<?php

namespace App\Http\Controllers;

use App\Models\AboutProfile;
use App\Models\Experience;
use App\Models\SkillCategory;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the public about page with dynamic data.
     */
    public function index(): Response
    {
        // Get active profile
        $profile = AboutProfile::getActive();

        // Get active skill categories with their active skills
        $skillCategories = SkillCategory::getActiveWithSkills();

        // Get active experiences ordered by display_order
        $experiences = Experience::active()
            ->ordered()
            ->get()
            ->map(function ($experience) {
                return [
                    'id' => $experience->id,
                    'title' => $experience->title,
                    'company' => $experience->company,
                    'location' => $experience->location,
                    'type' => $experience->type,
                    'year' => $experience->year,
                    'dateRange' => $experience->date_range,
                    'isCurrent' => $experience->is_current,
                    'description' => $experience->description,
                    'highlights' => $experience->highlights,
                ];
            });

        return Inertia::render('About', [
            'profile' => $profile ? [
                'fullName' => $profile->full_name,
                'title' => $profile->title,
                'subtitle' => $profile->subtitle,
                'shortBio' => $profile->short_bio,
                'longBio' => $profile->long_bio,
                'profileImage' => $profile->profile_image_url,
                'company' => $profile->company,
                'location' => $profile->location,
                'yearsOfExperience' => $profile->years_of_experience,
                'university' => $profile->university,
                'cgpa' => $profile->cgpa,
                'academicHighlight' => $profile->academic_highlight,
                'resumeUrl' => $profile->resume_url,
                'email' => $profile->email,
                'phone' => $profile->phone,
                'socialLinks' => $profile->social_links,
                'status' => $profile->status,
            ] : null,
            'skillCategories' => $skillCategories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'icon' => $category->icon,
                    'color' => $category->color,
                    'skills' => $category->activeSkills->map(function ($skill) {
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'icon' => $skill->icon,
                            'tag' => $skill->tag,
                            'description' => $skill->description,
                            'isFeatured' => $skill->is_featured,
                        ];
                    }),
                ];
            }),
            'experiences' => $experiences,
        ]);
    }
}
