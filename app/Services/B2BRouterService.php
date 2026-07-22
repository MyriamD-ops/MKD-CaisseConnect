<?php

namespace App\Services;

use B2Brouter\B2BRouterClient;
use App\Models\Facture;
use App\Models\ClientPro;

class B2BRouterService
{
    protected B2BRouterClient $client;
    protected string $accountId;

    public function __construct()
    {
        $this->client = new B2BRouterClient(config('b2brouter.api_key'));
        $this->accountId = config('b2brouter.account_id');
    }

    /**
     * Créer ou retrouver un contact B2Brouter pour un client pro.
     */
    public function findOrCreateContact(ClientPro $clientPro): array
    {
        // Chercher le contact par SIRET/tax_id
        $contacts = $this->client->contacts->list($this->accountId, [
            'tax_id' => $clientPro->siret,
        ]);

        if (!empty($contacts['contacts'])) {
            return $contacts['contacts'][0];
        }

        // Créer le contact
        return $this->client->contacts->create($this->accountId, [
            'contact' => [
                'name'       => $clientPro->raison_sociale,
                'tax_id'     => $clientPro->siret,
                'vat_number' => $clientPro->numero_tva,
                'address'    => $clientPro->adresse,
                'zip'        => $clientPro->code_postal,
                'city'       => $clientPro->ville,
                'country'    => 'FR',
                'email'      => $clientPro->email,
                'phone'      => $clientPro->telephone,
            ],
        ]);
    }

    /**
     * Envoyer une facture à B2Brouter.
     * Retourne les données de la facture créée (incluant son ID B2Brouter).
     */
    public function sendInvoice(Facture $facture): array
    {
        $facture->load(['client', 'vente.lignes.produit']);

        // Trouver ou créer le contact chez B2Brouter
        $contact = $this->findOrCreateContact($facture->client);
        $contactId = $contact['id'] ?? $contact['contact']['id'] ?? null;

        // Construire les lignes de facture
        $lines = [];
        foreach ($facture->vente->lignes as $ligne) {
            $puTTC = (float) $ligne->prix_unitaire;
            $puHT  = round($puTTC / 1.20, 2);

            $lines[] = [
                'description' => $ligne->produit->nom ?? 'Produit',
                'quantity'    => (string) $ligne->quantite,
                'price'       => (string) $puHT,
                'taxes_attributes' => [
                    [
                        'name'     => 'TVA',
                        'category' => 'S',
                        'percent'  => '20',
                    ],
                ],
            ];
        }

        // Créer la facture sur B2Brouter
        $result = $this->client->invoices->create($this->accountId, [
            'invoice' => [
                'contact_id'              => $contactId,
                'number'                  => $facture->numero_facture,
                'issue_date'              => $facture->date_emission->format('Y-m-d'),
                'due_date'                => $facture->date_echeance->format('Y-m-d'),
                'currency'                => 'EUR',
                'invoice_lines_attributes' => $lines,
            ],
        ]);

        return $result;
    }

    /**
     * Envoyer (transmettre) une facture déjà créée chez B2Brouter.
     */
    public function transmitInvoice(string $b2brouterInvoiceId): array
    {
        return $this->client->invoices->send($this->accountId, $b2brouterInvoiceId);
    }

    /**
     * Récupérer le statut d'une facture chez B2Brouter.
     */
    public function getInvoiceStatus(string $b2brouterInvoiceId): array
    {
        return $this->client->invoices->get($this->accountId, $b2brouterInvoiceId);
    }

    /**
     * Télécharger la facture au format Factur-X depuis B2Brouter.
     */
    public function downloadPdf(string $b2brouterInvoiceId): string
    {
        return $this->client->invoices->download($this->accountId, $b2brouterInvoiceId, 'pdf');
    }
}
