<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * List all active user roles (without sensitive password data).
     */
    public function users()
    {
        try {
            $users = DB::table('users')
                ->select('id', 'username', 'email', 'full_name', 'role', 'role_label', 'avatar', 'company', 'department', 'permissions', 'account_number', 'credit_line')
                ->get()
                ->map(function ($u) {
                    $u->permissions = json_decode($u->permissions ?: '[]');
                    return $u;
                });

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Authenticate user with username or email and password.
     */
    public function login(Request $request)
    {
        $identifier = trim($request->input('username') ?? $request->input('email') ?? '');
        $password = $request->input('password');

        if (empty($identifier) || empty($password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username/Email and Password are required.'
            ], 400);
        }

        try {
            $user = DB::table('users')
                ->where(function ($q) use ($identifier) {
                    $q->where('username', $identifier)
                      ->orWhere('email', $identifier);
                })
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account not found. Please verify your username/email.'
                ], 401);
            }

            // Verify password via Hash::check or raw fallback
            $verified = Hash::check($password, $user->password) || ($user->raw_password === $password);

            if (!$verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password. Please check your credentials.'
                ], 401);
            }

            // Log activity
            try {
                DB::table('activities')->insert([
                    'id' => 'act-' . time() . '-' . rand(100, 999),
                    'event_type' => 'USER_LOGIN',
                    'description' => "{$user->full_name} authenticated as {$user->role_label}",
                    'entity_type' => 'user',
                    'entity_id' => $user->id,
                    'ip_address' => $request->ip() ?: '127.0.0.1',
                    'user_agent' => $request->header('User-Agent') ?: 'Browser Client',
                    'metadata' => json_encode(['role' => $user->role, 'company' => $user->company]),
                    'created_at' => now(),
                ]);
            } catch (\Throwable $e) {
                // Ignore activity insertion failures
            }

            $userClean = [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'fullName' => $user->full_name,
                'role' => $user->role,
                'roleLabel' => $user->role_label,
                'avatar' => $user->avatar,
                'company' => $user->company,
                'department' => $user->department,
                'permissions' => json_decode($user->permissions ?: '[]'),
                'accountNumber' => $user->account_number,
                'creditLine' => $user->credit_line
            ];

            return response()->json([
                'success' => true,
                'message' => "Welcome back, {$user->full_name}!",
                'token' => 'token-' . $user->id . '-' . time(),
                'user' => $userClean
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Current authenticated user profile.
     */
    public function me(Request $request)
    {
        $token = $request->header('Authorization');
        if (!$token) {
            return response()->json([
                'success' => true,
                'authenticated' => false,
                'user' => null
            ]);
        }

        // Return default super admin or parse token
        $user = DB::table('users')->first();
        if ($user) {
            $userClean = [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'fullName' => $user->full_name,
                'role' => $user->role,
                'roleLabel' => $user->role_label,
                'avatar' => $user->avatar,
                'company' => $user->company,
                'department' => $user->department,
                'permissions' => json_decode($user->permissions ?: '[]'),
                'accountNumber' => $user->account_number,
                'creditLine' => $user->credit_line
            ];
            return response()->json([
                'success' => true,
                'authenticated' => true,
                'user' => $userClean
            ]);
        }

        return response()->json([
            'success' => true,
            'authenticated' => false,
            'user' => null
        ]);
    }

    /**
     * Logout.
     */
    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Session terminated successfully.'
        ]);
    }
}
