import { Link } from '@inertiajs/react';
import Header from '../Components/Header';

/* ── Icônes SVG neutres ────────────────────────────────────── */
const IconBox = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);
const IconAlert = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const IconCart = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);
const IconCoins = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" /><path d="M12 8v8" /><path d="M8 12h8" />
    </svg>
);
const IconCalendar = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        <rect x="8" y="14" width="3" height="3" rx="0.5" />
    </svg>
);

export default function Dashboard({ auth, stats = {} }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header currentPage="dashboard" />

            <main className="relative px-4 sm:px-6 py-8 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 text-base mt-1">
                        Bienvenue {auth.user?.username}
                    </p>
                </div>

                {/* Cartes statistiques — Glassmorphism */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: 'Produits',       value: stats.totalProduits ?? '—',                                          icon: <IconBox className="w-6 h-6" /> },
                        { title: 'Stock Bas',       value: stats.stockBas ?? '—',                                              icon: <IconAlert className="w-6 h-6" /> },
                        { title: 'Ventes du jour',  value: stats.ventesJour ?? '—',                                            icon: <IconCart className="w-6 h-6" /> },
                        { title: 'Montant du jour', value: stats.montantJour != null ? `${stats.montantJour.toFixed(2)} €` : '—', icon: <IconCoins className="w-6 h-6" /> },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 shadow-lg hover:shadow-2xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-800">
                                        {card.value}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center text-slate-600 shadow-inner">
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions rapides */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-5">
                        Actions rapides
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Nouvelle vente — accent principal */}
                        <Link
                            href="/sales/create"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 flex flex-col items-center gap-3 text-white shadow-lg shadow-blue-500/40 hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
                        >
                            <IconCart className="w-10 h-10" />
                            <span className="font-bold text-lg">Nouvelle vente</span>
                        </Link>

                        {/* Ajouter produit — verre dépoli */}
                        <Link
                            href="/products/create"
                            className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 flex flex-col items-center gap-3 text-slate-800 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
                        >
                            <IconBox className="w-10 h-10" />
                            <span className="font-bold text-lg">Ajouter produit</span>
                        </Link>

                        {/* Nouvel événement — verre dépoli */}
                        <Link
                            href="/events/create"
                            className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 flex flex-col items-center gap-3 text-slate-800 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
                        >
                            <IconCalendar className="w-10 h-10" />
                            <span className="font-bold text-lg">Nouvel événement</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
