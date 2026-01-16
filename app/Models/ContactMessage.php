<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ContactMessage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'is_read',
        'is_replied',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'is_replied' => 'boolean',
        ];
    }

    /**
     * Scope to filter unread messages.
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope to filter read messages.
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope to filter unreplied messages.
     */
    public function scopeUnreplied(Builder $query): Builder
    {
        return $query->where('is_replied', false);
    }

    /**
     * Scope to filter replied messages.
     */
    public function scopeReplied(Builder $query): Builder
    {
        return $query->where('is_replied', true);
    }

    /**
     * Mark the message as read.
     */
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Mark the message as unread.
     */
    public function markAsUnread(): void
    {
        $this->update(['is_read' => false]);
    }

    /**
     * Mark the message as replied.
     */
    public function markAsReplied(): void
    {
        $this->update(['is_replied' => true]);
    }

    /**
     * Get the formatted date for display.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Get a short preview of the message.
     */
    public function getPreviewAttribute(): string
    {
        return str($this->message)->limit(100)->toString();
    }
}
