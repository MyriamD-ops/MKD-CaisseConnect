<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Vente;
use App\Models\ClientPro;
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
     * Générer une facture à partir d'une vente B2B.
     */
    public function generate(Request $request, Vente $vente)
    {
        // Vérifier que la vente est B2B avec un client pro
        if (!$vente->id_client_pro) {
            return back()->withErrors(['error' => 'Cette vente n\'a pas de client professionnel associé.']);
        }

        // Vérifier qu'une facture n'existe pas déjà pour cette vente
        if (Facture::where('id_vente', $vente->id_vente)->exists()) {
            return back()->withErrors(['error' => 'Une facture existe déjà pour cette vente.']);
        }

        $vente->load(['lignes.produit', 'clientPro']);

        // Calcul TVA (simplification : taux unique 20%)
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

        return redirect()->route('factures.show', $facture)
            ->with('success', "Facture {$facture->numero_facture} générée avec succès.");
    }

    /**
     * Simuler la transmission à une Plateforme Agréée.
     */
    public function transmit(Facture $facture)
    {
        if ($facture->statut !== 'Émise') {
            return back()->withErrors(['error' => 'Seule une facture émise peut être transmise.']);
        }

        // Simulation : on passe directement en "Transmise PA"
        $facture->update([
            'statut'         => 'Transmise PA',
            'transmitted_at' => now(),
        ]);

        return back()->with('success', "Facture {$facture->numero_facture} transmise à la Plateforme Agréée (simulation).");
    }

    /**
     * Télécharger le PDF de la facture.
     */
    public function pdf(Facture $facture)
    {
        $facture->load(['client', 'vente.lignes.produit']);

        $pdf = Pdf::loadView('pdf.facture', [
            'facture'  => $facture,
            'business' => config('business'),
        ]);

        return $pdf->download("facture-{$facture->numero_facture}.pdf");
    }
}
