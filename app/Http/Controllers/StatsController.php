<?php

namespace App\Http\Controllers;

use App\Models\Vente;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\ResponseFactory;

class StatsController extends Controller
{
    public function index(Request $request, ResponseFactory $inertia)
    {
        $periode     = $request->input('periode', 'jour');
        $dateChoisie = $request->input('date', today()->toDateString());
        $evenementId = $request->input('evenement_id');

        // Déterminer la plage de dates
        switch ($periode) {
            case 'evenement':
                $ev = Evenement::find($evenementId);
                $debut = $ev ? Carbon::parse($ev->date_debut)->startOfDay() : today()->startOfDay();
                $fin   = $ev ? Carbon::parse($ev->date_fin)->endOfDay()     : today()->endOfDay();
                break;
            case 'mois':
                $debut = today()->startOfMonth();
                $fin   = today()->endOfMonth();
                break;
            default: // jour
                $debut = Carbon::parse($dateChoisie)->startOfDay();
                $fin   = Carbon::parse($dateChoisie)->endOfDay();
                break;
        }

        // Plage précédente (pour tendances)
        $duree     = $debut->diffInSeconds($fin);
        $prevDebut = $debut->copy()->subSeconds($duree);
        $prevFin   = $debut->copy()->subSecond();

        // KPIs période courante
        $ventes    = Vente::whereBetween('date_vente', [$debut, $fin]);
        $ca        = (float) $ventes->sum('montant_total');
        $nbVentes  = (int) $ventes->count();
        $panier    = $nbVentes > 0 ? round($ca / $nbVentes, 2) : 0;

        // KPIs période précédente
        $prevVentes  = Vente::whereBetween('date_vente', [$prevDebut, $prevFin]);
        $prevCa      = (float) $prevVentes->sum('montant_total');
        $prevNb      = (int) $prevVentes->count();
        $prevPanier  = $prevNb > 0 ? round($prevCa / $prevNb, 2) : 0;

        $tendance = fn($cur, $prev) => $prev > 0
            ? round(($cur - $prev) / $prev * 100, 1)
            : ($cur > 0 ? null : 0);

        $kpis = [
            'ca'              => $ca,
            'nbVentes'        => $nbVentes,
            'panierMoyen'     => $panier,
            'tendanceCa'      => $tendance($ca, $prevCa),
            'tendanceVentes'  => $tendance($nbVentes, $prevNb),
            'tendancePanier'  => $tendance($panier, $prevPanier),
        ];

        // Par moyen de paiement
        $parPaiement = Vente::whereBetween('date_vente', [$debut, $fin])
            ->select('moyen_paiement', DB::raw('COUNT(*) as nb'))
            ->groupBy('moyen_paiement')
            ->get()
            ->map(fn($r) => ['moyen' => $r->moyen_paiement ?: 'Non renseigné', 'nb' => $r->nb])
            ->values();

        // Par jour de la semaine
        $joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

        if (config('database.default') === 'sqlite') {
            // SQLite: strftime('%w') retourne 0=Dim..6=Sam
            $parJourRaw = Vente::whereBetween('date_vente', [$debut, $fin])
                ->select(DB::raw("strftime('%w', date_vente) as dow"), DB::raw('SUM(montant_total) as total'))
                ->groupBy('dow')
                ->pluck('total', 'dow');
            $parJour = collect([1, 2, 3, 4, 5, 6, 0])->map(function ($dow, $i) use ($parJourRaw, $joursLabels) {
                return ['jour' => $joursLabels[$i], 'total' => round((float) ($parJourRaw[$dow] ?? 0), 2)];
            });
        } else {
            // MySQL: DAYOFWEEK retourne 1=Dim..7=Sam
            $parJourRaw = Vente::whereBetween('date_vente', [$debut, $fin])
                ->select(DB::raw('DAYOFWEEK(date_vente) as dow'), DB::raw('SUM(montant_total) as total'))
                ->groupBy('dow')
                ->pluck('total', 'dow');
            $parJour = collect([2, 3, 4, 5, 6, 7, 1])->map(function ($dow, $i) use ($parJourRaw, $joursLabels) {
                return ['jour' => $joursLabels[$i], 'total' => round((float) ($parJourRaw[$dow] ?? 0), 2)];
            });
        }

        // Top 5 produits
        $topProduits = DB::table('lignes_vente')
            ->join('ventes', 'lignes_vente.id_vente', '=', 'ventes.id_vente')
            ->join('produits', 'lignes_vente.id_produit', '=', 'produits.id_produit')
            ->whereBetween('ventes.date_vente', [$debut, $fin])
            ->select(
                'produits.nom',
                'produits.categorie',
                DB::raw('SUM(lignes_vente.quantite) as qte_vendue'),
                DB::raw('SUM(lignes_vente.sous_total) as ca_produit')
            )
            ->groupBy('produits.id_produit', 'produits.nom', 'produits.categorie')
            ->orderByDesc('ca_produit')
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'nom'        => $r->nom,
                'categorie'  => $r->categorie,
                'qte_vendue' => (int) $r->qte_vendue,
                'ca_produit' => round((float) $r->ca_produit, 2),
            ]);

        // Ventes par heure (mode jour uniquement)
        $ventesParHeure = [];
        if ($periode === 'jour') {
            $hourExpr = config('database.default') === 'sqlite'
                ? "strftime('%H', date_vente)"
                : 'HOUR(date_vente)';
            $raw = Vente::whereBetween('date_vente', [$debut, $fin])
                ->select(DB::raw("$hourExpr as h"), DB::raw('SUM(montant_total) as total'))
                ->groupBy('h')
                ->pluck('total', 'h');
            for ($h = 7; $h <= 20; $h++) {
                $key = config('database.default') === 'sqlite' ? str_pad($h, 2, '0', STR_PAD_LEFT) : $h;
                $ventesParHeure[] = [
                    'heure' => str_pad($h, 2, '0', STR_PAD_LEFT) . 'h',
                    'total' => round((float) ($raw[$key] ?? 0), 2),
                ];
            }
        }

        // Événements disponibles
        $evenements = Evenement::orderByDesc('date_debut')
            ->get(['id_evenement', 'nom', 'date_debut', 'date_fin'])
            ->map(fn($e) => [
                'id_evenement' => $e->id_evenement,
                'nom'          => $e->nom,
                'date_debut'   => Carbon::parse($e->date_debut)->format('d/m/Y'),
                'date_fin'     => Carbon::parse($e->date_fin)->format('d/m/Y'),
            ]);

        return $inertia->render('Stats/Index', [
            'periode'        => $periode,
            'evenementId'    => $evenementId,
            'dateChoisie'    => $dateChoisie,
            'evenements'     => $evenements,
            'kpis'           => $kpis,
            'parPaiement'    => $parPaiement,
            'parJour'        => $parJour,
            'topProduits'    => $topProduits,
            'ventesParHeure' => $ventesParHeure,
            'debut'          => $debut->format('d/m/Y'),
            'fin'            => $fin->format('d/m/Y'),
        ]);
    }
}
