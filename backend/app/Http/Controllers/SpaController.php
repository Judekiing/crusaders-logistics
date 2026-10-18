<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpaController extends Controller
{
    /**
     * Deliver the Single Page Application (SPA) entry point
     */
    public function index()
    {
        $potentialHtmlPaths = [
            public_path('index.html'),
            base_path('../public/index.html'),
            base_path('public/index.html'),
            dirname(base_path()) . '/public_html/index.html',
            dirname(base_path()) . '/public/index.html',
        ];

        foreach ($potentialHtmlPaths as $path) {
            if (file_exists($path)) {
                return response()->file($path);
            }
        }

        return response()->view('spa');
    }
}
