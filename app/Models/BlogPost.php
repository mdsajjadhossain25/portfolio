<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogPost extends Model
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
        'excerpt',
        'content',
        'cover_image',
        'author_name',
        'reading_time',
        'status',
        'published_at',
        'is_featured',
        'views_count',
        'meta_title',
        'meta_description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'views_count' => 'integer',
            'reading_time' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Status options.
     */
    public const STATUSES = [
        'draft' => 'Draft',
        'published' => 'Published',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            if (empty($post->reading_time)) {
                $post->reading_time = self::calculateReadingTime($post->content);
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('title') && empty($post->getOriginal('slug'))) {
                $post->slug = Str::slug($post->title);
            }
            if ($post->isDirty('content')) {
                $post->reading_time = self::calculateReadingTime($post->content);
            }
        });
    }

    /**
     * Calculate reading time based on word count.
     */
    public static function calculateReadingTime(?string $content): int
    {
        if (empty($content)) {
            return 1;
        }
        
        $wordCount = str_word_count(strip_tags($content));
        $readingTime = ceil($wordCount / 200); // Average reading speed
        
        return max(1, (int) $readingTime);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the categories for this post.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_category');
    }

    /**
     * Get the tags for this post.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag');
    }

    /**
     * Get the comments for this post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }

    /**
     * Get approved comments.
     */
    public function approvedComments(): HasMany
    {
        return $this->comments()->approved()->oldest();
    }

    /**
     * Scope to get only published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope to get featured posts.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to get draft posts.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope to order by latest.
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    /**
     * Scope to filter by category.
     */
    public function scopeInCategory($query, $categorySlug)
    {
        return $query->whereHas('categories', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    /**
     * Scope to filter by tag.
     */
    public function scopeWithTag($query, $tagSlug)
    {
        return $query->whereHas('tags', function ($q) use ($tagSlug) {
            $q->where('slug', $tagSlug);
        });
    }

    /**
     * Increment view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Get cover image URL.
     */
    public function getCoverUrlAttribute(): ?string
    {
        if ($this->cover_image) {
            return Storage::url($this->cover_image);
        }
        return null;
    }

    /**
     * Get formatted publish date.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->published_at?->format('M d, Y') ?? 'Not published';
    }

    /**
     * Get reading time formatted.
     */
    public function getReadingTimeTextAttribute(): string
    {
        $minutes = $this->reading_time ?? 1;
        return $minutes . ' min read';
    }

    /**
     * Check if post is published.
     */
    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'published' 
            && $this->published_at 
            && $this->published_at <= now();
    }

    /**
     * Get meta title with fallback.
     */
    public function getMetaTitleTextAttribute(): string
    {
        return $this->meta_title ?? $this->title;
    }

    /**
     * Get meta description with fallback.
     */
    public function getMetaDescriptionTextAttribute(): string
    {
        return $this->meta_description ?? $this->excerpt ?? Str::limit(strip_tags($this->content), 160);
    }

    /**
     * Get share URL for Twitter.
     */
    public function getTwitterShareUrlAttribute(): string
    {
        $url = url('/blog/' . $this->slug);
        $text = urlencode($this->title);
        return "https://twitter.com/intent/tweet?url={$url}&text={$text}";
    }

    /**
     * Get share URL for LinkedIn.
     */
    public function getLinkedinShareUrlAttribute(): string
    {
        $url = urlencode(url('/blog/' . $this->slug));
        return "https://www.linkedin.com/sharing/share-offsite/?url={$url}";
    }

    /**
     * Get share URL for Facebook.
     */
    public function getFacebookShareUrlAttribute(): string
    {
        $url = urlencode(url('/blog/' . $this->slug));
        return "https://www.facebook.com/sharer/sharer.php?u={$url}";
    }

    /**
     * Get the full URL for the post.
     */
    public function getUrlAttribute(): string
    {
        return url('/blog/' . $this->slug);
    }
}
