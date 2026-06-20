import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Header from '../../Components/Header';

function SmsModal({ sale, onClose }) {
    const [telephone, setTelephone] = useState('');
    const [loading, setLoading]     = useState(false);
    const [success, setSuccess]     = useState(false);
    const [error, setError]         = useState('');

    const handleSend = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`/sales/${sale.id_vente}/sms`, { telephone });
            if (res.data.success) {
                setSuccess(true);
                setTimeout(onClose, 2000);
            } else {
                setError(res.data.error ?? 'Erreur inconnue.');
            }
        } catch (err) {
            const msg = err.response?.data?.error
                ?? err.response?.data?.message
                ?? 'Erreur lors de l\'envoi.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <h3 className="text-lg font-bold text-dark mb-4">Envoyer le reçu par SMS</h3>

                {success ? (
                    <p className="text-center text-green-600 font-medium py-4">✓ SMS envoyé !</p>
                ) : (
                    <>
                        <input
                            type="tel"
                            value={telephone}
                            onChange={e => setTelephone(e.target.value)}
                            placeholder="06 XX XX XX XX"
                            disabled={loading}
                            className="w-full h-11 px-4 rounded-xl border border-slate/30 text-sm text-dark placeholder-slate/50 focus:outline-none focus:ring-2 focus:ring-ember/40 mb-4"
                        />

                        {error && (
                            <p className="text-sm text-red-600 mb-3">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleSend}
                                disabled={loading || !telephone.trim()}
                                className="flex-1 h-11 flex items-center justify-center bg-ember hover:brightness-90 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : '📤 Envoyer'}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
                            >
                                Passer
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Show({ sale }) {
    const { auth } = usePage().props;
    const [showSmsModal, setShowSmsModal] = useState(false);

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="sales" />

            <main className="p-4 lg:p-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6 lg:p-8 text-center">
                    {/* Icône succès */}
                    <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center text-3xl mx-auto mb-4">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-dark mb-1">Vente enregistrée !</h2>
                    <p className="text-slate text-sm mb-6">
                        Numéro de vente : <span className="font-semibold text-dark">{sale.numero_vente}</span>
                    </p>

                    {/* Récapitulatif */}
                    <div className="bg-snow rounded-xl border border-slate/20 p-5 mb-6 text-left">
                        <div className="divide-y divide-slate/10">
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-slate">Date</span>
                                <span className="text-sm font-medium text-dark">
                                    {new Date(sale.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-slate">Vendeur</span>
                                <span className="text-sm font-medium text-dark">
                                    {sale.utilisateur?.username ?? sale.utilisateur?.name ?? '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-slate">Paiement</span>
                                <span className="text-sm font-medium text-dark">{sale.moyen_paiement}</span>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="mt-4 pt-4 border-t border-slate/10">
                            <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">Articles</p>
                            <div className="space-y-2">
                                {(sale.lignes ?? []).map((ligne, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-slate">
                                            {ligne.produit?.nom ?? `Produit #${ligne.id_produit}`} × {ligne.quantite}
                                        </span>
                                        <span className="font-medium text-dark">{ligne.sous_total}€</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mt-4 pt-4 border-t-2 border-slate/20 flex justify-between items-center">
                            <span className="text-base font-semibold text-dark">Total</span>
                            <span className="text-2xl font-bold text-ember">{sale.montant_total}€</span>
                        </div>
                    </div>

                    {/* Bouton SMS (auth uniquement) */}
                    {auth?.user && (
                        <button
                            onClick={() => setShowSmsModal(true)}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors mb-3"
                        >
                            📱 Envoyer le reçu par SMS
                        </button>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Link
                            href="/sales/create"
                            className="flex-1 h-11 flex items-center justify-center bg-linear-to-r from-ember to-ember-dim hover:brightness-90 text-white font-bold rounded-xl text-sm transition-all"
                        >
                            Nouvelle vente
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </main>

            {showSmsModal && (
                <SmsModal sale={sale} onClose={() => setShowSmsModal(false)} />
            )}
        </div>
    );
}
