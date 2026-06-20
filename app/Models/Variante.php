<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Variante extends Model
{
    protected $table = 'variantes';
    protected $primaryKey = 'id_variante';

    protected $fillable = [
        'id_produit',
        'taille',
        'couleur',
        'matiere',
        'stock_quantite',
        'ajustement_prix',
        'sku',
    ];

    protected $casts = [
        'stock_quantite' => 'integer',
        'ajustement_prix' => 'decimal:2',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }

    public function mouvementsStock(): HasMany
    {
        return $this->hasMany(MouvementStock::class, 'id_variante', 'id_variante');
    }

    public function alertesStock(): HasMany
    {
        return $this->hasMany(AlerteStock::class, 'id_variante', 'id_variante');
    }

    // Calcul du prix final avec ajustement
    public function getPrixFinalAttribute()
    {
        return $this->produit->prix_base + $this->ajustement_prix;
    }
}
