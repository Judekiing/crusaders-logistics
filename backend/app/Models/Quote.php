<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'dimensions' => 'array',
        'weight_kg' => 'float',
        'pieces' => 'integer',
        'estimated_rate' => 'float',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'clientName' => $this->client_name,
            'clientEmail' => $this->client_email,
            'clientPhone' => $this->client_phone,
            'companyName' => $this->company_name,
            'originCity' => $this->origin_city,
            'originCountry' => $this->origin_country,
            'destCity' => $this->dest_city,
            'destCountry' => $this->dest_country,
            'cargoType' => $this->cargo_type,
            'weightKg' => $this->weight_kg,
            'pieces' => $this->pieces,
            'dimensions' => $this->dimensions ?: ['length' => 40, 'width' => 30, 'height' => 20],
            'selectedService' => $this->selected_service,
            'estimatedRate' => $this->estimated_rate,
            'transitDays' => $this->transit_days,
            'specialInstructions' => $this->special_instructions,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'timestamp' => $this->created_at?->toISOString(),
        ];
    }
}
