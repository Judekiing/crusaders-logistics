<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
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
            'code' => $this->code,
            'city' => $this->city,
            'country' => $this->country,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'hubType' => $this->hub_type,
        ];
    }
}
