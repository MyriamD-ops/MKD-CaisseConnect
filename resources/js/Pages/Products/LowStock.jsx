import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';

export default function LowStock({ lowStockProducts = [] }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-5xl mx-auto">
                {/* En-tête */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Alertes stock</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's' : ''} en stock bas
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="shrink-0 h-11 px-5 flex items-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-medium transition-colors"
                    >
                        Tous les produits
                    </Link>
                </div>

                {lowStockProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-12 text-center">
                        <p className="text-5xl mb-4">✅</p>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucune alerte stock</h3>
                        <p className="text-slate-500 text-sm">Tous vos produits ont un stock suffisant</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Bannière d'avertissement */}
                        <div className="flex items-start gap-3 p-4 bg-red-100/5 border border-red-200/30 rounded-xl text-sm mb-5">
                            <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
                            <p className="text-slate-800">
                                Ces produits ont atteint ou dépassé leur seuil d'alerte. Pensez à les réapprovisionner.
                            </p>
                        </div>

                        {lowStockProducts.map((product) => {
                            const rupture = product.stock_actuel === 0;
                            return (
                                <div
                                    key={product.id_produit}
                                    className={`bg-white rounded-2xl p-5 border shadow-sm ${
                                        rupture ? 'border-red-200/40 border-2' : 'border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-base font-semibold text-slate-800">{product.nom}</h3>
                                                {rupture && (
                                                    <span className="px-2.5 py-1 bg-red-100 text-white rounded-full text-xs font-bold">
                                                        RUPTURE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                                                <span>{product.prix_base}€</span>
                                                <span>🏷️ {product.categorie}</span>
                                                {product.matiere && <span>🔧 {product.matiere}</span>}
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="px-4 py-2.5 bg-red-100/5 border border-red-200 rounded-xl">
                                                    <p className="text-xs text-red-500 font-semibold uppercase tracking-widest mb-0.5">Stock actuel</p>
                                                    <p className="text-2xl font-bold text-red-500">{product.stock_actuel}</p>
                                                </div>
                                                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-0.5">Stock minimum</p>
                                                    <p className="text-2xl font-bold text-slate-800">{product.stock_minimum}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/products/${product.id_produit}/edit`}
                                            className="shrink-0 h-9 px-4 flex items-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-medium transition-colors"
                                        >
                                            ✏️ Modifier stock
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
