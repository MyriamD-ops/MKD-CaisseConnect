<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'pin' => 'required|string|min:4|max:6',
        ]);

        // Throttle : max 3 tentatives par 5 minutes (par IP)
        $throttleResult = $this->throttleLoginAttempt($request);
        if ($throttleResult) {
            return $throttleResult;
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->pin, $user->pin_hash)) {
            return back()->withErrors([
                'username' => 'Les identifiants fournis sont incorrects.',
            ]);
        }

        // Réinitialiser le compteur d'échecs après une connexion réussie
        RateLimiter::clear('login-attempts:' . $request->ip());

        // Mettre à jour la dernière connexion
        $user->update(['last_login' => now()]);

        // Créer une session
        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Vous êtes déconnecté');
    }

    private function throttleLoginAttempt(Request $request)
    {
        $key = 'login-attempts:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'username' => 'Trop de tentatives. Réessayez dans ' . $seconds . ' secondes.',
            ]);
        }

        RateLimiter::hit($key, 300); // 300 secondes = 5 minutes
        return null;
    }
}
