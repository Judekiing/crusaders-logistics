<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::all()->map->toFrontendArray();

        return response()->json([
            'success' => true,
            'data' => $branches,
        ]);
    }
}
