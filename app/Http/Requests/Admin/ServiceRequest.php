<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('services', 'slug')->ignore($serviceId),
            ],
            'short_description' => ['required', 'string', 'max:500'],
            'detailed_description' => ['nullable', 'string'],
            'service_type' => ['required', Rule::in(['consulting', 'development', 'research', 'freelance', 'hiring'])],
            'pricing_model' => ['required', Rule::in(['hourly', 'project', 'retainer', 'custom'])],
            'price_label' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['boolean'],
            'display_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'features' => ['nullable', 'array'],
            'features.*.feature_text' => ['required_with:features', 'string', 'max:255'],
            'features.*.display_order' => ['integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Service title is required.',
            'short_description.required' => 'A short description is required.',
            'short_description.max' => 'Short description cannot exceed 500 characters.',
            'service_type.required' => 'Please select a service type.',
            'pricing_model.required' => 'Please select a pricing model.',
            'features.*.feature_text.required_with' => 'Feature text is required.',
        ];
    }
}
