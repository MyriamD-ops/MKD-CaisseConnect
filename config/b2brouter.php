<?php

return [
    // Clé API B2Brouter (test_ pour sandbox, live_ pour production)
    'api_key'    => env('B2BROUTER_API_KEY'),

    // ID du compte B2Brouter associé à cette instance
    'account_id' => env('B2BROUTER_ACCOUNT_ID'),

    // URL de base (identique pour sandbox et production, déterminée par la clé)
    'base_url'   => env('B2BROUTER_BASE_URL', 'https://api.b2brouter.net'),
];
