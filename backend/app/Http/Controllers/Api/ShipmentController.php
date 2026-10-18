<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\Checkpoint;
use App\Models\NotificationLog;
use App\Models\Activity;
use App\Mail\ShipmentBookedMail;
use App\Mail\ShipmentStatusUpdatedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ShipmentController extends Controller
{
    /**
     * List all shipments with search and status filtering
     */
    public function index(Request $request)
    {
        $query = Shipment::with('checkpoints')->latest('id');

        if ($request->filled('status') && $request->status !== 'ALL') {
            $query->where('current_status', $request->status);
        }

        if ($request->filled('search')) {
            $q = strtolower(trim($request->search));
            $query->where(function ($b) use ($q) {
                $b->whereRaw('LOWER(tracking_number) LIKE ?', ["%{$q}%"])
                  ->orWhereRaw('LOWER(sender_name) LIKE ?', ["%{$q}%"])
                  ->orWhereRaw('LOWER(receiver_name) LIKE ?', ["%{$q}%"])
                  ->orWhereRaw('LOWER(origin_city) LIKE ?', ["%{$q}%"])
                  ->orWhereRaw('LOWER(dest_city) LIKE ?', ["%{$q}%"]);
            });
        }

        $shipments = $query->get()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'count' => $shipments->count(),
            'data' => $shipments,
        ]);
    }

    /**
     * Get single shipment telemetry by tracking number
     */
    public function show($trackingNumber)
    {
        $shipment = Shipment::with('checkpoints')
            ->where('tracking_number', trim($trackingNumber))
            ->first();

        if (!$shipment) {
            return response()->json([
                'success' => false,
                'message' => 'Shipment not found. Please verify tracking number.'
            ], 404);
        }

        // Log visitor tracking lookup activity
        try {
            Activity::create([
                'event_type' => 'TRACK_PARCEL',
                'description' => "Visitor tracked waybill #{$shipment->tracking_number} ({$shipment->current_status})",
                'entity_type' => 'shipment',
                'entity_id' => $shipment->tracking_number,
                'ip_address' => request()->ip() ?: '127.0.0.1',
                'user_agent' => substr(request()->userAgent() ?: 'Browser Client', 0, 255),
                'metadata' => [
                    'origin' => $shipment->origin_city,
                    'destination' => $shipment->dest_city,
                    'status' => $shipment->current_status,
                ],
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'data' => $shipment->toFrontendArray()
        ]);
    }

    /**
     * Book a new shipment and trigger automated booking confirmation email
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'senderName' => 'required|string',
            'senderEmail' => 'nullable|email',
            'senderPhone' => 'nullable|string',
            'originAddress' => 'nullable|string',
            'originCity' => 'required|string',
            'originState' => 'nullable|string',
            'originCountry' => 'nullable|string',
            'originZip' => 'nullable|string',
            'receiverName' => 'required|string',
            'receiverEmail' => 'nullable|email',
            'receiverPhone' => 'nullable|string',
            'destAddress' => 'nullable|string',
            'destCity' => 'required|string',
            'destState' => 'nullable|string',
            'destCountry' => 'nullable|string',
            'destZip' => 'nullable|string',
            'serviceType' => 'nullable|string',
            'serviceName' => 'nullable|string',
            'packageType' => 'nullable|string',
            'packageDescription' => 'nullable|string',
            'pieces' => 'nullable|integer',
            'weightKg' => 'nullable|numeric',
            'dimensions' => 'nullable|array',
            'declaredValue' => 'nullable|numeric',
            'insuranceRequired' => 'nullable|boolean',
            'signatureRequired' => 'nullable|boolean',
            'assignedDriver' => 'nullable|string',
            'vehicleInfo' => 'nullable|string',
            'estimatedDelivery' => 'nullable|string',
        ]);

        $trackingNumber = $request->trackingNumber;
        if (!$trackingNumber) {
            $countryCode = strtoupper(substr($validated['destCountry'] ?? 'US', 0, 2));
            $trackingNumber = 'FLX-' . rand(100000, 999999) . '-' . $countryCode;
        }

        $estimatedDelivery = $request->filled('estimatedDelivery')
            ? date('Y-m-d H:i:s', strtotime($request->estimatedDelivery))
            : now()->addDays(3);

        $shipment = Shipment::create([
            'tracking_number' => $trackingNumber,
            'sender_name' => $validated['senderName'],
            'sender_email' => $validated['senderEmail'] ?? null,
            'sender_phone' => $validated['senderPhone'] ?? null,
            'origin_address' => $validated['originAddress'] ?? null,
            'origin_city' => $validated['originCity'],
            'origin_state' => $validated['originState'] ?? null,
            'origin_country' => $validated['originCountry'] ?? 'United States',
            'origin_zip' => $validated['originZip'] ?? null,
            'receiver_name' => $validated['receiverName'],
            'receiver_email' => $validated['receiverEmail'] ?? null,
            'receiver_phone' => $validated['receiverPhone'] ?? null,
            'dest_address' => $validated['destAddress'] ?? null,
            'dest_city' => $validated['destCity'],
            'dest_state' => $validated['destState'] ?? null,
            'dest_country' => $validated['destCountry'] ?? 'United States',
            'dest_zip' => $validated['destZip'] ?? null,
            'service_type' => $validated['serviceType'] ?? 'express_air',
            'service_name' => $validated['serviceName'] ?? 'Crusaders Logistics Priority Air Express',
            'package_type' => $validated['packageType'] ?? 'box',
            'package_description' => $validated['packageDescription'] ?? 'General Cargo Consignment',
            'pieces' => $validated['pieces'] ?? 1,
            'weight_kg' => $validated['weightKg'] ?? 10.0,
            'chargeable_weight_kg' => $validated['weightKg'] ?? 10.0,
            'dimensions' => $validated['dimensions'] ?? ['length' => 40, 'width' => 30, 'height' => 20],
            'declared_value' => $validated['declaredValue'] ?? 0.0,
            'insurance_required' => (bool)($validated['insuranceRequired'] ?? false),
            'signature_required' => (bool)($validated['signatureRequired'] ?? false),
            'current_status' => 'ORDER_PLACED',
            'status_label' => 'Booking Confirmed - Consignment Manifest Logged',
            'estimated_delivery' => $estimatedDelivery,
            'booked_at' => now(),
            'assigned_driver' => $validated['assignedDriver'] ?? 'Fleet Dispatch Hub',
            'vehicle_info' => $validated['vehicleInfo'] ?? 'Crusaders Logistics Standard Fleet',
            'route_coordinates' => [
                'origin' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => $validated['originCity']],
                'current' => ['lat' => 40.7128, 'lng' => -74.0060, 'label' => $validated['originCity'] . ' Depot'],
                'destination' => ['lat' => 51.5074, 'lng' => -0.1278, 'label' => $validated['destCity']],
            ],
        ]);

        // Create first checkpoint
        $checkpoint = Checkpoint::create([
            'shipment_id' => $shipment->id,
            'status' => 'ORDER_PLACED',
            'status_title' => 'Waybill Issued & Consignment Manifest Logged',
            'location' => $shipment->origin_city . ', ' . $shipment->origin_country,
            'operator' => 'Automated Dispatch System',
            'notes' => "Booking confirmed under e-AWB #{$shipment->tracking_number}. Commercial invoice validated.",
            'checkpoint_time' => now(),
        ]);

        // Trigger automatic confirmation email
        $targetEmail = $shipment->receiver_email ?: $shipment->sender_email;
        if ($targetEmail) {
            try {
                Mail::to($targetEmail)->send(new ShipmentBookedMail($shipment));

                NotificationLog::create([
                    'id' => 'notif-' . Str::uuid(),
                    'shipment_id' => $shipment->tracking_number,
                    'recipient_email' => $targetEmail,
                    'recipient_name' => $shipment->receiver_name ?: $shipment->sender_name,
                    'subject' => "Crusaders Logistics Dispatch Confirmed: Waybill #{$shipment->tracking_number}",
                    'type' => 'BOOKING_CONFIRMATION',
                    'status' => 'SENT',
                    'preview_text' => "Waybill {$shipment->tracking_number} issued. Scheduled pickup from {$shipment->origin_city} to {$shipment->dest_city}.",
                    'html_content' => view('emails.booking_confirmation', ['shipment' => $shipment, 'data' => $shipment->toFrontendArray()])->render(),
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $e) {
                // Log failed email attempt
                NotificationLog::create([
                    'id' => 'notif-' . Str::uuid(),
                    'shipment_id' => $shipment->tracking_number,
                    'recipient_email' => $targetEmail,
                    'recipient_name' => $shipment->receiver_name ?: $shipment->sender_name,
                    'subject' => "Crusaders Logistics Dispatch Confirmed: Waybill #{$shipment->tracking_number}",
                    'type' => 'BOOKING_CONFIRMATION',
                    'status' => 'LOGGED',
                    'preview_text' => "Generated: Waybill {$shipment->tracking_number} booked (Mail driver notice: {$e->getMessage()})",
                    'html_content' => view('emails.booking_confirmation', ['shipment' => $shipment, 'data' => $shipment->toFrontendArray()])->render(),
                    'sent_at' => now(),
                ]);
            }
        }

        // Log parcel creation in Activity audit trail
        try {
            Activity::create([
                'event_type' => 'CREATE_PARCEL',
                'description' => "Consignment #{$shipment->tracking_number} booked ({$shipment->origin_city} -> {$shipment->dest_city}) for {$shipment->receiver_name}",
                'entity_type' => 'shipment',
                'entity_id' => $shipment->tracking_number,
                'ip_address' => $request->ip() ?: '127.0.0.1',
                'user_agent' => substr($request->userAgent() ?: 'Office / Web Console', 0, 255),
                'metadata' => [
                    'weightKg' => $shipment->weight_kg,
                    'pieces' => $shipment->pieces,
                    'service' => $shipment->service_type,
                    'sender' => $shipment->sender_name,
                    'receiver' => $shipment->receiver_name,
                ],
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => 'Shipment booked successfully and confirmation email dispatched.',
            'data' => $shipment->fresh(['checkpoints'])->toFrontendArray(),
        ], 201);
    }

    /**
     * Update status, insert milestone checkpoint & notify customer
     */
    public function updateStatus(Request $request, $trackingNumber)
    {
        $shipment = Shipment::where('tracking_number', trim($trackingNumber))->first();

        if (!$shipment) {
            return response()->json(['success' => false, 'message' => 'Shipment not found.'], 404);
        }

        $status = $request->input('status', 'IN_TRANSIT');
        $statusTitle = $request->input('statusTitle') ?: ucwords(str_replace('_', ' ', strtolower($status)));
        $location = $request->input('location', $shipment->origin_city . ' Hub');
        $operator = $request->input('operator', 'Ops Dispatch');
        $driver = $request->input('driver', $shipment->assigned_driver);
        $notes = $request->input('notes', '');
        $notifyCustomer = $request->boolean('notifyCustomer', true);

        $shipment->current_status = $status;
        $shipment->status_label = $statusTitle;
        if ($driver) $shipment->assigned_driver = $driver;
        if ($request->filled('eta')) {
            $shipment->estimated_delivery = date('Y-m-d H:i:s', strtotime($request->eta));
        }
        if ($status === 'DELIVERED') {
            $shipment->delivered_at = now();
        }
        $shipment->save();

        $checkpoint = Checkpoint::create([
            'shipment_id' => $shipment->id,
            'status' => $status,
            'status_title' => $statusTitle,
            'location' => $location,
            'operator' => $operator,
            'driver' => $driver,
            'notes' => $notes,
            'checkpoint_time' => now(),
        ]);

        // Send customer milestone alert email
        $recipient = $shipment->receiver_email ?: $shipment->sender_email;
        if ($notifyCustomer && $recipient) {
            try {
                Mail::to($recipient)->send(new ShipmentStatusUpdatedMail($shipment, $checkpoint));

                NotificationLog::create([
                    'id' => 'notif-' . Str::uuid(),
                    'shipment_id' => $shipment->tracking_number,
                    'recipient_email' => $recipient,
                    'recipient_name' => $shipment->receiver_name ?: $shipment->sender_name,
                    'subject' => "Crusaders Logistics Milestone: [{$shipment->tracking_number}] " . str_replace('_', ' ', $status),
                    'type' => $status === 'DELIVERED' ? 'DELIVERY_CONFIRMATION' : 'STATUS_UPDATE',
                    'status' => 'SENT',
                    'preview_text' => "Checkpoint update: {$statusTitle} at {$location}.",
                    'html_content' => view('emails.status_update', [
                        'shipment' => $shipment,
                        'data' => $shipment->toFrontendArray(),
                        'checkpoint' => $checkpoint
                    ])->render(),
                    'sent_at' => now(),
                ]);
            } catch (\Throwable $e) {
                NotificationLog::create([
                    'id' => 'notif-' . Str::uuid(),
                    'shipment_id' => $shipment->tracking_number,
                    'recipient_email' => $recipient,
                    'recipient_name' => $shipment->receiver_name ?: $shipment->sender_name,
                    'subject' => "Crusaders Logistics Milestone: [{$shipment->tracking_number}] " . str_replace('_', ' ', $status),
                    'type' => $status === 'DELIVERED' ? 'DELIVERY_CONFIRMATION' : 'STATUS_UPDATE',
                    'status' => 'LOGGED',
                    'preview_text' => "Milestone logged: {$statusTitle} at {$location}.",
                    'html_content' => view('emails.status_update', [
                        'shipment' => $shipment,
                        'data' => $shipment->toFrontendArray(),
                        'checkpoint' => $checkpoint
                    ])->render(),
                    'sent_at' => now(),
                ]);
            }
        }

        // Log status update in Activity audit trail
        try {
            Activity::create([
                'event_type' => 'UPDATE_STATUS',
                'description' => "Consignment #{$shipment->tracking_number} status advanced to {$status} ({$statusTitle}) at {$location}",
                'entity_type' => 'shipment',
                'entity_id' => $shipment->tracking_number,
                'ip_address' => $request->ip() ?: '127.0.0.1',
                'user_agent' => substr($request->userAgent() ?: 'Office / Web Console', 0, 255),
                'metadata' => [
                    'status' => $status,
                    'statusTitle' => $statusTitle,
                    'location' => $location,
                    'operator' => $operator,
                    'driver' => $driver,
                ],
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => "Shipment {$trackingNumber} status updated to {$status}. Notification dispatched.",
            'data' => $shipment->fresh(['checkpoints'])->toFrontendArray(),
            'checkpoint' => [
                'id' => $checkpoint->id,
                'status' => $checkpoint->status,
                'statusTitle' => $checkpoint->status_title,
                'location' => $checkpoint->location,
                'operator' => $checkpoint->operator,
                'driver' => $checkpoint->driver,
                'notes' => $checkpoint->notes,
                'timestamp' => $checkpoint->checkpoint_time?->toISOString(),
            ],
        ]);
    }

    /**
     * Delete / archive a shipment record
     */
    public function destroy($trackingNumber)
    {
        $shipment = Shipment::where('tracking_number', trim($trackingNumber))->first();

        if (!$shipment) {
            return response()->json(['success' => false, 'message' => 'Shipment not found.'], 404);
        }

        $code = $shipment->tracking_number;
        $shipment->delete();

        try {
            Activity::create([
                'event_type' => 'ADMIN_ACTION',
                'description' => "Admin removed consignment #{$code} from active operations manifest",
                'entity_type' => 'shipment',
                'entity_id' => $code,
                'ip_address' => request()->ip() ?: '127.0.0.1',
                'user_agent' => substr(request()->userAgent() ?: 'Office Console', 0, 255),
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => "Shipment #{$code} successfully deleted."
        ]);
    }
}

