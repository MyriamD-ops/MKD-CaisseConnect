<?php

use Illuminate\Support\Facades\Route;
use Inertia\ResponseFactory;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\StatsController;

// Preview Design System (accessible sans auth)
Route::get('/ui', function (ResponseFactory $inertia) {
    return $inertia->render('UIPreview');
})->name('ui.preview');


// Page de login
Route::get('/login', function (ResponseFactory $inertia) {
    return $inertia->render('Login');
})->name('login')->middleware('guest');

// Traitement du login
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');

// Routes protégées
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/', function (ResponseFactory $inertia) {
        return $inertia->render('Dashboard', [
            'stats' => [
                'totalProduits' => \App\Models\Produit::where('actif', true)->count(),
                'stockBas'      => \App\Models\Produit::whereColumn('stock_actuel', '<=', 'stock_minimum')->count(),
                'ventesJour'    => \App\Models\Vente::whereDate('date_vente', today())->count(),
                'montantJour'   => (float) \App\Models\Vente::whereDate('date_vente', today())->sum('montant_total'),
            ]
        ]);
    })->name('dashboard');
    
    // API pour mode hors ligne
    Route::prefix('api')->group(function () {
        Route::get('/products', [ProductController::class, 'apiIndex'])->name('api.products');
        Route::get('/events', [EvenementController::class, 'apiIndex'])->name('api.events');
    });
    
    // Produits
    Route::get('/products/low-stock', [ProductController::class, 'lowStock'])->name('products.lowStock');
    Route::get('/products/export', [ProductController::class, 'export'])->name('products.export');
    Route::resource('products', ProductController::class);
    
    // Ventes
    Route::get('/sales/export', [SaleController::class, 'export'])->name('sales.export');
    Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::post('/sales/{sale}/sms', [SaleController::class, 'sendSmsReceipt'])->name('sales.sms');
    
    // Statistiques
    Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');
    
    // Événements (Admin) - AVANT la route publique
    Route::get('/events', [EvenementController::class, 'index'])->name('events.index');
    Route::get('/events/create', [EvenementController::class, 'create'])->name('events.create');
    Route::post('/events', [EvenementController::class, 'store'])->name('events.store');
    Route::get('/events/{evenement}/edit', [EvenementController::class, 'edit'])->name('events.edit');
    Route::post('/events/{evenement}/update', [EvenementController::class, 'update'])->name('events.update');
    Route::post('/events/{evenement}/delete', [EvenementController::class, 'destroy'])->name('events.destroy');
    Route::get('/events/{evenement}/admin', [EvenementController::class, 'showAdmin'])->name('events.showAdmin');
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Page publique - Catalogue client événement (APRÈS les routes admin)
Route::get('/events/{code}', [EvenementController::class, 'show'])->name('events.public');
