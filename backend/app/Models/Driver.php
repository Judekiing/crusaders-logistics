<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $incrementing = false;
    protected $keyType = 'string';

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'vehicleType' => $this->vehicle_type,
            'plateNumber' => $this->plate_number,
            'status' => $this->status,
            'currentCity' => $this->current_city,
        ];
    }
}
