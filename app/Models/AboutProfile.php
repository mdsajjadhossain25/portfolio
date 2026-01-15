<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AboutProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'title',
        'subtitle',
        'short_bio',
        'long_bio',
        'profile_image',
        'company',
        'location',
        'years_of_experience',
        'university',
        'cgpa',
        'academic_highlight',
        'resume_url',
        'email',
        'phone',
        'social_links',
        'status',
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
            'social_links' => 'array',
            'cgpa' => 'float',
            'years_of_experience' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the active profile.
     */
    public static function getActive(): ?self
    {
        return static::where('is_active', true)->first();
    }

    /**
     * Get the profile image URL.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if (!$this->profile_image) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($this->profile_image, 'http')) {
            return $this->profile_image;
        }

        return asset('storage/' . $this->profile_image);
    }
}
