<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;
use Illuminate\Support\Str;

class EvenementController extends Controller
{
    // Liste des événements (Admin)
    public function index(ResponseFactory $inertia)
    {
        $evenements = Evenement::withCount('produits')
            ->orderBy('date_debut', 'desc')
            ->get();

        return $inertia->render('Events/Index', [
            'evenements' => $evenements
        ]);
    }

    // Formulaire création
    public function create(ResponseFactory $inertia)
    {
        $produits = Produit::where('actif', true)
            ->where('stock_actuel', '>', 0)
            ->orderBy('nom')
            ->get(['id_produit', 'nom', 'prix_base', 'stock_actuel', 'categorie']);

        return $inertia->render('Events/Create', [
            'produits' => $produits
        ]);
    }

    // Enregistrement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'lieu' => 'nullable|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'produits' => 'nullable|array',
            'produits.*.id' => 'required|exists:produits,id_produit',
            'produits.*.stock' => 'required|integer|min:0',
        ]);

        // Créer l'événement (code_unique généré automatiquement)
        $evenement = Evenement::create([
            'nom' => $validated['nom'],
            'lieu' => $validated['lieu'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'description' => $validated['description'],
            'statut' => 'planifie',
        ]);

        // Associer les produits avec leur stock
        if (!empty($validated['produits'])) {
            foreach ($validated['produits'] as $produit) {
                $evenement->produits()->attach($produit['id'], [
                    'stock_evenement' => $produit['stock']
                ]);
            }
        }

        return redirect()->route('events.index')
            ->with('success', 'Événement créé avec succès !');
    }

    // Formulaire édition
    public function edit(ResponseFactory $inertia, Evenement $evenement)
    {
        $evenement->load('produits');
        
        $tousProduits = Produit::where('actif', true)
            ->orderBy('nom')
            ->get(['id_produit', 'nom', 'prix_base', 'stock_actuel', 'categorie']);

        return $inertia->render('Events/Edit', [
            'evenement' => $evenement,
            'produits' => $tousProduits
        ]);
    }

    // Mise à jour
    public function update(Request $request, Evenement $evenement)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'lieu' => 'nullable|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'statut' => 'required|in:planifie,en_cours,termine',
            'produits' => 'nullable|array',
            'produits.*.id' => 'required|exists:produits,id_produit',
            'produits.*.stock' => 'required|integer|min:0',
        ]);

        $evenement->update([
            'nom' => $validated['nom'],
            'lieu' => $validated['lieu'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'description' => $validated['description'],
            'statut' => $validated['statut'],
        ]);

        // Synchroniser les produits
        $produitsSync = [];
        if (!empty($validated['produits'])) {
            foreach ($validated['produits'] as $produit) {
                $produitsSync[$produit['id']] = ['stock_evenement' => $produit['stock']];
            }
        }
        $evenement->produits()->sync($produitsSync);

        return redirect()->route('events.index')
            ->with('success', 'Événement modifié avec succès !');
    }

    // Suppression
    public function destroy(Evenement $evenement)
    {
        $evenement->delete();

        return redirect()->route('events.index')
            ->with('success', 'Événement supprimé avec succès !');
    }

    // Page publique - Catalogue client
    public function show(string $code)
    {
        $evenement = Evenement::where('code_unique', $code)
            ->with(['produits' => function($query) {
                $query->where('actif', true);
            }])
            ->firstOrFail();

        return inertia('Events/Public', [
            'evenement' => [
                'nom' => $evenement->nom,
                'lieu' => $evenement->lieu,
                'date_debut' => $evenement->date_debut->format('d/m/Y'),
                'date_fin' => $evenement->date_fin->format('d/m/Y'),
                'description' => $evenement->description,
                'statut' => $evenement->statut,
                'produits' => $evenement->produits->map(function($produit) {
                    return [
                        'id' => $produit->id_produit,
                        'nom' => $produit->nom,
                        'description' => $produit->description,
                        'prix' => $produit->prix_base,
                        'categorie' => $produit->categorie,
                        'matiere' => $produit->matiere,
                        'stock_evenement' => $produit->pivot->stock_evenement,
                        'disponible' => $produit->pivot->stock_evenement > 0,
                    ];
                })
            ]
        ]);
    }

    // Fiche produit (Admin)
    public function showAdmin(ResponseFactory $inertia, Evenement $evenement)
    {
        $evenement->load('produits');

        return $inertia->render('Events/Show', [
            'evenement' => $evenement
        ]);
    }
}
