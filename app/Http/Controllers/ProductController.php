<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;

class ProductController extends Controller
{
    /**
     * API - Retourne tous les produits en JSON pour IndexedDB
     */
    public function apiIndex()
    {
        $products = Produit::select(
            'id_produit',
            'nom',
            'description',
            'prix_base',
            'stock_actuel',
            'stock_minimum',
            'categorie',
            'matiere',
            'code_barres',
            'actif'
        )
        ->where('actif', true)
        ->get();

        return response()->json($products);
    }

    public function index(ResponseFactory $inertia)
    {
        $products = Produit::with('variantes', 'images')
            ->latest()
            ->get();

        return $inertia->render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create(ResponseFactory $inertia)
    {
        return $inertia->render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock_actuel' => 'required|integer|min:0',
            'stock_minimum' => 'required|integer|min:0',
            'categorie' => 'required|string|max:100',
            'matiere' => 'nullable|string|max:100',
        ]);

        $validated['prix_base'] = $validated['prix'];
        unset($validated['prix']);
        $validated['code_barres'] = 'PRD-' . strtoupper(uniqid());
        $validated['actif'] = true;

        Produit::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Produit créé avec succès !');
    }

    public function edit(ResponseFactory $inertia, Produit $product)
    {
        return $inertia->render('Products/Edit', [
            'product' => [
                'id_produit' => $product->id_produit,
                'nom' => $product->nom,
                'description' => $product->description,
                'prix_base' => $product->prix_base,
                'stock_actuel' => $product->stock_actuel,
                'stock_minimum' => $product->stock_minimum,
                'categorie' => $product->categorie,
                'matiere' => $product->matiere,
            ]
        ]);
    }

    public function update(Request $request, Produit $product)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'stock_actuel' => 'required|integer|min:0',
            'stock_minimum' => 'required|integer|min:0',
            'categorie' => 'required|string|max:100',
            'matiere' => 'nullable|string|max:100',
        ]);

        $validated['prix_base'] = $validated['prix'];
        unset($validated['prix']);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Produit modifié avec succès !');
    }

    public function destroy(Produit $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produit supprimé avec succès !');
    }

    public function show(ResponseFactory $inertia, Produit $product)
    {
        return $inertia->render('Products/Show', [
            'product' => [
                'id_produit' => $product->id_produit,
                'nom' => $product->nom,
                'description' => $product->description,
                'prix_base' => $product->prix_base,
                'stock_actuel' => $product->stock_actuel,
                'stock_minimum' => $product->stock_minimum,
                'categorie' => $product->categorie,
                'matiere' => $product->matiere,
                'code_barres' => $product->code_barres,
            ]
        ]);
    }
    
    public function lowStock(ResponseFactory $inertia)
    {
        $products = Produit::whereColumn('stock_actuel', '<=', 'stock_minimum')
            ->orderBy('stock_actuel', 'asc')
            ->get();

        return $inertia->render('Products/LowStock', [
            'products' => $products
        ]);
    }

    public function export()
    {
        $produits = Produit::orderBy('nom')->get();

        $csv = "\xEF\xBB\xBF"; // BOM UTF-8 pour Excel
        $csv .= "Nom;Catégorie;Matière;Prix (€);Stock actuel;Stock minimum;Code-barres;Actif\n";

        foreach ($produits as $p) {
            $csv .= implode(';', [
                '"' . str_replace('"', '""', $p->nom) . '"',
                '"' . str_replace('"', '""', $p->categorie ?? '') . '"',
                '"' . str_replace('"', '""', $p->matiere ?? '') . '"',
                number_format((float) $p->prix_base, 2, ',', ''),
                $p->stock_actuel,
                $p->stock_minimum,
                $p->code_barres ?? '',
                $p->actif ? 'Oui' : 'Non',
            ]) . "\n";
        }

        $filename = 'produits_' . now()->format('Y-m-d') . '.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
}
