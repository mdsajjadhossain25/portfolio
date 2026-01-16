<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages.
     */
    public function index(Request $request): Response
    {
        $query = ContactMessage::query();

        // Filter by read status
        if ($request->filled('status')) {
            match ($request->status) {
                'unread' => $query->unread(),
                'read' => $query->read(),
                'replied' => $query->replied(),
                'unreplied' => $query->unreplied(),
                default => null,
            };
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $messages = $query->latest()
            ->paginate(15)
            ->through(fn ($message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'preview' => $message->preview,
                'is_read' => $message->is_read,
                'is_replied' => $message->is_replied,
                'formatted_date' => $message->formatted_date,
                'created_at' => $message->created_at->format('Y-m-d H:i'),
            ]);

        // Get counts for quick filters
        $counts = [
            'all' => ContactMessage::count(),
            'unread' => ContactMessage::unread()->count(),
            'read' => ContactMessage::read()->count(),
            'replied' => ContactMessage::replied()->count(),
        ];

        return Inertia::render('admin/inbox/Index', [
            'messages' => $messages,
            'filters' => $request->only(['status', 'search']),
            'counts' => $counts,
        ]);
    }

    /**
     * Display the specified message.
     */
    public function show(ContactMessage $contactMessage): Response
    {
        // Mark as read when viewing
        $contactMessage->markAsRead();

        return Inertia::render('admin/inbox/Show', [
            'message' => [
                'id' => $contactMessage->id,
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
                'subject' => $contactMessage->subject,
                'message' => $contactMessage->message,
                'is_read' => $contactMessage->is_read,
                'is_replied' => $contactMessage->is_replied,
                'ip_address' => $contactMessage->ip_address,
                'user_agent' => $contactMessage->user_agent,
                'formatted_date' => $contactMessage->formatted_date,
                'created_at' => $contactMessage->created_at->format('F j, Y \a\t g:i A'),
            ],
        ]);
    }

    /**
     * Mark message as read.
     */
    public function markRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsRead();

        return back()->with('success', 'Message marked as read.');
    }

    /**
     * Mark message as unread.
     */
    public function markUnread(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsUnread();

        return back()->with('success', 'Message marked as unread.');
    }

    /**
     * Toggle read status.
     */
    public function toggleRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->update(['is_read' => !$contactMessage->is_read]);

        return back()->with('success', 'Read status updated.');
    }

    /**
     * Mark message as replied.
     */
    public function markReplied(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsReplied();

        return back()->with('success', 'Message marked as replied.');
    }

    /**
     * Toggle replied status.
     */
    public function toggleReplied(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->update(['is_replied' => !$contactMessage->is_replied]);

        return back()->with('success', 'Replied status updated.');
    }

    /**
     * Remove the specified message.
     */
    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        return redirect()->route('admin.inbox.index')
            ->with('success', 'Message deleted successfully.');
    }

    /**
     * Bulk delete messages.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:contact_messages,id'],
        ]);

        ContactMessage::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' messages deleted.');
    }

    /**
     * Bulk mark as read.
     */
    public function bulkMarkRead(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:contact_messages,id'],
        ]);

        ContactMessage::whereIn('id', $request->ids)->update(['is_read' => true]);

        return back()->with('success', count($request->ids) . ' messages marked as read.');
    }

    /**
     * Bulk mark as unread.
     */
    public function bulkMarkUnread(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:contact_messages,id'],
        ]);

        ContactMessage::whereIn('id', $request->ids)->update(['is_read' => false]);

        return back()->with('success', count($request->ids) . ' messages marked as unread.');
    }
}
