<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur admin de test
        User::create([
            'username' => 'sophie',
            'pin_hash' => Hash::make('1234'),
            'role' => 'admin',
            'fingerprint_id' => null,
            'last_login' => null,
        ]);

        echo "✅ Utilisateur créé : sophie / PIN: 1234\n";
    }
}
