import { Link } from '@inertiajs/react';
import Header from '../Components/Header';

export default function Dashboard({ auth, stats = {} }) {
    return (
        <div className="relative min-h-screen bg-snow">
            {/* Éléments décoratifs flous (blobs) */}
            <div className="fixed top-0 -left-20 w-72 h-72 bg-ember rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none" />
            <div className="fixed bottom-0 -right-20 w-80 h-80 bg-dark rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

            <Header currentPage="dashboard" />

            <main className="relative z-10 px-4 sm:px-6 py-8 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-dark tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate text-base mt-1">
                        Bienvenue {auth.user?.username}
                    </p>
                </div>

                {/* Cartes statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                    {[
                        { title: 'Produits',       value: stats.totalProduits ?? '—',                                          icon: '📦', accent: false },
                        { title: 'Stock Bas',       value: stats.stockBas ?? '—',                                              icon: '⚠️', accent: true  },
                        { title: 'Ventes du jour',  value: stats.ventesJour ?? '—',                                            icon: '🛒', accent: false },
                        { title: 'Montant du jour', value: stats.montantJour != null ? `${stats.montantJour.toFixed(2)} €` : '—', icon: '💰', accent: false },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-dark">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.accent ? 'bg-ruby/10' : 'bg-ember/10'}`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions rapides */}
                <div>
                    <h2 className="text-xl font-semibold text-dark mb-5">
                        Actions rapides
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Nouvelle vente */}
                        <Link
                            href="/sales/create"
                            className="bg-linear-to-r from-ember to-ember-dim rounded-2xl p-6 flex flex-col items-center gap-3 text-white shadow-lg shadow-ember/30 hover:brightness-90 hover:scale-[1.02] transition-all duration-300"
                        >
                            <span className="text-4xl filter drop-shadow-lg">🛒</span>
                            <span className="font-bold text-lg">Nouvelle vente</span>
                        </Link>

                        {/* Ajouter produit */}
                        <Link
                            href="/products/create"
                            className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-slate/30 p-6 flex flex-col items-center gap-3 text-dark hover:bg-white hover:border-ember hover:shadow-lg transition-all duration-300"
                        >
                            <span className="text-4xl">📦</span>
                            <span className="font-bold text-lg">Ajouter produit</span>
                        </Link>

                        {/* Nouvel événement */}
                        <Link
                            href="/events/create"
                            className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-slate/30 p-6 flex flex-col items-center gap-3 text-dark hover:bg-white hover:border-ember hover:shadow-lg transition-all duration-300"
                        >
                            <span className="text-4xl">📅</span>
                            <span className="font-bold text-lg">Nouvel événement</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
