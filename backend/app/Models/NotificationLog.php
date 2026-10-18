<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'shipmentId' => $this->shipment_id,
            'recipientEmail' => $this->recipient_email,
            'to' => $this->recipient_email,
            'recipientName' => $this->recipient_name,
            'subject' => $this->subject,
            'type' => $this->type,
            'status' => $this->status,
            'previewText' => $this->preview_text,
            'html' => $this->html_content,
            'sentAt' => $this->sent_at?->toISOString() ?: $this->created_at?->toISOString(),
            'timestamp' => $this->sent_at?->toISOString() ?: $this->created_at?->toISOString(),
        ];
    }
}
