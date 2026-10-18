<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\NotificationLog;
use App\Models\Activity;
use App\Mail\QuoteConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::latest('created_at')->get()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'data' => $quotes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'clientName' => 'required|string',
            'clientEmail' => 'required|email',
            'clientPhone' => 'nullable|string',
            'companyName' => 'nullable|string',
            'originCity' => 'required|string',
            'originCountry' => 'nullable|string',
            'destCity' => 'required|string',
            'destCountry' => 'nullable|string',
            'cargoType' => 'nullable|string',
            'weightKg' => 'nullable|numeric',
            'pieces' => 'nullable|integer',
            'dimensions' => 'nullable|array',
            'selectedService' => 'nullable|string',
            'estimatedRate' => 'nullable|numeric',
            'transitDays' => 'nullable|string',
            'specialInstructions' => 'nullable|string',
        ]);

        $quoteId = 'QTE-' . date('Y') . '-' . rand(10000, 99999);

        $quote = Quote::create([
            'id' => $quoteId,
            'client_name' => $validated['clientName'],
            'client_email' => $validated['clientEmail'],
            'client_phone' => $validated['clientPhone'] ?? null,
            'company_name' => $validated['companyName'] ?? null,
            'origin_city' => $validated['originCity'],
            'origin_country' => $validated['originCountry'] ?? 'United States',
            'dest_city' => $validated['destCity'],
            'dest_country' => $validated['destCountry'] ?? 'United States',
            'cargo_type' => $validated['cargoType'] ?? 'General Freight',
            'weight_kg' => $validated['weightKg'] ?? 10.0,
            'pieces' => $validated['pieces'] ?? 1,
            'dimensions' => $validated['dimensions'] ?? ['length' => 40, 'width' => 30, 'height' => 20],
            'selected_service' => $validated['selectedService'] ?? 'standard_ground',
            'estimated_rate' => $validated['estimatedRate'] ?? 0.0,
            'transit_days' => $validated['transitDays'] ?? '2-4 Business Days',
            'special_instructions' => $validated['specialInstructions'] ?? null,
            'status' => 'APPROVED',
        ]);

        try {
            Mail::to($quote->client_email)->send(new QuoteConfirmationMail($quote));

            NotificationLog::create([
                'id' => 'notif-' . Str::uuid(),
                'shipment_id' => $quote->id,
                'recipient_email' => $quote->client_email,
                'recipient_name' => $quote->client_name,
                'subject' => "Crusaders Logistics Freight Quote #{$quote->id}: {$quote->origin_city} to {$quote->dest_city}",
                'type' => 'QUOTE_CONFIRMATION',
                'status' => 'SENT',
                'preview_text' => "Quotation #{$quote->id} for {$quote->cargo_type} estimated at $" . number_format($quote->estimated_rate, 2) . " USD.",
                'html_content' => view('emails.quote_confirmation', ['quote' => $quote, 'data' => $quote->toFrontendArray()])->render(),
                'sent_at' => now(),
            ]);
        } catch (\Throwable $e) {
            NotificationLog::create([
                'id' => 'notif-' . Str::uuid(),
                'shipment_id' => $quote->id,
                'recipient_email' => $quote->client_email,
                'recipient_name' => $quote->client_name,
                'subject' => "Crusaders Logistics Freight Quote #{$quote->id}: {$quote->origin_city} to {$quote->dest_city}",
                'type' => 'QUOTE_CONFIRMATION',
                'status' => 'LOGGED',
                'preview_text' => "Quotation #{$quote->id} generated for {$quote->client_email}.",
                'html_content' => view('emails.quote_confirmation', ['quote' => $quote, 'data' => $quote->toFrontendArray()])->render(),
                'sent_at' => now(),
            ]);
        }

        // Log quote submission in Activity audit trail
        try {
            Activity::create([
                'event_type' => 'SUBMIT_QUOTE',
                'description' => "Client {$quote->client_name} requested freight quotation #{$quote->id} ({$quote->origin_city} -> {$quote->dest_city})",
                'entity_type' => 'quote',
                'entity_id' => $quote->id,
                'ip_address' => $request->ip() ?: '127.0.0.1',
                'user_agent' => substr($request->userAgent() ?: 'Client Web Browser', 0, 255),
                'metadata' => [
                    'rate' => $quote->estimated_rate,
                    'service' => $quote->selected_service,
                    'cargo' => $quote->cargo_type,
                    'weight' => $quote->weight_kg,
                ],
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => 'Quote generated and dispatched to your email.',
            'data' => $quote->toFrontendArray(),
        ], 201);
    }
}
