<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vente extends Model
{
    protected $table = 'ventes';
    protected $primaryKey = 'id_vente';

    protected $fillable = [
        'numero_vente',
        'id_utilisateur',
        'id_evenement',
        'montant_total',
        'mode_paiement',
        'moyen_paiement',
        'statut',
        'date_vente',
        'synchronisee',
        'notes',
    ];
    
    public function getRouteKeyName()
    {
        return 'id_vente';
    }
    
    // Alias pour lignes() au lieu de lignesVente()
    public function lignes()
    {
        return $this->hasMany(LigneVente::class, 'id_vente', 'id_vente');
    }

    protected $casts = [
        'montant_total' => 'decimal:2',
        'synchronisee' => 'boolean',
        'date_vente' => 'datetime',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    public function evenement(): BelongsTo
    {
        return $this->belongsTo(Evenement::class, 'id_evenement', 'id_evenement');
    }

    public function lignesVente(): HasMany
    {
        return $this->hasMany(LigneVente::class, 'id_vente', 'id_vente');
    }

    // Génération automatique du numéro de vente
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vente) {
            if (!$vente->numero_vente) {
                $vente->numero_vente = 'V-' . date('Ymd') . '-' . str_pad(
                    static::whereDate('created_at', today())->count() + 1,
                    4,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }
}
