import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import { IconBox, IconCart, IconAlert, IconCalendar, IconCoins } from '../Components/Icons';

export default function Dashboard({ auth, stats = {} }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="dashboard" />

            <main className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 text-base mt-1">Bienvenue {auth.user?.username}</p>
                </div>

                {/* Carte maîtresse — Chiffre d'affaires du jour */}
                <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-8 sm:p-10 mb-6 text-white shadow-xl shadow-emerald-700/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Chiffre d'affaires du jour</p>
                        <p className="text-5xl font-black mt-2 leading-none">
                            {stats.montantJour != null ? `${stats.montantJour.toFixed(2)} €` : '— €'}
                        </p>
                        <p className="text-emerald-200 text-sm mt-2">
                            {stats.ventesJour ?? 0} vente{(stats.ventesJour ?? 0) > 1 ? 's' : ''} enregistrée{(stats.ventesJour ?? 0) > 1 ? 's' : ''} aujourd'hui
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white/15 border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[100px]">
                            <p className="text-2xl font-extrabold">{stats.totalProduits ?? '—'}</p>
                            <p className="text-emerald-200 text-[10px] font-semibold uppercase tracking-wider mt-1">Produits</p>
                        </div>
                        <div className="bg-white/15 border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[100px]">
                            <p className="text-2xl font-extrabold">{stats.stockBas ?? '—'}</p>
                            <p className="text-emerald-200 text-[10px] font-semibold uppercase tracking-wider mt-1">Stock bas</p>
                        </div>
                    </div>
                </div>

                {/* Cartes stats secondaires */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { title: 'Produits actifs', value: stats.totalProduits ?? '—', icon: <IconBox className="w-5 h-5" /> },
                        { title: 'Ventes du jour',  value: stats.ventesJour ?? '—',    icon: <IconCart className="w-5 h-5" /> },
                        { title: 'Stock bas',        value: stats.stockBas ?? '—',      icon: <IconAlert className="w-5 h-5" /> },
                    ].map((card, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 border-t-4 border-t-emerald-600 p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                                    <p className="text-3xl font-extrabold text-slate-800">{card.value}</p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-extrabold text-slate-800 mb-6">Actions rapides</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/sales/create"
                            className="flex flex-col items-center gap-3 p-7 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/30 hover:-translate-y-1 transition-all">
                            <IconCart className="w-9 h-9" />
                            Nouvelle vente
                        </Link>
                        <Link href="/products/create"
                            className="flex flex-col items-center gap-3 p-7 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-base transition-all">
                            <IconBox className="w-9 h-9" />
                            Ajouter produit
                        </Link>
                        <Link href="/events/create"
                            className="flex flex-col items-center gap-3 p-7 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-base transition-all">
                            <IconCalendar className="w-9 h-9" />
                            Nouvel événement
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
