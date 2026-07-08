import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { getVentesNonSync, syncVentes } from '../../utils/sync';
import { IconCart, IconRefresh, IconDownload, IconPlus, IconEye } from '../../Components/Icons';

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

    /* Badge couleur selon moyen de paiement */
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
                    <div className="space-y-4">

                        {/* Ventes locales (non synchronisées) */}
                        {ventesLocales.map((vente) => (
                            <div key={`local-${vente.id}`}
                                className="bg-white rounded-xl shadow-sm border-t-4 border-amber-400 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-slate-800 truncate">Vente locale #{vente.id}</h4>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                                            Non sync.
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {new Date(vente.date_vente).toLocaleDateString('fr-FR')} • {vente.articles?.length || 0} article{(vente.articles?.length || 0) > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-extrabold text-slate-800">{parseFloat(vente.montant_total).toFixed(2)}</span>
                                    <span className="text-sm font-bold text-emerald-600">€</span>
                                </div>
                            </div>
                        ))}

                        {/* Ventes serveur */}
                        {serverSales.map((sale) => (
                            <div key={sale.id_vente}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-t-4 border-emerald-500 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                {/* Info gauche */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                        <h4 className="text-sm font-bold text-slate-800 truncate">{sale.numero_vente}</h4>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${paymentBadge(sale.moyen_paiement)}`}>
                                            {sale.moyen_paiement}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {new Date(sale.date_vente).toLocaleDateString('fr-FR')} à {new Date(sale.date_vente).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • <span className="text-slate-400">{sale.utilisateur?.username || 'N/A'}</span>
                                    </p>
                                </div>

                                {/* Montant */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-extrabold text-slate-800">{parseFloat(sale.montant_total).toFixed(2)}</span>
                                    <span className="text-sm font-bold text-emerald-600">€</span>
                                </div>

                                {/* Bouton détails */}
                                <Link href={`/sales/${sale.id_vente}`}
                                    className="w-full sm:w-auto bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-emerald-800 hover:scale-105 transition-all duration-200 shadow-sm shadow-emerald-700/20 text-center text-sm">
                                    Détails
                                </Link>
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
