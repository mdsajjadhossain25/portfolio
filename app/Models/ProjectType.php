<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ProjectType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'color',
        'icon',
        'description',
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
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    /**
     * Available color options for project types.
     */
    public const COLORS = [
        'cyan' => 'Cyan',
        'purple' => 'Purple',
        'green' => 'Green',
        'crimson' => 'Crimson',
        'orange' => 'Orange',
        'blue' => 'Blue',
        'pink' => 'Pink',
        'yellow' => 'Yellow',
        'teal' => 'Teal',
        'indigo' => 'Indigo',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($projectType) {
            if (empty($projectType->slug)) {
                $projectType->slug = Str::slug($projectType->name);
            }
        });

        static::updating(function ($projectType) {
            if ($projectType->isDirty('name') && !$projectType->isDirty('slug')) {
                $projectType->slug = Str::slug($projectType->name);
            }
        });
    }

    /**
     * Get the projects for this type.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Scope: Active project types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Ordered by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    /**
     * Get project count for this type.
     */
    public function getProjectCountAttribute(): int
    {
        return $this->projects()->count();
    }
}
