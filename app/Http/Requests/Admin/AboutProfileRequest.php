<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AboutProfileRequest extends FormRequest
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
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'short_bio' => ['required', 'string', 'max:1000'],
            'long_bio' => ['nullable', 'string', 'max:5000'],
            'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'company' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'years_of_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'university' => ['nullable', 'string', 'max:255'],
            'cgpa' => ['nullable', 'numeric', 'min:0', 'max:4.00'],
            'academic_highlight' => ['nullable', 'string', 'max:500'],
            'resume_url' => ['nullable', 'string', 'max:500'],
            'resume_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'social_links' => ['nullable', 'array'],
            'social_links.github' => ['nullable', 'url', 'max:500'],
            'social_links.linkedin' => ['nullable', 'url', 'max:500'],
            'social_links.twitter' => ['nullable', 'url', 'max:500'],
            'social_links.website' => ['nullable', 'url', 'max:500'],
            'status' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
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
            'full_name' => 'full name',
            'short_bio' => 'short biography',
            'long_bio' => 'long biography',
            'profile_image' => 'profile image',
            'years_of_experience' => 'years of experience',
            'academic_highlight' => 'academic highlight',
            'resume_url' => 'resume URL',
            'resume_file' => 'resume file',
            'social_links.github' => 'GitHub URL',
            'social_links.linkedin' => 'LinkedIn URL',
            'social_links.twitter' => 'Twitter URL',
            'social_links.website' => 'Website URL',
        ];
    }
}
