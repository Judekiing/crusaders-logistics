<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Fallback and SPA serving routes.
| - office.domain.com directs immediately to the Office Admin Console.
| - /office and /admin shortcuts also direct immediately to the Admin Console.
| - Deep-linking navigation (e.g. /track?trn=TRN12345, /portal) is cleanly resolved.
|
*/

// Subdomain routing for office.* (e.g. office.domain.com, office.localhost)
Route::domain('office.{domain}')->group(function () {
    Route::get('/', [SpaController::class, 'index']);
    Route::fallback([SpaController::class, 'index']);
});

// Direct administrative route shortcuts
Route::get('/office', [SpaController::class, 'index']);
Route::get('/admin', [SpaController::class, 'index']);

// Standard SPA Web Routes
Route::get('/', [SpaController::class, 'index']);
Route::fallback([SpaController::class, 'index']);
