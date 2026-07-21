<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Facture extends Model
{
    protected $table = 'factures';
    protected $primaryKey = 'id_facture';

    protected $fillable = [
        'numero_facture', 'id_vente', 'id_client',
        'montant_ht', 'montant_tva', 'montant_ttc',
        'date_emission', 'date_echeance', 'statut',
        'format', 'pdf_path', 'stripe_payment_intent',
        'transmitted_at',
    ];

    protected $casts = [
        'date_emission'  => 'date',
        'date_echeance'  => 'date',
        'transmitted_at' => 'datetime',
        'montant_ht'     => 'decimal:2',
        'montant_tva'    => 'decimal:2',
        'montant_ttc'    => 'decimal:2',
    ];

    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class, 'id_vente', 'id_vente');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(ClientPro::class, 'id_client', 'id_client');
    }

    /**
     * Génère le prochain numéro de facture : FAC-2026-0001
     */
    public static function generateNumero(): string
    {
        $year = date('Y');
        $last = static::where('numero_facture', 'like', "FAC-{$year}-%")
            ->orderByDesc('numero_facture')
            ->first();

        $next = $last
            ? ((int) substr($last->numero_facture, -4)) + 1
            : 1;

        return "FAC-{$year}-" . str_pad($next, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Couleur du badge statut pour le frontend.
     */
    public function getStatutColorAttribute(): string
    {
        return match ($this->statut) {
            'Brouillon'     => 'slate',
            'Émise'         => 'blue',
            'Transmise PA'  => 'amber',
            'Acceptée'      => 'emerald',
            'Rejetée'       => 'red',
            default         => 'slate',
        };
    }
}
