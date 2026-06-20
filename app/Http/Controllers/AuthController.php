<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'pin' => 'required|string|min:4|max:6',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->pin, $user->pin_hash)) {
            return back()->withErrors([
                'username' => 'Les identifiants fournis sont incorrects.',
            ]);
        }

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
}
