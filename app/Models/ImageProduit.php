<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImageProduit extends Model
{
    protected $table = 'images_produit';
    protected $primaryKey = 'id_image';

    protected $fillable = [
        'id_produit',
        'url_image',
        'est_principale',
        'ordre_affichage',
    ];

    protected $casts = [
        'est_principale' => 'boolean',
        'ordre_affichage' => 'integer',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'id_produit', 'id_produit');
    }
}
