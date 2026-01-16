<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogCommentRequest extends FormRequest
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
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'email', 'max:255'],
            'comment_body' => ['required', 'string', 'min:5', 'max:2000'],
            'honeypot' => ['nullable', 'max:0'], // Anti-spam honeypot field
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
            'user_name.required' => 'Please enter your name.',
            'user_email.required' => 'Please enter your email address.',
            'user_email.email' => 'Please enter a valid email address.',
            'comment_body.required' => 'Please enter your comment.',
            'comment_body.min' => 'Your comment must be at least 5 characters.',
            'comment_body.max' => 'Your comment cannot exceed 2000 characters.',
        ];
    }
}
