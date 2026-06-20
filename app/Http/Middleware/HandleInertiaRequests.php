<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HandleInertiaRequests
{
    public function handle(Request $request, $next)
    {
        Inertia::share([
            'auth' => function () use ($request) {
                return [
                    'user' => $request->user() ? [
                        'id' => $request->user()->id,
                        'username' => $request->user()->username,
                        'role' => $request->user()->role,
                    ] : null,
                ];
            },
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
            'errors' => function () use ($request) {
                return $request->session()->get('errors')
                    ? $request->session()->get('errors')->getBag('default')->getMessages()
                    : (object) [];
            },
        ]);

        return $next($request);
    }
}
