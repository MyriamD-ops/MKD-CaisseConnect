<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Vente;
use App\Services\B2BRouterService;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;
use Barryvdh\DomPDF\Facade\Pdf;

class FactureController extends Controller
{
    public function index(ResponseFactory $inertia)
    {
        $factures = Facture::with(['client', 'vente'])
            ->latest('date_emission')
            ->paginate(20);

        return $inertia->render('Factures/Index', [
            'factures' => $factures,
        ]);
    }

    public function show(ResponseFactory $inertia, Facture $facture)
    {
        $facture->load(['client', 'vente.lignes.produit']);

        return $inertia->render('Factures/Show', [
            'facture' => $facture,
        ]);
    }

    /**
     * Générer une facture et l'envoyer à B2Brouter.
     */
    public function generate(Request $request, Vente $vente)
    {
        if (!$vente->id_client_pro) {
            return back()->withErrors(['error' => 'Cette vente n\'a pas de client professionnel associé.']);
        }

        if (Facture::where('id_vente', $vente->id_vente)->exists()) {
            return back()->withErrors(['error' => 'Une facture existe déjà pour cette vente.']);
        }

        $vente->load(['lignes.produit', 'clientPro']);

        $montantTTC = (float) $vente->montant_total;
        $montantHT  = round($montantTTC / 1.20, 2);
        $montantTVA = round($montantTTC - $montantHT, 2);

        $facture = Facture::create([
            'numero_facture' => Facture::generateNumero(),
            'id_vente'       => $vente->id_vente,
            'id_client'      => $vente->id_client_pro,
            'montant_ht'     => $montantHT,
            'montant_tva'    => $montantTVA,
            'montant_ttc'    => $montantTTC,
            'date_emission'  => now(),
            'date_echeance'  => now()->addDays(30),
            'statut'         => 'Émise',
            'format'         => 'Factur-X',
        ]);

        // Envoi à B2Brouter si configuré
        if (config('b2brouter.api_key')) {
            try {
                $b2b = new B2BRouterService();
                $result = $b2b->sendInvoice($facture);

                $b2bId = $result['id'] ?? $result['invoice']['id'] ?? null;

                $facture->update([
                    'b2brouter_id'     => $b2bId,
                    'b2brouter_status' => 'created',
                ]);

                logger()->info('Facture envoyée à B2Brouter', [
                    'facture'      => $facture->numero_facture,
                    'b2brouter_id' => $b2bId,
                ]);
            } catch (\Exception $e) {
                logger()->warning('Erreur B2Brouter — facture créée localement', [
                    'facture' => $facture->numero_facture,
                    'error'   => $e->getMessage(),
                ]);
                // La facture est créée localement même si B2Brouter échoue
            }
        }

        return redirect()->route('factures.show', $facture)
            ->with('success', "Facture {$facture->numero_facture} générée" . ($facture->b2brouter_id ? ' et envoyée à la Plateforme Agréée.' : '.'));
    }

    /**
     * Transmettre une facture via B2Brouter.
     */
    public function transmit(Facture $facture)
    {
        if ($facture->statut !== 'Émise') {
            return back()->withErrors(['error' => 'Seule une facture émise peut être transmise.']);
        }

        // Si B2Brouter est configuré et la facture a un ID B2Brouter
        if (config('b2brouter.api_key') && $facture->b2brouter_id) {
            try {
                $b2b = new B2BRouterService();
                $result = $b2b->transmitInvoice($facture->b2brouter_id);

                $facture->update([
                    'statut'           => 'Transmise PA',
                    'transmitted_at'   => now(),
                    'b2brouter_status' => $result['state'] ?? 'sent',
                ]);

                return back()->with('success', "Facture {$facture->numero_facture} transmise via B2Brouter (Plateforme Agréée).");
            } catch (\Exception $e) {
                logger()->error('Erreur transmission B2Brouter', [
                    'facture' => $facture->numero_facture,
                    'error'   => $e->getMessage(),
                ]);
                return back()->withErrors(['error' => 'Erreur lors de la transmission : ' . $e->getMessage()]);
            }
        }

        // Fallback simulation si B2Brouter non configuré
        $facture->update([
            'statut'         => 'Transmise PA',
            'transmitted_at' => now(),
        ]);

        return back()->with('success', "Facture {$facture->numero_facture} transmise à la Plateforme Agréée (simulation).");
    }

    /**
     * Télécharger le PDF (depuis B2Brouter si disponible, sinon DomPDF local).
     */
    public function pdf(Facture $facture)
    {
        // Si la facture est chez B2Brouter, télécharger leur version Factur-X
        if (config('b2brouter.api_key') && $facture->b2brouter_id) {
            try {
                $b2b = new B2BRouterService();
                $pdfContent = $b2b->downloadPdf($facture->b2brouter_id);

                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', "attachment; filename=facture-{$facture->numero_facture}.pdf");
            } catch (\Exception $e) {
                logger()->warning('Fallback PDF local — B2Brouter indisponible', ['error' => $e->getMessage()]);
            }
        }

        // Fallback : PDF local via DomPDF
        $facture->load(['client', 'vente.lignes.produit']);

        $pdf = Pdf::loadView('pdf.facture', [
            'facture'  => $facture,
            'business' => config('business'),
        ]);

        return $pdf->download("facture-{$facture->numero_facture}.pdf");
    }

    /**
     * Webhook B2Brouter — mise à jour des statuts.
     */
    public function b2brouterWebhook(Request $request)
    {
        $payload = $request->all();
        $b2bId   = $payload['invoice_id'] ?? $payload['id'] ?? null;

        if (!$b2bId) {
            return response('Missing invoice ID', 400);
        }

        $facture = Facture::where('b2brouter_id', $b2bId)->first();
        if (!$facture) {
            return response('Invoice not found', 404);
        }

        $newStatus = $payload['state'] ?? $payload['status'] ?? null;

        // Mapper les statuts B2Brouter vers nos statuts internes
        $statusMap = [
            'accepted'  => 'Acceptée',
            'rejected'  => 'Rejetée',
            'delivered' => 'Transmise PA',
            'sent'      => 'Transmise PA',
            'created'   => 'Émise',
        ];

        if ($newStatus && isset($statusMap[$newStatus])) {
            $facture->update([
                'statut'           => $statusMap[$newStatus],
                'b2brouter_status' => $newStatus,
            ]);

            logger()->info('Statut facture mis à jour via webhook B2Brouter', [
                'facture'    => $facture->numero_facture,
                'new_status' => $newStatus,
            ]);
        }

        return response('OK', 200);
    }
}
