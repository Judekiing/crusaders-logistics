<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shipment;
use App\Models\Checkpoint;
use App\Models\NotificationLog;

class ShipmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. TRN12345 (User's primary reference shipment)
        $s1 = Shipment::create([
            'tracking_number' => 'TRN12345',
            'sender_name' => 'Crusaders Logistics Global Forwarding',
            'sender_email' => 'dispatch@crusaderslogistics.com',
            'sender_phone' => '+1 (800) 555-CRU1',
            'origin_address' => '300 Kansas Ave NW',
            'origin_city' => 'New Jersey',
            'origin_state' => 'NJ',
            'origin_country' => 'United States',
            'origin_zip' => '07030',
            'receiver_name' => 'Jonathan Curr',
            'receiver_email' => 'jonathan.curr@currltd.co.uk',
            'receiver_phone' => '+44 20 7946 0991',
            'dest_address' => '25 Bank Street, Canary Wharf',
            'dest_city' => 'London',
            'dest_state' => 'Greater London',
            'dest_country' => 'United Kingdom',
            'dest_zip' => 'E14 5JP',
            'service_type' => 'express_air',
            'service_name' => 'Crusaders Logistics International Air Priority',
            'package_type' => 'pallet',
            'package_description' => 'Industrial Electronics & Precision Automation Spares',
            'pieces' => 3,
            'weight_kg' => 215.0,
            'chargeable_weight_kg' => 268.8,
            'dimensions' => ['length' => 120, 'width' => 80, 'height' => 140],
            'declared_value' => 65000,
            'currency' => 'USD',
            'insurance_required' => true,
            'signature_required' => true,
            'current_status' => 'IN_TRANSIT',
            'status_label' => 'In Transit - Trans-Atlantic Flight Sector',
            'estimated_delivery' => '2026-10-18 16:00:00',
            'booked_at' => '2026-10-15 08:30:00',
            'assigned_driver' => 'Flight Capt. Harrison (Boeing 777F #FLX-880)',
            'vehicle_info' => 'Boeing 777F Cargo Airlifter / Flx-880',
            'route_coordinates' => [
                'origin' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => 'New Jersey Dispatch Center'],
                'current' => ['lat' => 51.4700, 'lng' => -0.4543, 'label' => 'London Heathrow Cargo Hub (LHR)'],
                'destination' => ['lat' => 51.5055, 'lng' => -0.0166, 'label' => 'Canary Wharf Consignee Depot'],
            ],
        ]);

        Checkpoint::create([
            'shipment_id' => $s1->id,
            'status' => 'ORDER_PLACED',
            'status_title' => 'Waybill Issued & Consignment Manifest Logged',
            'location' => 'New Jersey, USA',
            'operator' => 'Automated Dispatch System',
            'notes' => 'Booking confirmed under e-AWB #TRN12345. Commercial invoice validated.',
            'checkpoint_time' => '2026-10-15 08:30:00',
        ]);

        Checkpoint::create([
            'shipment_id' => $s1->id,
            'status' => 'PICKED_UP',
            'status_title' => 'Cargo Collected by Crusaders Logistics Feeder Fleet',
            'location' => '300 Kansas Ave NW, New Jersey',
            'operator' => 'Driver Tom Keller (Unit #44)',
            'driver' => 'Tom Keller',
            'notes' => 'Pallets loaded, tamper-evident security seals affixed (#LF-99211).',
            'checkpoint_time' => '2026-10-15 12:15:00',
        ]);

        Checkpoint::create([
            'shipment_id' => $s1->id,
            'status' => 'IN_TRANSIT',
            'status_title' => 'Trans-Atlantic Flight Departure (JFK -> LHR)',
            'location' => 'JFK International Airport / Trans-Atlantic Corridor',
            'operator' => 'Aviation Cargo Team',
            'driver' => 'Flight Capt. Harrison',
            'notes' => 'En route to Heathrow Hub. Altitude 35,000ft. Telemetry normal.',
            'checkpoint_time' => '2026-10-16 02:40:00',
        ]);

        // 2. APX-774921-US
        $s2 = Shipment::create([
            'tracking_number' => 'APX-774921-US',
            'sender_name' => 'Global Pharma Distribution',
            'sender_email' => 'dispatch@globalpharma.com',
            'sender_phone' => '+1 (555) 019-2831',
            'origin_address' => '450 Innovation Parkway, Suite 200',
            'origin_city' => 'Boston',
            'origin_state' => 'MA',
            'origin_country' => 'United States',
            'origin_zip' => '02142',
            'receiver_name' => 'Sarah Jenkins',
            'receiver_email' => 's.jenkins@medtech-seattle.org',
            'receiver_phone' => '+1 (206) 555-0149',
            'dest_address' => '782 Rainier Avenue S',
            'dest_city' => 'Seattle',
            'dest_state' => 'WA',
            'dest_country' => 'United States',
            'dest_zip' => '98144',
            'service_type' => 'express_air',
            'service_name' => 'Crusaders Logistics Priority Air Express',
            'package_type' => 'box',
            'package_description' => 'Medical Diagnostic Equipment',
            'pieces' => 2,
            'weight_kg' => 14.5,
            'chargeable_weight_kg' => 18.0,
            'dimensions' => ['length' => 45, 'width' => 35, 'height' => 30],
            'declared_value' => 8500,
            'currency' => 'USD',
            'insurance_required' => true,
            'signature_required' => true,
            'current_status' => 'OUT_FOR_DELIVERY',
            'status_label' => 'Out for Delivery with Local Courier Unit',
            'estimated_delivery' => '2026-10-17 17:30:00',
            'booked_at' => '2026-10-14 10:15:00',
            'assigned_driver' => 'Marcus Vance (Unit #12)',
            'vehicle_info' => 'Electric Delivery Sprinter EV-994',
            'route_coordinates' => [
                'origin' => ['lat' => 42.3601, 'lng' => -71.0589, 'label' => 'Boston Central Depot'],
                'current' => ['lat' => 47.5800, 'lng' => -122.3100, 'label' => 'Seattle Metro Hub'],
                'destination' => ['lat' => 47.6062, 'lng' => -122.3321, 'label' => 'Rainier Ave Delivery Point'],
            ],
        ]);

        Checkpoint::create([
            'shipment_id' => $s2->id,
            'status' => 'ORDER_PLACED',
            'status_title' => 'Manifest Received & Electronic Waybill Generated',
            'location' => 'Boston Distribution Center',
            'operator' => 'Automated Dispatch Hub',
            'notes' => 'Commercial shipment accepted into Crusaders Logistics priority stream.',
            'checkpoint_time' => '2026-10-14 10:15:00',
        ]);

        Checkpoint::create([
            'shipment_id' => $s2->id,
            'status' => 'IN_TRANSIT',
            'status_title' => 'Arrived at Seattle Regional Processing Facility',
            'location' => 'Seattle South Terminal',
            'operator' => 'Hub Sorting Agent',
            'notes' => 'Customs and security scan cleared. Transferred to final mile van.',
            'checkpoint_time' => '2026-10-16 19:40:00',
        ]);

        Checkpoint::create([
            'shipment_id' => $s2->id,
            'status' => 'OUT_FOR_DELIVERY',
            'status_title' => 'Loaded into Delivery Vehicle #12',
            'location' => 'Seattle, WA',
            'operator' => 'Marcus Vance',
            'driver' => 'Marcus Vance',
            'notes' => 'Courier en route to Rainier Ave. Contactless delivery if unavailable.',
            'checkpoint_time' => '2026-10-17 08:15:00',
        ]);

        // 3. APX-304912-EU (Delivered)
        $s3 = Shipment::create([
            'tracking_number' => 'APX-304912-EU',
            'sender_name' => 'Nordic BioTech AS',
            'sender_email' => 'logistics@nordicbio.no',
            'sender_phone' => '+47 21 00 12 34',
            'origin_address' => 'Gaustadalléen 21',
            'origin_city' => 'Oslo',
            'origin_country' => 'Norway',
            'receiver_name' => 'Klaus Becker',
            'receiver_email' => 'klaus.becker@berlin-health.de',
            'dest_address' => 'Charitéplatz 1',
            'dest_city' => 'Berlin',
            'dest_country' => 'Germany',
            'service_type' => 'cold_chain',
            'service_name' => 'Crusaders Logistics BioPharma Active Cold-Chain',
            'package_type' => 'crate',
            'package_description' => 'Temperature-controlled Vaccines (-20°C)',
            'pieces' => 1,
            'weight_kg' => 28.0,
            'chargeable_weight_kg' => 28.0,
            'declared_value' => 45000,
            'currency' => 'EUR',
            'insurance_required' => true,
            'signature_required' => true,
            'current_status' => 'DELIVERED',
            'status_label' => 'Delivered & Consignee Signed',
            'estimated_delivery' => '2026-10-16 11:00:00',
            'booked_at' => '2026-10-13 09:00:00',
            'delivered_at' => '2026-10-16 10:45:00',
            'assigned_driver' => 'Hans Gruber',
            'vehicle_info' => 'ThermoKing Reefer Van #DE-901',
            'route_coordinates' => [
                'origin' => ['lat' => 59.9139, 'lng' => 10.7522, 'label' => 'Oslo Bio Hub'],
                'current' => ['lat' => 52.5200, 'lng' => 13.4050, 'label' => 'Berlin Charite Dock'],
                'destination' => ['lat' => 52.5200, 'lng' => 13.4050, 'label' => 'Berlin Hospital Warehouse'],
            ],
        ]);

        Checkpoint::create([
            'shipment_id' => $s3->id,
            'status' => 'ORDER_PLACED',
            'status_title' => 'Reefer Unit Reserved & Pre-Cooled to -20°C',
            'location' => 'Oslo Airport Cold Center',
            'operator' => 'Cold-Chain QA Lead',
            'notes' => 'Temperature logger initialized and calibrated.',
            'checkpoint_time' => '2026-10-13 09:00:00',
        ]);

        Checkpoint::create([
            'shipment_id' => $s3->id,
            'status' => 'DELIVERED',
            'status_title' => 'Delivered to Hospital Receiving Dock',
            'location' => 'Charité Hospital, Berlin',
            'operator' => 'Hans Gruber',
            'driver' => 'Hans Gruber',
            'notes' => 'Consignee Klaus Becker inspected temperature sensor. Signed off OK.',
            'checkpoint_time' => '2026-10-16 10:45:00',
        ]);

        // Pre-seed initial notification log for outbox preview
        NotificationLog::create([
            'id' => 'notif-seed-01',
            'shipment_id' => 'TRN12345',
            'recipient_email' => 'jonathan.curr@currltd.co.uk',
            'recipient_name' => 'Jonathan Curr',
            'subject' => 'Crusaders Logistics Dispatch Confirmed: Waybill #TRN12345',
            'type' => 'BOOKING_CONFIRMATION',
            'status' => 'SENT',
            'preview_text' => 'Consignment manifest TRN12345 confirmed for New Jersey to London Heathrow transit corridor.',
            'sent_at' => '2026-10-15 08:31:00',
        ]);

        NotificationLog::create([
            'id' => 'notif-seed-02',
            'shipment_id' => 'TRN12345',
            'recipient_email' => 'jonathan.curr@currltd.co.uk',
            'recipient_name' => 'Jonathan Curr',
            'subject' => 'Crusaders Logistics Milestone: [TRN12345] IN TRANSIT',
            'type' => 'STATUS_UPDATE',
            'status' => 'SENT',
            'preview_text' => 'Flight Capt. Harrison departs JFK for London Heathrow. Altitude 35,000ft.',
            'sent_at' => '2026-10-16 02:41:00',
        ]);
    }
}
