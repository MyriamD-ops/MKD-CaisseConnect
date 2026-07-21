<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientPro extends Model
{
    protected $table = 'clients_pro';
    protected $primaryKey = 'id_client';

    protected $fillable = [
        'raison_sociale', 'siret', 'numero_tva',
        'adresse', 'code_postal', 'ville',
        'email', 'telephone', 'notes',
    ];

    public function ventes(): HasMany
    {
        return $this->hasMany(Vente::class, 'id_client_pro', 'id_client');
    }

    public function factures(): HasMany
    {
        return $this->hasMany(Facture::class, 'id_client', 'id_client');
    }

    /**
     * Format SIRET affiché : XXX XXX XXX XXXXX
     */
    public function getSiretFormatAttribute(): string
    {
        return trim(preg_replace('/(\d{3})(\d{3})(\d{3})(\d{5})/', '$1 $2 $3 $4', $this->siret));
    }
}
