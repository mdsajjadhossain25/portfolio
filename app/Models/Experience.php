<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Experience extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'company',
        'location',
        'type',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'highlights',
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
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'highlights' => 'array',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope to get only active experiences.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Get formatted date range.
     */
    public function getDateRangeAttribute(): string
    {
        $start = $this->start_date->format('M Y');
        $end = $this->is_current ? 'Present' : $this->end_date?->format('M Y');

        return "{$start} - {$end}";
    }

    /**
     * Get the year for timeline display.
     */
    public function getYearAttribute(): string
    {
        return $this->start_date->format('Y');
    }
}
