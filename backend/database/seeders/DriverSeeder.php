<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = [
            [
                'id' => 'drv-1',
                'name' => 'David Kowalski',
                'phone' => '+1 (555) 234-5678',
                'vehicle_type' => 'Boeing 767 Freight (Flx-902)',
                'plate_number' => 'N-880FLX',
                'status' => 'Active',
                'current_city' => 'New York / JFK'
            ],
            [
                'id' => 'drv-2',
                'name' => 'Marcus Vance',
                'phone' => '+1 (206) 555-8833',
                'vehicle_type' => 'Sprinter EV Delivery Van',
                'plate_number' => 'WA-492-EV',
                'status' => 'On Route',
                'current_city' => 'Seattle'
            ],
            [
                'id' => 'drv-3',
                'name' => 'Elena Rostova',
                'phone' => '+49 170 555 4912',
                'vehicle_type' => 'Volvo FH Electric Heavy Haul',
                'plate_number' => 'B-ER-991',
                'status' => 'Available',
                'current_city' => 'Frankfurt'
            ],
            [
                'id' => 'drv-4',
                'name' => 'Tomas Rodriguez',
                'phone' => '+1 (718) 555-0922',
                'vehicle_type' => 'Freightliner Cascadia Intermodal',
                'plate_number' => 'NJ-771-TRK',
                'status' => 'Available',
                'current_city' => 'New Jersey'
            ]
        ];

        foreach ($drivers as $d) {
            Driver::updateOrCreate(['id' => $d['id']], $d);
        }
    }
}
