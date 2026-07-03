<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // ── Utilisateurs (idempotent : ne recrée pas si déjà présents) ──
        $admin = User::firstOrCreate(
            ['username' => 'demo_admin'],
            [
                'pin_hash'       => Hash::make('1234'),
                'role'           => 'admin',
                'fingerprint_id' => null,
                'last_login'     => null,
            ]
        );

        $caissier = User::firstOrCreate(
            ['username' => 'demo_caisse'],
            [
                'pin_hash'       => Hash::make('5678'),
                'role'           => 'vendeur',
                'fingerprint_id' => null,
                'last_login'     => null,
            ]
        );

        echo "✅ Utilisateurs créés :\n";
        echo "   → demo_admin  / PIN : 1234 (admin)\n";
        echo "   → demo_caisse / PIN : 5678 (vendeur)\n";

        // ── Catalogue : Commerce généraliste (skip si déjà seedé) ──
        if (DB::table('produits')->count() > 0) {
            echo "⏭️  Catalogue et ventes déjà présents, skip.\n";
            return;
        }
        $categories = [
            'Boissons'     => '#3B82F6',
            'Épicerie'     => '#10B981',
            'Hygiène'      => '#8B5CF6',
            'Snacking'     => '#F59E0B',
            'Accessoires'  => '#EF4444',
        ];

        $produits = [
            // Boissons
            ['nom' => 'Eau minérale 1,5L',     'prix' => 0.90,  'stock' => 120, 'tva' => 5.5,  'categorie' => 'Boissons'],
            ['nom' => 'Jus d\'orange 1L',       'prix' => 2.50,  'stock' => 60,  'tva' => 5.5,  'categorie' => 'Boissons'],
            ['nom' => 'Soda cola 33cl',         'prix' => 1.20,  'stock' => 200, 'tva' => 5.5,  'categorie' => 'Boissons'],
            ['nom' => 'Café expresso',          'prix' => 1.50,  'stock' => 500, 'tva' => 10.0, 'categorie' => 'Boissons'],
            // Épicerie
            ['nom' => 'Pain de mie nature',    'prix' => 1.80,  'stock' => 45,  'tva' => 5.5,  'categorie' => 'Épicerie'],
            ['nom' => 'Beurre doux 250g',      'prix' => 2.20,  'stock' => 30,  'tva' => 5.5,  'categorie' => 'Épicerie'],
            ['nom' => 'Confiture fraise 370g', 'prix' => 3.50,  'stock' => 25,  'tva' => 5.5,  'categorie' => 'Épicerie'],
            ['nom' => 'Pâtes 500g',            'prix' => 1.10,  'stock' => 80,  'tva' => 5.5,  'categorie' => 'Épicerie'],
            // Hygiène
            ['nom' => 'Savon mains 300ml',     'prix' => 3.90,  'stock' => 40,  'tva' => 20.0, 'categorie' => 'Hygiène'],
            ['nom' => 'Dentifrice 75ml',       'prix' => 2.80,  'stock' => 35,  'tva' => 20.0, 'categorie' => 'Hygiène'],
            // Snacking
            ['nom' => 'Chips nature 150g',     'prix' => 1.90,  'stock' => 90,  'tva' => 5.5,  'categorie' => 'Snacking'],
            ['nom' => 'Barre chocolatée',      'prix' => 0.80,  'stock' => 150, 'tva' => 5.5,  'categorie' => 'Snacking'],
            ['nom' => 'Cacahuètes grillées',   'prix' => 2.10,  'stock' => 60,  'tva' => 5.5,  'categorie' => 'Snacking'],
            // Accessoires
            ['nom' => 'Stylo bille bleu',      'prix' => 0.50,  'stock' => 200, 'tva' => 20.0, 'categorie' => 'Accessoires'],
            ['nom' => 'Carnet A5',             'prix' => 3.20,  'stock' => 30,  'tva' => 20.0, 'categorie' => 'Accessoires'],
        ];

        $produitIds = [];
        foreach ($produits as $p) {
            $id = DB::table('produits')->insertGetId([
                'nom'          => $p['nom'],
                'prix_base'    => $p['prix'],
                'stock_actuel' => $p['stock'],
                'categorie'    => $p['categorie'],
                'actif'        => true,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
            $produitIds[$p['nom']] = ['id' => $id, 'prix' => $p['prix']];
        }

        echo "✅ " . count($produits) . " produits créés (5 catégories)\n";

        // ── Ventes fictives (7 derniers jours) ────────────────────
        $moyens = ['Espèces', 'Carte bancaire', 'Espèces'];
        $paniers = [
            [['Eau minérale 1,5L' => 2], ['Chips nature 150g' => 1], ['Barre chocolatée' => 3]],
            [['Café expresso' => 2], ['Pain de mie nature' => 1]],
            [['Jus d\'orange 1L' => 1], ['Confiture fraise 370g' => 1], ['Beurre doux 250g' => 1]],
            [['Soda cola 33cl' => 4], ['Cacahuètes grillées' => 2]],
            [['Savon mains 300ml' => 1], ['Dentifrice 75ml' => 1], ['Stylo bille bleu' => 2]],
            [['Pâtes 500g' => 3], ['Eau minérale 1,5L' => 6]],
            [['Carnet A5' => 1], ['Stylo bille bleu' => 3], ['Café expresso' => 1]],
        ];

        foreach ($paniers as $i => $panier) {
            $date    = Carbon::now()->subDays(6 - $i)->setHour(rand(9, 18))->setMinute(rand(0, 59));
            $moyen   = $moyens[$i % count($moyens)];
            $total   = 0;
            $lignes  = [];

            foreach ($panier as $items) {
                foreach ($items as $nom => $qte) {
                    if (!isset($produitIds[$nom])) continue;
                    $pu     = $produitIds[$nom]['prix'];
                    $total += $pu * $qte;
                    $lignes[] = ['nom' => $nom, 'qte' => $qte, 'pu' => $pu];
                }
            }

            $numero   = 'V-' . $date->format('Ymd') . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            $venteId  = DB::table('ventes')->insertGetId([
                'numero_vente'    => $numero,
                'montant_total'   => round($total, 2),
                'moyen_paiement'  => $moyen,
                'statut'          => 'Terminée',
                'id_utilisateur'  => ($i % 2 === 0) ? $admin->id : $caissier->id,
                'date_vente'      => $date,
                'synchronisee'    => true,
                'created_at'      => $date,
                'updated_at'      => $date,
            ]);

            foreach ($lignes as $l) {
                DB::table('lignes_vente')->insert([
                    'id_vente'       => $venteId,
                    'id_produit'     => $produitIds[$l['nom']]['id'],
                    'quantite'       => $l['qte'],
                    'prix_unitaire'  => $l['pu'],
                    'sous_total'     => round($l['pu'] * $l['qte'], 2),
                    'created_at'     => $date,
                    'updated_at'     => $date,
                ]);
            }
        }

        echo "✅ 7 ventes fictives créées (7 derniers jours)\n";
        echo "\n🎯 Démo prête — connectez-vous sur la landing page avec demo_admin / 1234\n";
    }
}
