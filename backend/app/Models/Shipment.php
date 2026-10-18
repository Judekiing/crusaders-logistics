<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'dimensions' => 'array',
        'route_coordinates' => 'array',
        'insurance_required' => 'boolean',
        'signature_required' => 'boolean',
        'pieces' => 'integer',
        'weight_kg' => 'float',
        'chargeable_weight_kg' => 'float',
        'declared_value' => 'float',
        'estimated_delivery' => 'datetime',
        'booked_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function checkpoints(): HasMany
    {
        return $this->hasMany(Checkpoint::class, 'shipment_id')->orderBy('checkpoint_time', 'asc');
    }

    /**
     * Transform model to the exact frontend API contract format (camelCase)
     */
    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'trackingNumber' => $this->tracking_number,
            'senderName' => $this->sender_name,
            'senderEmail' => $this->sender_email,
            'senderPhone' => $this->sender_phone,
            'originAddress' => $this->origin_address,
            'originCity' => $this->origin_city,
            'originState' => $this->origin_state,
            'originCountry' => $this->origin_country,
            'originZip' => $this->origin_zip,
            'receiverName' => $this->receiver_name,
            'receiverEmail' => $this->receiver_email,
            'receiverPhone' => $this->receiver_phone,
            'destAddress' => $this->dest_address,
            'destCity' => $this->dest_city,
            'destState' => $this->dest_state,
            'destCountry' => $this->dest_country,
            'destZip' => $this->dest_zip,
            'serviceType' => $this->service_type,
            'serviceName' => $this->service_name,
            'packageType' => $this->package_type,
            'packageDescription' => $this->package_description,
            'pieces' => $this->pieces,
            'weightKg' => $this->weight_kg,
            'chargeableWeightKg' => $this->chargeable_weight_kg,
            'dimensions' => $this->dimensions ?: ['length' => 40, 'width' => 30, 'height' => 20],
            'declaredValue' => $this->declared_value,
            'currency' => $this->currency ?: 'USD',
            'insuranceRequired' => (bool)$this->insurance_required,
            'signatureRequired' => (bool)$this->signature_required,
            'currentStatus' => $this->current_status,
            'statusLabel' => $this->status_label,
            'estimatedDelivery' => $this->estimated_delivery?->toISOString(),
            'bookedAt' => $this->booked_at?->toISOString(),
            'deliveredAt' => $this->delivered_at?->toISOString(),
            'assignedDriver' => $this->assigned_driver,
            'vehicleInfo' => $this->vehicle_info,
            'routeCoordinates' => $this->route_coordinates ?: [
                'origin' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => $this->origin_city],
                'current' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => $this->origin_city . ' Hub'],
                'destination' => ['lat' => 51.5074, 'lng' => -0.1278, 'label' => $this->dest_city]
            ],
            'checkpoints' => $this->checkpoints->map(function ($c) {
                return [
                    'id' => $c->id,
                    'status' => $c->status,
                    'statusTitle' => $c->status_title,
                    'location' => $c->location,
                    'timestamp' => $c->checkpoint_time?->toISOString(),
                    'operator' => $c->operator,
                    'driver' => $c->driver,
                    'notes' => $c->notes,
                ];
            })->values()->all(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
