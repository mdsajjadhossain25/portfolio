<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #0891b2 0%, #7c3aed 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 14px;
        }

        .content {
            padding: 30px;
        }

        .field {
            margin-bottom: 20px;
        }

        .field-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 6px;
        }

        .field-value {
            font-size: 16px;
            color: #1f2937;
            background-color: #f9fafb;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 3px solid #0891b2;
        }

        .message-box {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border-left: 3px solid #7c3aed;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .footer {
            padding: 20px 30px;
            background-color: #f9fafb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

        .footer a {
            color: #0891b2;
            text-decoration: none;
        }

        .meta {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
        }

        .meta-item {
            margin-bottom: 4px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Message</h1>
            <p>You have received a new message from your portfolio</p>
        </div>

        <div class="content">
            <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">
                    {{ $contactMessage->name }}<br>
                    <a href="mailto:{{ $contactMessage->email }}"
                        style="color: #0891b2;">{{ $contactMessage->email }}</a>
                </div>
            </div>

            <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">{{ $contactMessage->subject }}</div>
            </div>

            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">{{ $contactMessage->message }}</div>
            </div>

            <div class="meta">
                <div class="meta-item"><strong>Received:</strong>
                    {{ $contactMessage->created_at->format('F j, Y \a\t g:i A') }}</div>
                @if ($contactMessage->ip_address)
                    <div class="meta-item"><strong>IP Address:</strong> {{ $contactMessage->ip_address }}</div>
                @endif
            </div>
        </div>

        <div class="footer">
            <p>This message was sent from your portfolio contact form.</p>
            <p><a href="{{ config('app.url') }}/admin/inbox">View in Admin Dashboard →</a></p>
        </div>
    </div>
</body>

</html>
