<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationLog;
use App\Models\Shipment;
use App\Mail\TestNotificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    /**
     * Get list of dispatched email notifications for the live outbox inspector
     */
    public function index()
    {
        $logs = NotificationLog::latest('sent_at')->limit(50)->get()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * Send test verification email to an email address
     */
    public function sendTestEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'customMessage' => 'nullable|string',
        ]);

        $email = $request->email;
        $customMessage = $request->customMessage ?: 'Verification ping from Crusaders Logistics automated dispatch system.';

        try {
            Mail::to($email)->send(new TestNotificationMail($email, $customMessage));

            $log = NotificationLog::create([
                'id' => 'notif-' . Str::uuid(),
                'shipment_id' => 'TEST-PING',
                'recipient_email' => $email,
                'recipient_name' => 'Subscribed Logistics Operator',
                'subject' => '[Crusaders Logistics Test Ping] Automated Logistics Notification System Verified',
                'type' => 'TEST_DISPATCH',
                'status' => 'SENT',
                'preview_text' => $customMessage,
                'html_content' => view('emails.test_notification', [
                    'recipientEmail' => $email,
                    'customMessage' => $customMessage,
                ])->render(),
                'sent_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => "Test email dispatched to {$email}! View in Notification Outbox.",
                'result' => $log->toFrontendArray(),
            ]);
        } catch (\Throwable $e) {
            $log = NotificationLog::create([
                'id' => 'notif-' . Str::uuid(),
                'shipment_id' => 'TEST-PING',
                'recipient_email' => $email,
                'recipient_name' => 'Subscribed Logistics Operator',
                'subject' => '[Crusaders Logistics Test Ping] Automated Logistics Notification System Verified',
                'type' => 'TEST_DISPATCH',
                'status' => 'LOGGED',
                'preview_text' => $customMessage . " (Driver notice: {$e->getMessage()})",
                'html_content' => view('emails.test_notification', [
                    'recipientEmail' => $email,
                    'customMessage' => $customMessage,
                ])->render(),
                'sent_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => "Test notification logged for {$email}. (Transport: " . config('mail.default') . ")",
                'result' => $log->toFrontendArray(),
            ]);
        }
    }
}
