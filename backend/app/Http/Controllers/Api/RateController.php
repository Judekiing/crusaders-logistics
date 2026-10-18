<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RateCalculationService;
use App\Models\Activity;
use Illuminate\Http\Request;

class RateController extends Controller
{
    protected RateCalculationService $rateService;

    public function __construct(RateCalculationService $rateService)
    {
        $this->rateService = $rateService;
    }

    public function calculate(Request $request)
    {
        try {
            $rates = $this->rateService->calculate($request->all());

            try {
                $origin = $request->input('originCountry', 'US');
                $dest = $request->input('destCountry', 'US');
                $weight = $request->input('weightKg', 10);
                Activity::create([
                    'event_type' => 'CALCULATE_RATE',
                    'description' => "Visitor calculated shipping estimates for {$weight}kg cargo ({$origin} -> {$dest})",
                    'entity_type' => 'rate',
                    'entity_id' => "RATE-{$origin}-{$dest}",
                    'ip_address' => $request->ip() ?: '127.0.0.1',
                    'user_agent' => substr($request->userAgent() ?: 'Client Web Browser', 0, 255),
                    'metadata' => [
                        'origin' => $origin,
                        'destination' => $dest,
                        'weightKg' => $weight,
                    ],
                ]);
            } catch (\Throwable $e) {}

            return response()->json([
                'success' => true,
                'data' => $rates,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error computing freight rates: ' . $e->getMessage()
            ], 500);
        }
    }
}
