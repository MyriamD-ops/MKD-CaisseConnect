<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    protected $table = 'mouvements_stock';
    protected $primaryKey = 'id_mouvement';

    protected $fillable = [
        'id_produit',
        'id_variante',
        'type_mouvement',
        'variation_quantite',
        'stock_avant',
        'stock_apres',
        'reference',
        'id_utilisateur',
        'date_mouvement',
        'notes',
    ];

    protected $casts = [
        'variation_quantite' => 'integer',
        'stock_avant' => 'integer',
        'stock_apres' => 'integer',
        'date_mouvement' => 'datetime',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(Variante::class, 'id_variante', 'id_variante');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'id');
    }
}
