<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectVideo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'project_id',
        'title',
        'video_url',
        'platform',
        'thumbnail',
        'display_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    /**
     * Platform enum values.
     */
    public const PLATFORMS = [
        'youtube' => 'YouTube',
        'vimeo' => 'Vimeo',
        'other' => 'Other',
    ];

    /**
     * Get the project this video belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }

        return str_starts_with($this->thumbnail, 'http')
            ? $this->thumbnail
            : asset('storage/' . $this->thumbnail);
    }

    /**
     * Get the embed URL for the video.
     */
    public function getEmbedUrlAttribute(): ?string
    {
        if ($this->platform === 'youtube') {
            preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/', $this->video_url, $matches);
            return isset($matches[1]) ? "https://www.youtube.com/embed/{$matches[1]}" : null;
        }

        if ($this->platform === 'vimeo') {
            preg_match('/vimeo\.com\/(\d+)/', $this->video_url, $matches);
            return isset($matches[1]) ? "https://player.vimeo.com/video/{$matches[1]}" : null;
        }

        return $this->video_url;
    }
}
