<?php

namespace App\Services;

class RateCalculationService
{
    public const SERVICE_TIERS = [
        'express_air' => [
            'id' => 'express_air',
            'name' => 'Crusaders Logistics Priority Air Express',
            'baseFee' => 95.0,
            'ratePerKg' => 11.80,
            'transitTime' => '1-2 Business Days',
            'icon' => 'Plane',
            'description' => 'Time-critical air courier with guaranteed delivery slot and next-day arrival.'
        ],
        'standard_ground' => [
            'id' => 'standard_ground',
            'name' => 'Crusaders Logistics Intermodal Ground Freight',
            'baseFee' => 45.0,
            'ratePerKg' => 2.85,
            'transitTime' => '3-5 Business Days',
            'icon' => 'Truck',
            'description' => 'Cost-effective nationwide road and rail network for commercial palletized cargo.'
        ],
        'ocean_cargo' => [
            'id' => 'ocean_cargo',
            'name' => 'Crusaders Logistics Ocean Maritime FCL/LCL',
            'baseFee' => 180.0,
            'ratePerKg' => 0.85,
            'transitTime' => '14-22 Business Days',
            'icon' => 'Ship',
            'description' => 'Maximum efficiency for large-scale container loads and bulk international freight.'
        ],
        'cold_chain' => [
            'id' => 'cold_chain',
            'name' => 'Crusaders Logistics BioPharma Active Cold-Chain',
            'baseFee' => 150.0,
            'ratePerKg' => 8.40,
            'transitTime' => '2-4 Business Days',
            'icon' => 'ThermometerSnowflake',
            'description' => 'Certified GDP temperature-controlled transit (2°C-8°C / -20°C) with continuous IoT telemetry.'
        ],
        'last_mile' => [
            'id' => 'last_mile',
            'name' => 'Crusaders Logistics Urban Last-Mile Express',
            'baseFee' => 30.0,
            'ratePerKg' => 4.50,
            'transitTime' => 'Same-Day / Next-Day',
            'icon' => 'PackageCheck',
            'description' => 'Dedicated courier fleet for rapid metropolitan and direct-to-door delivery.'
        ],
    ];

    public function calculate(array $data): array
    {
        $originCountry = strtoupper($data['originCountry'] ?? 'US');
        $destCountry = strtoupper($data['destCountry'] ?? 'US');
        $actualWeight = max(1, (float)($data['weightKg'] ?? 10));
        $length = max(10, (float)($data['lengthCm'] ?? 40));
        $width = max(10, (float)($data['widthCm'] ?? 30));
        $height = max(10, (float)($data['heightCm'] ?? 25));
        $pieces = max(1, (int)($data['pieces'] ?? 1));
        $declaredValue = max(0, (float)($data['declaredValue'] ?? 0));
        $insuranceRequired = !empty($data['insuranceRequired']);
        $signatureRequired = !empty($data['signatureRequired']);

        // Volumetric weight IATA standard: (L x W x H in cm / 5000) * pieces
        $volumetricWeightPerPiece = ($length * $width * $height) / 5000;
        $totalVolumetricWeight = $volumetricWeightPerPiece * $pieces;
        $chargeableWeight = max($actualWeight, $totalVolumetricWeight);

        $isInternational = ($originCountry !== $destCountry);
        $intlMultiplier = $isInternational ? 1.45 : 1.0;

        $insuranceFee = ($insuranceRequired && $declaredValue > 0) ? max(25, $declaredValue * 0.0075) : 0.0;
        $signatureFee = $signatureRequired ? 15.0 : 0.0;
        $customsFee = $isInternational ? 65.0 : 0.0;

        $results = [];

        foreach (self::SERVICE_TIERS as $service) {
            $baseCargoCost = ($service['baseFee'] + ($service['ratePerKg'] * $chargeableWeight)) * $intlMultiplier;
            $fuelSurcharge = $baseCargoCost * 0.12;
            $subtotal = $baseCargoCost + $fuelSurcharge + $customsFee + $insuranceFee + $signatureFee;
            $total = round($subtotal, 2);

            $results[] = [
                'serviceId' => $service['id'],
                'name' => $service['name'],
                'transitTime' => $service['transitTime'],
                'icon' => $service['icon'],
                'description' => $service['description'],
                'breakdown' => [
                    'baseFee' => round($service['baseFee'] * $intlMultiplier, 2),
                    'weightCharge' => round($service['ratePerKg'] * $chargeableWeight * $intlMultiplier, 2),
                    'fuelSurcharge' => round($fuelSurcharge, 2),
                    'customsFee' => round($customsFee, 2),
                    'insuranceFee' => round($insuranceFee, 2),
                    'signatureFee' => round($signatureFee, 2),
                ],
                'chargeableWeightKg' => round($chargeableWeight, 2),
                'total' => $total,
                'currency' => 'USD',
            ];
        }

        return [
            'metrics' => [
                'actualWeightKg' => $actualWeight,
                'volumetricWeightKg' => round($totalVolumetricWeight, 2),
                'chargeableWeightKg' => round($chargeableWeight, 2),
                'isInternational' => $isInternational,
                'pieces' => $pieces,
            ],
            'services' => $results,
        ];
    }
}
