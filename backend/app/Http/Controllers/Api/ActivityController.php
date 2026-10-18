<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Get live audit trail of user activities
     */
    public function index(Request $request)
    {
        $query = Activity::latest('id');

        if ($request->filled('eventType') && $request->eventType !== 'ALL') {
            $query->where('event_type', $request->eventType);
        }

        if ($request->filled('search')) {
            $s = strtolower(trim($request->search));
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(description) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(entity_id) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(event_type) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(ip_address) LIKE ?', ["%{$s}%"]);
            });
        }

        $activities = $query->limit(100)->get()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'count' => $activities->count(),
            'data' => $activities,
        ]);
    }

    /**
     * Log a new user or visitor activity
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'eventType' => 'required|string',
            'description' => 'required|string',
            'entityType' => 'nullable|string',
            'entityId' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $ip = $request->ip() ?: '127.0.0.1';
        $ua = $request->userAgent() ?: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

        $activity = Activity::create([
            'event_type' => $validated['eventType'],
            'description' => $validated['description'],
            'entity_type' => $validated['entityType'] ?? null,
            'entity_id' => $validated['entityId'] ?? null,
            'ip_address' => $ip,
            'user_agent' => substr($ua, 0, 255),
            'metadata' => $validated['metadata'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $activity->toFrontendArray(),
        ], 201);
    }

    /**
     * Purge activity audit log
     */
    public function clear()
    {
        Activity::truncate();

        // Re-seed essential initial administrative log
        Activity::create([
            'event_type' => 'ADMIN_ACTION',
            'description' => 'Admin operator purged previous activity audit log',
            'entity_type' => 'admin',
            'entity_id' => 'SYS-CLEAR',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Crusaders Logistics Office Console',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Activity audit logs cleared successfully.',
        ]);
    }
}
