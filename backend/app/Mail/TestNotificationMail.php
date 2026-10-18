<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $recipientEmail;
    public string $customMessage;

    public function __construct(string $recipientEmail, string $customMessage = '')
    {
        $this->recipientEmail = $recipientEmail;
        $this->customMessage = $customMessage;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[Crusaders Logistics Test Ping] Automated Logistics Notification System Verified",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.test_notification',
            with: [
                'recipientEmail' => $this->recipientEmail,
                'customMessage' => $this->customMessage,
            ]
        );
    }
}
