<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactMessageRequest;
use App\Mail\ContactFormAutoReply;
use App\Mail\ContactFormNotification;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle contact form submission.
     */
    public function store(ContactMessageRequest $request): RedirectResponse
    {
        // Rate limiting check using cache
        $ipAddress = $request->ip();
        $cacheKey = 'contact_form_' . $ipAddress;
        
        // Allow max 3 submissions per hour from same IP
        $submissions = Cache::get($cacheKey, 0);
        if ($submissions >= 3) {
            return back()->withErrors([
                'message' => 'Too many submissions. Please try again later.',
            ]);
        }

        // Honeypot check - if website field is filled, it's likely a bot
        if ($request->filled('website')) {
            // Silently reject but show success to confuse bots
            return back()->with('success', 'Thank you for your message! I will get back to you soon.');
        }

        // Create the contact message
        $contactMessage = ContactMessage::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'subject' => $request->validated('subject'),
            'message' => $request->validated('message'),
            'ip_address' => $ipAddress,
            'user_agent' => $request->userAgent(),
        ]);

        // Increment rate limit counter
        Cache::put($cacheKey, $submissions + 1, now()->addHour());

        // Send notification email to site owner
        $ownerEmail = config('mail.contact.owner_email', config('mail.from.address'));
        if ($ownerEmail) {
            Mail::to($ownerEmail)->queue(new ContactFormNotification($contactMessage));
        }

        // Send auto-reply to sender
        if (config('mail.contact.auto_reply', true)) {
            Mail::to($contactMessage->email)->queue(new ContactFormAutoReply($contactMessage));
        }

        return back()->with('success', 'Thank you for your message! I will get back to you within 24-48 hours.');
    }
}
