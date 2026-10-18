<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'id' => 'br-nj',
                'name' => 'Crusaders Logistics Americas Superhub',
                'code' => 'US-EWR',
                'city' => 'New Jersey',
                'country' => 'United States',
                'address' => '300 Kansas Ave NW, New Jersey, NJ 07030',
                'phone' => '+1 (800) 555-CRU1',
                'email' => 'dispatch@crusaderslogistics.com',
                'hub_type' => 'GLOBAL_HEADQUARTERS',
            ],
            [
                'id' => 'br-lon',
                'name' => 'Crusaders Logistics London Cargo Hub',
                'code' => 'UK-LHR',
                'city' => 'London',
                'country' => 'United Kingdom',
                'address' => '25 Bank Street, Canary Wharf, London E14 5JP',
                'phone' => '+44 20 7946 0888',
                'email' => 'london.cargo@crusaderslogistics.com',
                'hub_type' => 'EUROPEAN_GATEWAY',
            ],
            [
                'id' => 'br-rot',
                'name' => 'Crusaders Logistics Maritime Port Terminal',
                'code' => 'NL-RTM',
                'city' => 'Rotterdam',
                'country' => 'Netherlands',
                'address' => 'Havenkwartier 405, 3011 KC Rotterdam',
                'phone' => '+31 10 992 4000',
                'email' => 'rotterdam@crusaderslogistics.com',
                'hub_type' => 'OCEAN_FREIGHT_DEPOT',
            ],
            [
                'id' => 'br-sg',
                'name' => 'Crusaders Logistics APAC Aviation Hub',
                'code' => 'SG-SIN',
                'city' => 'Singapore',
                'country' => 'Singapore',
                'address' => 'Marina Bay Financial Centre Tower 2, Singapore 018983',
                'phone' => '+65 6800 9000',
                'email' => 'apac.hub@crusaderslogistics.com',
                'hub_type' => 'ASIA_PACIFIC_SUPERHUB',
            ],
            [
                'id' => 'br-dxb',
                'name' => 'Crusaders Logistics Middle East Crossdock',
                'code' => 'AE-DXB',
                'city' => 'Dubai',
                'country' => 'United Arab Emirates',
                'address' => 'Dubai Airport Freezone (DAFZA), Building 4W, Dubai',
                'phone' => '+971 4 200 8888',
                'email' => 'me.hub@crusaderslogistics.com',
                'hub_type' => 'CROSS_CONTINENTAL_HUB',
            ],
        ];

        foreach ($branches as $b) {
            Branch::updateOrCreate(['id' => $b['id']], $b);
        }
    }
}
