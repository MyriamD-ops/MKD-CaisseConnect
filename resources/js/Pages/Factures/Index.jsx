import { Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import { IconReceipt, IconCheck, IconEye, IconDownload } from '../../Components/Icons';

const STATUT_STYLES = {
    'Brouillon':    'bg-slate-100 text-slate-600 border-slate-200',
    'Émise':        'bg-blue-100 text-blue-700 border-blue-200',
    'Transmise PA': 'bg-amber-100 text-amber-700 border-amber-200',
    'Acceptée':     'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Rejetée':      'bg-red-100 text-red-700 border-red-200',
};

export default function Index({ factures }) {
    const data = factures.data || [];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="factures" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-900">Facturation électronique</h2>
                    <p className="text-slate-400 text-sm mt-1">{data.length} facture{data.length > 1 ? 's' : ''} — Format Factur-X</p>
                </div>

                {data.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border-t-4 border-emerald-500 p-12 text-center">
                        <IconReceipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Aucune facture</h3>
                        <p className="text-slate-500 text-sm">Les factures générées depuis les ventes B2B apparaîtront ici</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((facture) => (
                            <div key={facture.id_facture}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-emerald-500 overflow-hidden flex flex-col h-full">

                                {/* Zone montant */}
                                <div className="h-28 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-slate-800">
                                            {parseFloat(facture.montant_ttc).toFixed(2)} <span className="text-lg font-bold text-emerald-600">€</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">TTC</p>
                                    </div>
                                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${STATUT_STYLES[facture.statut] || STATUT_STYLES['Brouillon']}`}>
                                        {facture.statut}
                                    </span>
                                    <span className="absolute bottom-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-slate-600 border border-slate-200">
                                        {facture.format}
                                    </span>
                                </div>

                                {/* Corps */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-slate-800">{facture.numero_facture}</h4>
                                    </div>

                                    <p className="text-sm font-medium text-emerald-600 mb-2 truncate">
                                        {facture.client?.raison_sociale || '—'}
                                    </p>

                                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                                        <span>Émise le {new Date(facture.date_emission).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                                        <span>Échéance {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</span>
                                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                                            HT: {parseFloat(facture.montant_ht).toFixed(2)} €
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto flex gap-3">
                                        <Link href={`/factures/${facture.id_facture}`}
                                            className="flex-1 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5">
                                            <IconEye className="w-4 h-4" /> Détails
                                        </Link>
                                        <a href={`/factures/${facture.id_facture}/pdf`}
                                            className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5">
                                            <IconDownload className="w-4 h-4" /> PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
