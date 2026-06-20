<?php

// Identité commerciale de l'instance : ces valeurs sont propres à chaque
// client (une instance Laravel Cloud = un commerce), définies via les
// variables d'environnement de l'instance plutôt que codées en dur.
return [
    'name' => env('BUSINESS_NAME', 'Mon Commerce'),
    'tagline' => env('BUSINESS_TAGLINE', ''),
    'social' => env('BUSINESS_SOCIAL', ''),
    'phone' => env('BUSINESS_PHONE', ''),
    'receipt_footer' => env('BUSINESS_RECEIPT_FOOTER', 'Merci de votre achat !'),
];
