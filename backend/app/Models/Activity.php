<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'eventType' => $this->event_type,
            'description' => $this->description,
            'entityType' => $this->entity_type,
            'entityId' => $this->entity_id,
            'ipAddress' => $this->ip_address ?: '127.0.0.1',
            'userAgent' => $this->user_agent ?: 'Desktop Browser (Chrome/128)',
            'metadata' => $this->metadata,
            'createdAt' => $this->created_at?->toISOString(),
            'timestamp' => $this->created_at?->toISOString(),
        ];
    }
}
