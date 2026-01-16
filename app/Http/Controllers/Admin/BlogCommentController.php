<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogCommentController extends Controller
{
    /**
     * Display a listing of blog comments.
     */
    public function index(Request $request): Response
    {
        $query = BlogComment::with('post:id,title,slug');

        // Filter by approval status
        if ($request->filled('status')) {
            if ($request->status === 'approved') {
                $query->approved();
            } elseif ($request->status === 'pending') {
                $query->pending();
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('comment_body', 'like', "%{$search}%");
            });
        }

        $comments = $query->latest()
            ->paginate(15)
            ->through(function ($comment) {
                return [
                    'id' => $comment->id,
                    'user_name' => $comment->user_name,
                    'user_email' => $comment->user_email,
                    'comment_body' => $comment->comment_body,
                    'is_approved' => $comment->is_approved,
                    'ip_address' => $comment->ip_address,
                    'post' => $comment->post ? [
                        'id' => $comment->post->id,
                        'title' => $comment->post->title,
                        'slug' => $comment->post->slug,
                    ] : null,
                    'time_ago' => $comment->time_ago,
                    'created_at' => $comment->created_at->format('Y-m-d H:i'),
                ];
            });

        $pendingCount = BlogComment::pending()->count();
        $approvedCount = BlogComment::approved()->count();

        return Inertia::render('admin/blog/comments/Index', [
            'comments' => $comments,
            'filters' => $request->only(['status', 'search']),
            'counts' => [
                'pending' => $pendingCount,
                'approved' => $approvedCount,
                'total' => $pendingCount + $approvedCount,
            ],
        ]);
    }

    /**
     * Approve a comment.
     */
    public function approve(BlogComment $comment)
    {
        $comment->update(['is_approved' => true]);

        return back()->with('success', 'Comment approved successfully.');
    }

    /**
     * Unapprove a comment.
     */
    public function unapprove(BlogComment $comment)
    {
        $comment->update(['is_approved' => false]);

        return back()->with('success', 'Comment unapproved.');
    }

    /**
     * Toggle approval status.
     */
    public function toggleApproval(BlogComment $comment)
    {
        $comment->update(['is_approved' => !$comment->is_approved]);

        return back()->with('success', 
            $comment->is_approved ? 'Comment approved.' : 'Comment unapproved.'
        );
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(BlogComment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }

    /**
     * Bulk delete comments.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:blog_comments,id',
        ]);

        BlogComment::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids) . ' comment(s) deleted.');
    }

    /**
     * Bulk approve comments.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:blog_comments,id',
        ]);

        BlogComment::whereIn('id', $request->ids)->update(['is_approved' => true]);

        return back()->with('success', count($request->ids) . ' comment(s) approved.');
    }
}
