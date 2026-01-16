<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'detailed_description',
        'project_type_id',
        'tech_stack',
        'tags',
        'thumbnail_image',
        'cover_image',
        'github_url',
        'live_url',
        'paper_url',
        'dataset_used',
        'role',
        'is_featured',
        'status',
        'display_order',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'tags' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    /**
     * Status enum values.
     */
    public const STATUSES = [
        'completed' => 'Completed',
        'ongoing' => 'Ongoing',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });

        static::updating(function ($project) {
            if ($project->isDirty('title') && empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the project images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->ordered();
    }

    /**
     * Get the project features.
     */
    public function features(): HasMany
    {
        return $this->hasMany(ProjectFeature::class)->ordered();
    }

    /**
     * Get the project metrics.
     */
    public function metrics(): HasMany
    {
        return $this->hasMany(ProjectMetric::class)->ordered();
    }

    /**
     * Get the project videos.
     */
    public function videos(): HasMany
    {
        return $this->hasMany(ProjectVideo::class)->ordered();
    }

    /**
     * Get the project type.
     */
    public function projectType(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class);
    }

    /**
     * Scope to get only active projects.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only featured projects.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Scope to filter by project type.
     */
    public function scopeOfType($query, $type)
    {
        if (is_numeric($type)) {
            return $query->where('project_type_id', $type);
        }
        return $query->whereHas('projectType', fn ($q) => $q->where('slug', $type));
    }

    /**
     * Get the human-readable project type.
     */
    public function getProjectTypeLabelAttribute(): string
    {
        return $this->projectType?->name ?? 'Unknown';
    }

    /**
     * Get the project type slug.
     */
    public function getProjectTypeSlugAttribute(): string
    {
        return $this->projectType?->slug ?? 'unknown';
    }

    /**
     * Get the project type color.
     */
    public function getProjectTypeColorAttribute(): string
    {
        return $this->projectType?->color ?? 'cyan';
    }

    /**
     * Get the human-readable status.
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail_image) {
            return null;
        }

        return str_starts_with($this->thumbnail_image, 'http')
            ? $this->thumbnail_image
            : asset('storage/' . $this->thumbnail_image);
    }

    /**
     * Get the cover image URL.
     */
    public function getCoverUrlAttribute(): ?string
    {
        if (!$this->cover_image) {
            return null;
        }

        return str_starts_with($this->cover_image, 'http')
            ? $this->cover_image
            : asset('storage/' . $this->cover_image);
    }
}
