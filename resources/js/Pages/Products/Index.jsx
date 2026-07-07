import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { syncProduits, getProduitsLocal } from '../../utils/sync';

/* ── Icônes SVG ──────────────────────────────────── */
const IconEdit = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);
const IconTrash = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);
const IconDownload = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);
const IconCheck = ({ className = "w-3 h-3" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* ── Icônes SVG par catégorie ─────────────────────── */
const CatIconBoissons = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
);
const CatIconEpicerie = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);
const CatIconHygiene = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
const CatIconSnacking = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12Z" /><path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);
const CatIconAccessoires = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
);
const CatIconDefault = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);

const CATEGORY_STYLES = {
    'Boissons':    { bg: 'from-slate-300 to-slate-400',  Icon: CatIconBoissons },
    'Épicerie':    { bg: 'from-slate-300 to-slate-400',  Icon: CatIconEpicerie },
    'Hygiène':     { bg: 'from-slate-300 to-slate-400',  Icon: CatIconHygiene },
    'Snacking':    { bg: 'from-slate-300 to-slate-400',  Icon: CatIconSnacking },
    'Accessoires': { bg: 'from-slate-300 to-slate-400',  Icon: CatIconAccessoires },
    'default':     { bg: 'from-slate-300 to-slate-400',  Icon: CatIconDefault },
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
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
            router.post(`/products/${productId}`, { _method: 'DELETE' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-slate-800">Produits</h2>
                        <div className="flex items-center gap-2 shrink-0">
                            <a href="/products/export"
                                className="h-9 px-3 flex items-center gap-1.5 bg-white/60 backdrop-blur-sm border border-white/60 hover:bg-white/80 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-medium transition-all whitespace-nowrap">
                                <IconDownload className="w-4 h-4" /> CSV
                            </a>
                            <Link href="/products/create"
                                className="h-9 px-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap">
                                + Nouveau
                            </Link>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {products.length} produit{products.length > 1 ? 's' : ''}
                        {loading && (
                            <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
                                <span className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Synchronisation…
                            </span>
                        )}
                    </p>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mb-5 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-xl text-blue-700 text-sm flex items-center gap-2">
                        <IconCheck className="w-4 h-4" /><span>{flash.success}</span>
                    </div>
                )}

                {/* État vide */}
                {products.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-12 text-center">
                        <p className="text-5xl mb-4 grayscale">📦</p>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucun produit</h3>
                        <p className="text-slate-500 text-sm mb-6">Commencez par ajouter votre premier produit</p>
                        <Link href="/products/create"
                            className="inline-flex items-center justify-center h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">
                            Créer un produit
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {products.map((product) => {
                            const stockBas = product.stock_actuel <= product.stock_minimum;
                            const catStyle = CATEGORY_STYLES[product.categorie] || CATEGORY_STYLES['default'];
                            const CatIcon = catStyle.Icon;
                            return (
                                <div key={product.id_produit}
                                    className="bg-white/70 backdrop-blur-md rounded-lg border border-white/60 overflow-hidden hover:bg-white/90 hover:shadow-xl transition-all shadow-sm group">

                                    {/* Visuel produit */}
                                    <Link href={`/products/${product.id_produit}`}
                                        className={`block h-36 bg-gradient-to-br ${catStyle.bg} flex items-center justify-center relative`}>
                                        <span className="opacity-70 group-hover:scale-110 transition-transform duration-300">
                                            <CatIcon />
                                        </span>
                                        {/* Badge stock */}
                                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm ${stockBas ? 'bg-white/30 text-white' : 'bg-white/90 text-blue-600'}`}>
                                            {stockBas ? '⚠ Bas' : <><IconCheck className="w-3 h-3" /> OK</>}
                                        </span>
                                        {/* Badge catégorie */}
                                        <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                            {product.categorie}
                                        </span>
                                    </Link>

                                    {/* Infos produit */}
                                    <div className="p-4">
                                        <Link href={`/products/${product.id_produit}`} className="block mb-3">
                                            <h3 className="font-bold text-slate-800 hover:text-blue-600 transition-colors text-lg truncate">
                                                {product.nom}
                                            </h3>
                                            <div className="flex items-baseline justify-between mt-1">
                                                <span className="text-base font-semibold text-slate-600">{product.prix_base} €</span>
                                                <span className="text-sm text-slate-500">Stock : {product.stock_actuel}</span>
                                            </div>
                                        </Link>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link href={`/products/${product.id_produit}/edit`}
                                                className="flex-1 h-10 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 rounded-lg text-sm font-medium transition-all">
                                                <IconEdit className="w-4 h-4" /> Modifier
                                            </Link>
                                            <button onClick={() => handleDelete(product.id_produit, product.nom)}
                                                className="flex-1 h-10 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-blue-500 hover:text-blue-700 rounded-lg text-sm font-medium transition-all">
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
