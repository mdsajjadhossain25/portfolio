<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Message</title>
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
            padding: 40px 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .header .emoji {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
        }

        p {
            color: #4b5563;
            margin-bottom: 16px;
        }

        .message-summary {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 3px solid #0891b2;
        }

        .message-summary h3 {
            margin: 0 0 10px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
        }

        .message-summary .subject {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }

        .message-summary .preview {
            color: #6b7280;
            font-size: 14px;
            font-style: italic;
        }

        .response-time {
            background: linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }

        .response-time .time {
            font-size: 24px;
            font-weight: 700;
            color: #0891b2;
        }

        .response-time .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-top: 5px;
        }

        .footer {
            padding: 25px 30px;
            background-color: #f9fafb;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }

        .footer a {
            color: #0891b2;
            text-decoration: none;
        }

        .social-links {
            margin-top: 15px;
        }

        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
        }

        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .signature-name {
            font-weight: 600;
            color: #1f2937;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="emoji">✨</div>
            <h1>Message Received!</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Hi {{ $contactMessage->name }},
            </div>

            <p>
                Thank you for reaching out! I've received your message and appreciate you taking the time to connect.
            </p>

            <div class="message-summary">
                <h3>Your Message</h3>
                <div class="subject">{{ $contactMessage->subject }}</div>
                <div class="preview">"{{ Str::limit($contactMessage->message, 150) }}"</div>
            </div>

            <div class="response-time">
                <div class="time">24-48 Hours</div>
                <div class="label">Expected Response Time</div>
            </div>

            <p>
                I review all messages personally and will get back to you as soon as possible.
                If your inquiry is urgent, please mention it in the subject line.
            </p>

            <div class="signature">
                <p>Best regards,</p>
                <p class="signature-name">{{ config('mail.from.name') }}</p>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated confirmation email.</p>
            <p><a href="{{ config('app.url') }}">Visit Portfolio →</a></p>
        </div>
    </div>
</body>

</html>
