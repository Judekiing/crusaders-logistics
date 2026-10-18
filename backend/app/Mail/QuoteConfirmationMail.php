<?php

namespace App\Mail;

use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuoteConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Quote $quote;

    public function __construct(Quote $quote)
    {
        $this->quote = $quote;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Crusaders Logistics Freight Quote #{$this->quote->id}: {$this->quote->origin_city} to {$this->quote->dest_city}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote_confirmation',
            with: [
                'quote' => $this->quote,
                'data' => $this->quote->toFrontendArray(),
            ]
        );
    }
}
