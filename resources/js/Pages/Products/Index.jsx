import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { syncProduits, getProduitsLocal } from '../../utils/sync';

export default function Index({ products: serverProducts }) {
    const { flash } = usePage().props;
    const isOnline = useOnlineStatus();
    const [products, setProducts] = useState(serverProducts);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadProducts(); }, []);
    useEffect(() => { if (isOnline) syncProducts(); }, [isOnline]);

    const loadProducts = async () => {
        try {
            const localProducts = await getProduitsLocal();
            if (localProducts.length > 0) setProducts(localProducts);
        } catch (error) {
            console.error('Erreur chargement produits locaux:', error);
        }
    };

    const syncProducts = async () => {
        if (!isOnline) return;
        setLoading(true);
        try {
            const synced = await syncProduits();
            setProducts(synced);
        } catch (error) {
            console.error('Erreur synchronisation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (productId, productName) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
            router.post(`/products/${productId}`, { _method: 'DELETE' });
        }
    };

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">

                {/* En-tête — titre sur sa ligne, boutons sur la suivante sur mobile */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-dark">Produits</h2>
                        <div className="flex items-center gap-2 shrink-0">
                            <a href="/products/export"
                                className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate/30 hover:border-slate/50 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                                ⬇️ CSV
                            </a>
                            <Link href="/products/create"
                                className="h-9 px-3 flex items-center justify-center bg-ember hover:bg-ember-dim text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap">
                                + Nouveau
                            </Link>
                        </div>
                    </div>
                    <p className="text-slate text-sm">
                        {products.length} produit{products.length > 1 ? 's' : ''}
                        {loading && (
                            <span className="ml-2 inline-flex items-center gap-1 text-ember">
                                <span className="w-3 h-3 border border-ember border-t-transparent rounded-full animate-spin" />
                                Synchronisation…
                            </span>
                        )}
                    </p>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mb-5 p-4 bg-mint/10 border border-mint/30 rounded-xl text-mint text-sm flex items-center gap-2">
                        <span>✓</span><span>{flash.success}</span>
                    </div>
                )}

                {/* État vide */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate/20 p-12 text-center">
                        <p className="text-5xl mb-4 grayscale">📦</p>
                        <h3 className="text-lg font-semibold text-dark mb-2">Aucun produit</h3>
                        <p className="text-slate text-sm mb-6">Commencez par ajouter votre premier produit</p>
                        <Link href="/products/create"
                            className="inline-flex items-center justify-center h-11 px-6 bg-ember hover:bg-ember-dim text-white font-bold rounded-xl text-sm transition-colors">
                            Créer un produit
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {products.map((product) => {
                            const stockBas = product.stock_actuel <= product.stock_minimum;
                            return (
                                <div key={product.id_produit}
                                    className="bg-white rounded-2xl border border-slate/20 p-5 flex flex-col gap-4 hover:border-slate/40 transition-colors shadow-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <Link href={`/products/${product.id_produit}`} className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-dark hover:text-ember transition-colors truncate">{product.nom}</h3>
                                        </Link>
                                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${stockBas ? 'bg-ruby/10 text-ruby border border-ruby/20' : 'bg-mint/10 text-mint border border-mint/20'}`}>
                                            {stockBas ? '⚠ Bas' : '✓ OK'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                        <span className="text-ember font-bold">{product.prix_base}€</span>
                                        <span className="text-slate">Stock : {product.stock_actuel}</span>
                                        <span className="text-slate truncate">{product.categorie}</span>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        <Link href={`/products/${product.id_produit}/edit`}
                                            className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors">
                                            ✏️ Modifier
                                        </Link>
                                        <button onClick={() => handleDelete(product.id_produit, product.nom)}
                                            className="flex-1 h-11 flex items-center justify-center bg-ruby/10 hover:bg-ruby/20 text-ruby rounded-xl text-sm font-medium transition-colors border border-ruby/20">
                                            🗑️ Supprimer
                                        </button>
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
