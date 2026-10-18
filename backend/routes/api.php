<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\RateController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Crusaders Logistics API Routes
|--------------------------------------------------------------------------
|
| All endpoints consumed by the React single-page frontend application,
| the executive Office Console (office.domain.com), and customer portal.
|
*/

// Authentication & Role Management
Route::get('/auth/users', [AuthController::class, 'users']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// Health & System status
Route::get('/health', [HealthController::class, 'index']);

// Shipments & Waybill Telemetry
Route::get('/shipments', [ShipmentController::class, 'index']);
Route::get('/shipments/{trackingNumber}', [ShipmentController::class, 'show']);
Route::post('/shipments', [ShipmentController::class, 'store']);
Route::post('/shipments/{trackingNumber}/status', [ShipmentController::class, 'updateStatus']);
Route::delete('/shipments/{trackingNumber}', [ShipmentController::class, 'destroy']);

// Freight Rate Calculator
Route::post('/rates/calculate', [RateController::class, 'calculate']);

// Formal Quotations
Route::get('/quotes', [QuoteController::class, 'index']);
Route::post('/quotes', [QuoteController::class, 'store']);

// Notification Outbox & Verification
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications/test-email', [NotificationController::class, 'sendTestEmail']);

// Fleet & Regional Infrastructure
Route::get('/drivers', [DriverController::class, 'index']);
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/stats', [StatsController::class, 'index']);

// User Activity Audit Log (Track all users & visitor actions)
Route::get('/activities', [ActivityController::class, 'index']);
Route::post('/activities', [ActivityController::class, 'store']);
Route::match(['post', 'delete'], '/activities/clear', [ActivityController::class, 'clear']);

