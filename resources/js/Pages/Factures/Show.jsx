import { Link, router, usePage } from '@inertiajs/react';
import Header from '../../Components/Header';
import { IconReceipt, IconDownload, IconCheck, IconArrowLeft } from '../../Components/Icons';

const STATUT_STYLES = {
    'Brouillon':    'bg-slate-100 text-slate-600 border-slate-200',
    'Émise':        'bg-blue-100 text-blue-700 border-blue-200',
    'Transmise PA': 'bg-amber-100 text-amber-700 border-amber-200',
    'Acceptée':     'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Rejetée':      'bg-red-100 text-red-700 border-red-200',
};

export default function Show({ facture }) {
    const { flash } = usePage().props;

    const handleTransmit = () => {
        if (confirm('Simuler la transmission de cette facture à la Plateforme Agréée ?')) {
            router.post(`/factures/${facture.id_facture}/transmit`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="factures" />

            <main className="p-4 lg:p-6 max-w-3xl mx-auto">
                <Link href="/factures" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
                    <IconArrowLeft className="w-4 h-4" /> Retour aux factures
                </Link>

                {flash?.success && (
                    <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                        <IconCheck className="w-4 h-4" /><span>{flash.success}</span>
                    </div>
                )}

                {/* En-tête facture */}
                <div className="bg-white rounded-xl shadow-sm border-t-4 border-emerald-500 overflow-hidden mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facture</p>
                                <h1 className="text-2xl font-black text-slate-800 mt-1">{facture.numero_facture}</h1>
                                <p className="text-sm text-emerald-600 font-semibold mt-2">{facture.client?.raison_sociale}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-slate-800">
                                    {parseFloat(facture.montant_ttc).toFixed(2)} <span className="text-lg text-emerald-600">€</span>
                                </p>
                                <span className={`inline-flex mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${STATUT_STYLES[facture.statut]}`}>
                                    {facture.statut}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Infos client */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Client</p>
                                <p className="text-sm font-semibold text-slate-800">{facture.client?.raison_sociale}</p>
                                <p className="text-xs text-slate-500 mt-1">SIRET : {facture.client?.siret}</p>
                                {facture.client?.numero_tva && <p className="text-xs text-slate-500">TVA : {facture.client.numero_tva}</p>}
                                <p className="text-xs text-slate-500 mt-1">{facture.client?.adresse}</p>
                                <p className="text-xs text-slate-500">{facture.client?.code_postal} {facture.client?.ville}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Détails</p>
                                <p className="text-xs text-slate-500">Format : <span className="font-semibold text-slate-700">{facture.format}</span></p>
                                <p className="text-xs text-slate-500">Émise le : <span className="font-semibold text-slate-700">{new Date(facture.date_emission).toLocaleDateString('fr-FR')}</span></p>
                                <p className="text-xs text-slate-500">Échéance : <span className="font-semibold text-slate-700">{new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</span></p>
                                {facture.transmitted_at && <p className="text-xs text-slate-500">Transmise le : <span className="font-semibold text-slate-700">{new Date(facture.transmitted_at).toLocaleDateString('fr-FR')}</span></p>}
                                <p className="text-xs text-slate-500">Vente : <span className="font-semibold text-emerald-600">{facture.vente?.numero_vente}</span></p>
                            </div>
                        </div>

                        {/* Lignes */}
                        {facture.vente?.lignes && (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lignes de facture</p>
                                <div className="bg-slate-50 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-emerald-700 text-white text-xs uppercase tracking-wider">
                                                <th className="text-left py-2 px-4">Désignation</th>
                                                <th className="text-right py-2 px-4">Qté</th>
                                                <th className="text-right py-2 px-4">P.U. HT</th>
                                                <th className="text-right py-2 px-4">Total HT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {facture.vente.lignes.map((ligne, i) => {
                                                const puHT = (parseFloat(ligne.prix_unitaire) / 1.20).toFixed(2);
                                                const totalHT = (puHT * ligne.quantite).toFixed(2);
                                                return (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                        <td className="py-2 px-4 text-slate-800">{ligne.produit?.nom || 'Produit supprimé'}</td>
                                                        <td className="py-2 px-4 text-right text-slate-600">{ligne.quantite}</td>
                                                        <td className="py-2 px-4 text-right text-slate-600">{puHT} €</td>
                                                        <td className="py-2 px-4 text-right font-semibold text-slate-800">{totalHT} €</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Totaux */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-1 text-sm">
                                <div className="flex justify-between text-slate-500">
                                    <span>Total HT</span>
                                    <span className="font-semibold">{parseFloat(facture.montant_ht).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>TVA (20%)</span>
                                    <span className="font-semibold">{parseFloat(facture.montant_tva).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-emerald-700 font-extrabold text-lg border-t-2 border-emerald-600 pt-2 mt-2">
                                    <span>Total TTC</span>
                                    <span>{parseFloat(facture.montant_ttc).toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <a href={`/factures/${facture.id_facture}/pdf`}
                        className="flex-1 py-3 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
                        <IconDownload className="w-5 h-5" /> Télécharger PDF
                    </a>
                    {facture.statut === 'Émise' && (
                        <button onClick={handleTransmit}
                            className="flex-1 py-3 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2">
                            <IconReceipt className="w-5 h-5" /> Transmettre à la PA (simulation)
                        </button>
                    )}
                    {facture.statut === 'Transmise PA' && (
                        <div className="flex-1 py-3 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center gap-2">
                            ⏳ En attente de validation par la PA
                        </div>
                    )}
                    {facture.statut === 'Acceptée' && (
                        <div className="flex-1 py-3 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-2">
                            <IconCheck className="w-5 h-5" /> Facture acceptée par la PA
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
