<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = Driver::all()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'data' => $drivers,
        ]);
    }
}
