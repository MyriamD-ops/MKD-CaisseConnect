<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Evenement extends Model
{
    protected $table = 'evenements';
    protected $primaryKey = 'id_evenement';
    
    // Pour que les routes utilisent id_evenement
    public function getRouteKeyName()
    {
        return 'id_evenement';
    }
    
    protected $fillable = [
        'nom',
        'lieu',
        'date_debut',
        'date_fin',
        'code_unique',
        'description',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // Générer un code unique automatiquement
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($evenement) {
            if (empty($evenement->code_unique)) {
                $evenement->code_unique = strtoupper(Str::random(8));
            }
        });
    }

    // Relations
    public function produits()
    {
        return $this->belongsToMany(
            Produit::class,
            'evenement_produit',
            'evenement_id',
            'produit_id'
        )
        ->withPivot('stock_evenement')
        ->withTimestamps();
    }

    public function ventes()
    {
        return $this->hasMany(Vente::class, 'evenement_id', 'id_evenement');
    }

    // Helpers
    public function estActif()
    {
        return $this->statut === 'en_cours';
    }

    public function estTermine()
    {
        return $this->statut === 'termine';
    }
}
