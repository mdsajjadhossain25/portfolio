<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Ensures the authenticated user has admin role.
     * Redirects non-admin users to the homepage with an error message.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (! $request->user()) {
            return redirect()->route('login');
        }

        // Check if user has admin role
        if (! $request->user()->isAdmin()) {
            // For API requests, return 403
            if ($request->expectsJson()) {
                abort(403, 'Access denied. Admin privileges required.');
            }

            // For web requests, redirect to home with error message
            return redirect()
                ->route('home')
                ->with('error', 'Access denied. You do not have permission to access the admin area.');
        }

        return $next($request);
    }
}
