<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Service extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'detailed_description',
        'service_type',
        'pricing_model',
        'price_label',
        'duration',
        'icon',
        'is_featured',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Service $service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->title);
            }
        });

        static::updating(function (Service $service) {
            if ($service->isDirty('title') && !$service->isDirty('slug')) {
                $service->slug = Str::slug($service->title);
            }
        });
    }

    /**
     * Get the features for this service.
     */
    public function features(): HasMany
    {
        return $this->hasMany(ServiceFeature::class)->orderBy('display_order');
    }

    /**
     * Scope for active services.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured services.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for ordered services.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('created_at', 'desc');
    }

    /**
     * Get service type label.
     */
    public function getServiceTypeLabelAttribute(): string
    {
        return match ($this->service_type) {
            'consulting' => 'Consulting',
            'development' => 'Development',
            'research' => 'Research',
            'freelance' => 'Freelance',
            'hiring' => 'Hiring',
            default => ucfirst($this->service_type),
        };
    }

    /**
     * Get pricing model label.
     */
    public function getPricingModelLabelAttribute(): string
    {
        return match ($this->pricing_model) {
            'hourly' => 'Hourly Rate',
            'project' => 'Per Project',
            'retainer' => 'Monthly Retainer',
            'custom' => 'Custom Quote',
            default => ucfirst($this->pricing_model),
        };
    }
}
