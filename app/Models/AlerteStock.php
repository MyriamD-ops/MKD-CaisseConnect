<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlerteStock extends Model
{
    protected $table = 'alertes_stock';
    protected $primaryKey = 'id_alerte';

    protected $fillable = [
        'id_produit',
        'id_variante',
        'stock_actuel',
        'seuil',
        'statut',
        'resolved_at',
    ];

    protected $casts = [
        'stock_actuel' => 'integer',
        'seuil' => 'integer',
        'resolved_at' => 'datetime',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(Variante::class, 'id_variante', 'id_variante');
    }
}
