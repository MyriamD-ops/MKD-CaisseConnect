<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $table = 'produits';
    protected $primaryKey = 'id_produit';
    
    // Pour que les routes /products/{product} utilisent id_produit
    public function getRouteKeyName()
    {
        return 'id_produit';
    }

    protected $fillable = [
        'nom',
        'description',
        'categorie',
        'matiere',
        'prix_base',
        'stock_actuel',
        'stock_minimum',
        'code_barres',
        'qr_code',
        'actif',
    ];

    protected $casts = [
        'prix_base' => 'decimal:2',
        'stock_actuel' => 'integer',
        'stock_minimum' => 'integer',
        'actif' => 'boolean',
    ];

    public function variantes(): HasMany
    {
        return $this->hasMany(Variante::class, 'id_produit', 'id_produit');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ImageProduit::class, 'id_produit', 'id_produit');
    }

    public function mouvementsStock(): HasMany
    {
        return $this->hasMany(MouvementStock::class, 'id_produit', 'id_produit');
    }

    public function alertesStock(): HasMany
    {
        return $this->hasMany(AlerteStock::class, 'id_produit', 'id_produit');
    }

    public function evenements()
    {
        return $this->belongsToMany(
            Evenement::class,
            'evenement_produit',
            'produit_id',
            'evenement_id'
        )
        ->withPivot('stock_evenement')
        ->withTimestamps();
    }
}
