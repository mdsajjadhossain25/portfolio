<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogPostRequest extends FormRequest
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
        $postId = $this->route('post')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('blog_posts', 'slug')->ignore($postId),
            ],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'max:5120'], // 5MB max
            'author_name' => ['nullable', 'string', 'max:255'],
            'reading_time' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['exists:blog_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:blog_tags,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The post title is required.',
            'content.required' => 'The post content is required.',
            'cover_image.image' => 'The cover must be an image file.',
            'cover_image.max' => 'The cover image must not exceed 5MB.',
            'meta_title.max' => 'The meta title should not exceed 70 characters.',
            'meta_description.max' => 'The meta description should not exceed 160 characters.',
        ];
    }
}
