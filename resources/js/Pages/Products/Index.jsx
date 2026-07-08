import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { syncProduits, getProduitsLocal } from '../../utils/sync';
import { IconBox, IconEdit, IconTrash, IconDownload, IconCheck, IconPlus } from '../../Components/Icons';

/* Mapping nom produit → image (démo) */
const PRODUCT_IMAGES = {
    'Eau minérale 1,5L':     '/images/products/eau-minerale.jpg',
    'Jus d\'orange 1L':      '/images/products/jus-orange.jpg',
    'Soda cola 33cl':        '/images/products/soda-cola.jpg',
    'Café expresso':         '/images/products/cafe-expresso.jpg',
    'Pain de mie nature':    '/images/products/pain-mie.jpg',
    'Beurre doux 250g':      '/images/products/beurre.jpg',
    'Confiture fraise 370g': '/images/products/confiture.jpg',
    'Pâtes 500g':            '/images/products/pates.jpg',
    'Savon mains 300ml':     '/images/products/savon.jpg',
    'Dentifrice 75ml':       '/images/products/dentifrice.jpg',
    'Chips nature 150g':     '/images/products/chips.jpg',
    'Barre chocolatée':      '/images/products/chocolat.jpg',
    'Cacahuètes grillées':   '/images/products/cacahuetes.jpg',
    'Stylo bille bleu':      '/images/products/stylo.jpg',
    'Carnet A5':             '/images/products/carnet.jpg',
};

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
        if (confirm(`Supprimer "${productName}" ?`)) {
            router.post(`/products/${productId}`, { _method: 'DELETE' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <h2 className="text-2xl font-extrabold text-slate-900">Produits</h2>
                        <div className="flex items-center gap-2 shrink-0">
                            <a href="/products/export"
                                className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-medium transition-all">
                                <IconDownload className="w-4 h-4" /> CSV
                            </a>
                            <Link href="/products/create"
                                className="h-10 px-5 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:scale-105 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 transition-all duration-300">
                                <IconPlus className="w-4 h-4" /> Nouveau
                            </Link>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {products.length} produit{products.length > 1 ? 's' : ''}
                        {loading && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                                <span className="w-3 h-3 border border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                Synchronisation…
                            </span>
                        )}
                    </p>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                        <IconCheck className="w-4 h-4" /><span>{flash.success}</span>
                    </div>
                )}

                {/* État vide */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border-t-4 border-emerald-500 p-12 text-center">
                        <IconBox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Aucun produit</h3>
                        <p className="text-slate-500 text-sm mb-6">Commencez par ajouter votre premier produit</p>
                        <Link href="/products/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-700/30 transition-all">
                            <IconPlus className="w-4 h-4" /> Créer un produit
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
                            const stockBas = product.stock_actuel <= product.stock_minimum;
                            const rupture = product.stock_actuel === 0;
                            const imgSrc = PRODUCT_IMAGES[product.nom];
                            return (
                                <div key={product.id_produit}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-emerald-500 overflow-hidden flex flex-col h-full">

                                    {/* Zone image */}
                                    <Link href={`/products/${product.id_produit}`}
                                        className="block h-36 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={product.nom}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <IconBox className="w-14 h-14 text-emerald-300/60 group-hover:text-emerald-400 transition-colors" />
                                        )}
                                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                                            rupture
                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                : stockBas
                                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {rupture ? 'Rupture' : stockBas ? 'Stock bas' : 'En stock'}
                                        </span>
                                    </Link>

                                    {/* Corps */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <Link href={`/products/${product.id_produit}`}>
                                                <h3 className="text-base font-bold text-slate-800 hover:text-emerald-600 transition-colors truncate pr-2">
                                                    {product.nom}
                                                </h3>
                                            </Link>
                                            <span className="font-bold text-emerald-600 text-lg whitespace-nowrap">
                                                {product.prix_base} €
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-slate-500 mb-4 mt-1">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                                                {product.categorie}
                                            </span>
                                            <span>Stock : {product.stock_actuel}</span>
                                        </div>

                                        {/* Boutons colorés */}
                                        <div className="mt-auto flex gap-3">
                                            <Link href={`/products/${product.id_produit}/edit`}
                                                className="flex-1 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5">
                                                <IconEdit className="w-4 h-4" /> Modifier
                                            </Link>
                                            <button onClick={() => handleDelete(product.id_produit, product.nom)}
                                                className="flex-1 py-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5">
                                                <IconTrash className="w-4 h-4" /> Supprimer
                                            </button>
                                        </div>
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
