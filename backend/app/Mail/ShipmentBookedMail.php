<?php

namespace App\Mail;

use App\Models\Shipment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ShipmentBookedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Shipment $shipment;
    public array $shipmentData;

    public function __construct(Shipment $shipment)
    {
        $this->shipment = $shipment;
        $this->shipmentData = $shipment->toFrontendArray();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Crusaders Logistics Dispatch Confirmed: Waybill #{$this->shipment->tracking_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking_confirmation',
            with: [
                'shipment' => $this->shipment,
                'data' => $this->shipmentData,
            ]
        );
    }
}
