<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;

class ProduitController extends Controller
{
    public function index(ResponseFactory $inertia)
    {
        $produits = Produit::with('variantes', 'images')
            ->orderBy('created_at', 'desc')
            ->get();

        return $inertia->render('Produits/Index', [
            'produits' => $produits,
        ]);
    }

    public function create(ResponseFactory $inertia)
    {
        return $inertia->render('Produits/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'seuil_alerte' => 'nullable|integer|min:0',
            'categorie' => 'nullable|string|max:100',
        ]);

        Produit::create($validated);

        return redirect()->route('produits.index')
            ->with('success', 'Produit créé avec succès !');
    }

    public function edit(ResponseFactory $inertia, Produit $produit)
    {
        return $inertia->render('Produits/Edit', [
            'produit' => $produit->load('variantes', 'images'),
        ]);
    }

    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'seuil_alerte' => 'nullable|integer|min:0',
            'categorie' => 'nullable|string|max:100',
        ]);

        $produit->update($validated);

        return redirect()->route('produits.index')
            ->with('success', 'Produit modifié avec succès !');
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();

        return redirect()->route('produits.index')
            ->with('success', 'Produit supprimé avec succès !');
    }
}
