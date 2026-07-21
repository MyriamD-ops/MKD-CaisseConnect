<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Renseigne un code-barres pour les produits existants qui n'en ont pas.
     * Sans code_barres, le QR code de la fiche produit encode "null" et le
     * scan en caisse ne peut jamais retrouver le produit correspondant.
     */
    public function up(): void
    {
        DB::table('produits')
            ->whereNull('code_barres')
            ->orderBy('id_produit')
            ->select('id_produit')
            ->get()
            ->each(function ($produit) {
                DB::table('produits')
                    ->where('id_produit', $produit->id_produit)
                    ->update([
                        'code_barres' => 'PRD-' . str_pad($produit->id_produit, 6, '0', STR_PAD_LEFT),
                    ]);
            });
    }

    public function down(): void
    {
        // Non réversible : on ne sait pas quels codes étaient nuls à l'origine.
    }
};
