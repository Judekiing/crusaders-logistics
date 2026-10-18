<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;

class HealthController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'online',
            'system' => 'Crusaders Logistics Laravel Enterprise Dispatch Engine',
            'version' => '2.0.0',
            'timestamp' => now()->toISOString(),
            'stats' => [
                'shipments' => Shipment::count(),
            ]
        ]);
    }
}
