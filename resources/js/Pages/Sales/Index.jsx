import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { getVentesNonSync, syncVentes } from '../../utils/sync';
import { IconCart, IconRefresh, IconDownload, IconPlus, IconCoins, IconEye } from '../../Components/Icons';

export default function Index({ sales }) {
    const isOnline = useOnlineStatus();
    const [ventesLocales, setVentesLocales] = useState([]);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => { loadVentesLocales(); }, []);
    useEffect(() => {
        if (isOnline && ventesLocales.length > 0 && !syncing) handleSync();
    }, [isOnline, ventesLocales.length]);

    const loadVentesLocales = async () => {
        try {
            const ventes = await getVentesNonSync();
            setVentesLocales(ventes);
        } catch (error) {
            console.error('Erreur chargement ventes locales:', error);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const count = await syncVentes();
            if (count > 0) { alert(`${count} vente(s) synchronisée(s) !`); window.location.reload(); }
        } catch (error) {
            console.error('Erreur sync:', error);
        } finally {
            setSyncing(false);
        }
    };

    const serverSales = sales.data || [];
    const totalVentes = serverSales.length + ventesLocales.length;

    const paymentBadge = (moyen) => {
        const styles = {
            'Espèces':        'bg-amber-100 text-amber-700 border-amber-200',
            'Carte bancaire': 'bg-blue-100 text-blue-700 border-blue-200',
            'Chèque':         'bg-slate-100 text-slate-600 border-slate-200',
            'Virement':       'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
        return styles[moyen] || 'bg-slate-100 text-slate-600 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="sales" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            <span className="sm:hidden">Ventes</span>
                            <span className="hidden sm:inline">Historique des ventes</span>
                        </h2>
                        <div className="flex items-center gap-2 shrink-0">
                            {ventesLocales.length > 0 && isOnline && (
                                <button onClick={handleSync} disabled={syncing}
                                    className="h-10 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 font-medium rounded-xl text-sm transition-colors disabled:opacity-50">
                                    <IconRefresh className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                                </button>
                            )}
                            <a href="/sales/export"
                                className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-medium transition-all">
                                <IconDownload className="w-4 h-4" /> CSV
                            </a>
                            <Link href="/sales/create"
                                className="h-10 px-5 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:scale-105 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 transition-all duration-300">
                                <IconPlus className="w-4 h-4" /> Vente
                            </Link>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {totalVentes} vente{totalVentes > 1 ? 's' : ''}
                        {ventesLocales.length > 0 && (
                            <span className="ml-1 text-emerald-600 font-medium">
                                • {ventesLocales.length} non synchronisée{ventesLocales.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </p>
                </div>

                {/* État vide */}
                {totalVentes === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border-t-4 border-emerald-500 p-12 text-center">
                        <IconCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Aucune vente</h3>
                        <p className="text-slate-500 text-sm mb-6">Les ventes apparaîtront ici</p>
                        <Link href="/sales/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-700/30 transition-all">
                            <IconPlus className="w-4 h-4" /> Nouvelle vente
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Ventes locales (non synchronisées) */}
                        {ventesLocales.map((vente) => (
                            <div key={`local-${vente.id}`}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-amber-400 overflow-hidden flex flex-col h-full">

                                {/* Zone montant — dégradé ambre (non sync) */}
                                <div className="h-28 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-slate-800">{parseFloat(vente.montant_total).toFixed(2)} <span className="text-lg font-bold text-amber-600">€</span></p>
                                    </div>
                                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm bg-amber-100 text-amber-700 border-amber-200">
                                        Non sync.
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">Vente locale #{vente.id}</h4>
                                    <p className="text-xs text-slate-500 mb-4">
                                        {new Date(vente.date_vente).toLocaleDateString('fr-FR')} • {vente.articles?.length || 0} article{(vente.articles?.length || 0) > 1 ? 's' : ''}
                                    </p>
                                    <div className="mt-auto">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${paymentBadge(vente.mode_paiement)}`}>
                                            {vente.mode_paiement}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Ventes serveur */}
                        {serverSales.map((sale) => (
                            <div key={sale.id_vente}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-emerald-500 overflow-hidden flex flex-col h-full">

                                {/* Zone montant — dégradé lumineux */}
                                <div className="h-28 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-slate-800">{parseFloat(sale.montant_total).toFixed(2)} <span className="text-lg font-bold text-emerald-600">€</span></p>
                                    </div>
                                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${paymentBadge(sale.moyen_paiement)}`}>
                                        {sale.moyen_paiement}
                                    </span>
                                </div>

                                {/* Corps */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-slate-800 truncate pr-2">{sale.numero_vente}</h4>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-slate-500 mb-4 mt-1">
                                        <span>
                                            {new Date(sale.date_vente).toLocaleDateString('fr-FR')} à {new Date(sale.date_vente).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                                            {sale.utilisateur?.username || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Bouton détails */}
                                    <div className="mt-auto">
                                        <Link href={`/sales/${sale.id_vente}`}
                                            className="w-full py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5">
                                            <IconEye className="w-4 h-4" /> Voir les détails
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {sales.links && (
                    <div className="mt-8 flex justify-center gap-2 flex-wrap">
                        {sales.links.map((link, index) => (
                            link.url ? (
                                <Link key={index} href={link.url}
                                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${link.active ? 'bg-emerald-700 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-500'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={index} className="px-3 py-2 rounded-lg text-sm border border-slate-200 bg-white text-slate-400"
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
