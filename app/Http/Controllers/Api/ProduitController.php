<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Variante;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with(['variantes', 'imagePrincipale'])
            ->where('actif', true)
            ->get();

        return response()->json($produits);
    }

    public function show($id)
    {
        $produit = Produit::with(['variantes', 'images'])
            ->findOrFail($id);

        return response()->json($produit);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string',
            'prix_base' => 'required|numeric|min:0',
            'code_barres' => 'nullable|string|unique:produits',
            'qr_code' => 'nullable|string|unique:produits',
            'actif' => 'boolean',
        ]);

        $produit = Produit::create($validated);

        // Créer une variante par défaut si aucune n'est fournie
        if ($request->has('variantes') && is_array($request->variantes)) {
            foreach ($request->variantes as $varianteData) {
                $produit->variantes()->create($varianteData);
            }
        } else {
            $produit->variantes()->create([
                'stock_quantite' => $request->stock_initial ?? 0,
                'sku' => $produit->code_barres . '-STD',
            ]);
        }

        return response()->json($produit->load('variantes'), 201);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'string|max:255',
            'description' => 'nullable|string',
            'categorie' => 'nullable|string',
            'prix_base' => 'numeric|min:0',
            'actif' => 'boolean',
        ]);

        $produit->update($validated);

        return response()->json($produit->load('variantes'));
    }

    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();

        return response()->json(['message' => 'Produit supprimé avec succès']);
    }

    // Activer/Désactiver un produit
    public function toggleActif($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->update(['actif' => !$produit->actif]);

        return response()->json($produit);
    }
}
