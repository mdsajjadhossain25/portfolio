<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('projects', 'slug')->ignore($projectId),
            ],
            'short_description' => ['required', 'string', 'max:500'],
            'detailed_description' => ['nullable', 'string', 'max:10000'],
            'project_type_id' => ['required', 'integer', 'exists:project_types,id'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
            'thumbnail_image' => ['nullable', 'image', 'max:2048'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'github_url' => ['nullable', 'url', 'max:500'],
            'live_url' => ['nullable', 'url', 'max:500'],
            'paper_url' => ['nullable', 'url', 'max:500'],
            'dataset_used' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['required', Rule::in(['completed', 'ongoing'])],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            // Gallery images
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'max:2048'],
            // Features
            'features' => ['nullable', 'array'],
            'features.*.title' => ['required_with:features', 'string', 'max:255'],
            'features.*.description' => ['nullable', 'string', 'max:1000'],
            'features.*.icon' => ['nullable', 'string', 'max:100'],
            // Metrics
            'metrics' => ['nullable', 'array'],
            'metrics.*.name' => ['required_with:metrics', 'string', 'max:255'],
            'metrics.*.value' => ['required_with:metrics', 'string', 'max:255'],
            'metrics.*.description' => ['nullable', 'string', 'max:500'],
            // Videos
            'videos' => ['nullable', 'array'],
            'videos.*.title' => ['required_with:videos', 'string', 'max:255'],
            'videos.*.video_url' => ['required_with:videos', 'url', 'max:500'],
            'videos.*.platform' => ['nullable', Rule::in(['youtube', 'vimeo', 'other'])],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'short_description' => 'short description',
            'detailed_description' => 'detailed description',
            'project_type' => 'project type',
            'tech_stack' => 'tech stack',
            'tech_stack.*' => 'technology',
            'tags.*' => 'tag',
            'thumbnail_image' => 'thumbnail image',
            'cover_image' => 'cover image',
            'github_url' => 'GitHub URL',
            'live_url' => 'live URL',
            'paper_url' => 'paper URL',
            'dataset_used' => 'dataset',
            'display_order' => 'display order',
            'gallery_images.*' => 'gallery image',
            'features.*.title' => 'feature title',
            'features.*.description' => 'feature description',
            'metrics.*.name' => 'metric name',
            'metrics.*.value' => 'metric value',
            'videos.*.title' => 'video title',
            'videos.*.video_url' => 'video URL',
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The project title is required.',
            'short_description.required' => 'A short description is required.',
            'short_description.max' => 'The short description must not exceed 500 characters.',
            'project_type.required' => 'Please select a project type.',
            'thumbnail_image.max' => 'The thumbnail image must not exceed 2MB.',
            'cover_image.max' => 'The cover image must not exceed 4MB.',
        ];
    }
}
