<?php

namespace App\Mail;

use App\Models\Shipment;
use App\Models\Checkpoint;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ShipmentStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Shipment $shipment;
    public Checkpoint $checkpoint;

    public function __construct(Shipment $shipment, Checkpoint $checkpoint)
    {
        $this->shipment = $shipment;
        $this->checkpoint = $checkpoint;
    }

    public function envelope(): Envelope
    {
        $statusClean = str_replace('_', ' ', $this->checkpoint->status);
        return new Envelope(
            subject: "Crusaders Logistics Milestone: [{$this->shipment->tracking_number}] {$statusClean}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.status_update',
            with: [
                'shipment' => $this->shipment,
                'data' => $this->shipment->toFrontendArray(),
                'checkpoint' => $this->checkpoint,
            ]
        );
    }
}
