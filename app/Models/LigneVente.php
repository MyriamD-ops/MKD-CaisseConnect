<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneVente extends Model
{
    protected $table = 'lignes_vente';
    protected $primaryKey = 'id_ligne_vente';

    protected $fillable = [
        'id_vente',
        'id_produit',
        'id_variante',
        'quantite',
        'prix_unitaire',
        'sous_total',
        'remise',
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_unitaire' => 'decimal:2',
        'sous_total' => 'decimal:2',
        'remise' => 'decimal:2',
    ];

    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class, 'id_vente', 'id_vente');
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(Variante::class, 'id_variante', 'id_variante');
    }
}
