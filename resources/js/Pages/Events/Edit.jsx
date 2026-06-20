import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Header from '../../Components/Header';

const FIELD_CLASS = 'w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-dark uppercase tracking-widest mb-2';

export default function Edit({ evenement, produits }) {
    const [formData, setFormData] = useState({
        nom: evenement.nom,
        lieu: evenement.lieu || '',
        date_debut: evenement.date_debut.split('T')[0],
        date_fin: evenement.date_fin.split('T')[0],
        description: evenement.description || '',
        statut: evenement.statut,
    });

    const [selectedProduits, setSelectedProduits] = useState(
        evenement.produits.map(p => ({
            id: p.id_produit,
            nom: p.nom,
            stock: p.pivot.stock_evenement,
            stock_max: p.stock_actuel,
        }))
    );

    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/events/${evenement.id_evenement}/update`, {
            ...formData,
            produits: selectedProduits.map(p => ({ id: p.id, stock: p.stock })),
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const addProduit = (produit) => {
        if (!selectedProduits.find(p => p.id === produit.id_produit)) {
            setSelectedProduits([...selectedProduits, {
                id: produit.id_produit,
                nom: produit.nom,
                stock: 1,
                stock_max: produit.stock_actuel,
            }]);
        }
    };

    const updateStock = (id, stock) => {
        setSelectedProduits(selectedProduits.map(p =>
            p.id === id ? { ...p, stock: Math.min(Math.max(0, stock), p.stock_max) } : p
        ));
    };

    const removeProduit = (id) => {
        setSelectedProduits(selectedProduits.filter(p => p.id !== id));
    };

    const produitsDisponibles = produits.filter(p => !selectedProduits.find(sp => sp.id === p.id_produit));

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="events" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-slate hover:text-dark text-sm mb-6 transition-colors"
                >
                    ← Retour aux événements
                </Link>

                <h2 className="text-2xl font-bold text-dark mb-6">Modifier l'événement</h2>

                <form onSubmit={handleSubmit}>
                    <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:items-start">

                        {/* ── Colonne gauche ── */}
                        <div className="space-y-6">

                            {/* Informations */}
                            <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                <h3 className="text-base font-semibold text-dark mb-5">Informations</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className={LABEL_CLASS}>Nom de l'événement *</label>
                                        <input
                                            type="text"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            className={FIELD_CLASS}
                                        />
                                    </div>

                                    <div>
                                        <label className={LABEL_CLASS}>Lieu</label>
                                        <input
                                            type="text"
                                            value={formData.lieu}
                                            onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                                            className={FIELD_CLASS}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL_CLASS}>Date début *</label>
                                            <input
                                                type="date"
                                                value={formData.date_debut}
                                                onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                                                className={FIELD_CLASS}
                                            />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLASS}>Date fin *</label>
                                            <input
                                                type="date"
                                                value={formData.date_fin}
                                                onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                                                className={FIELD_CLASS}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={LABEL_CLASS}>Statut</label>
                                        <select
                                            value={formData.statut}
                                            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                                            className={FIELD_CLASS}
                                        >
                                            <option value="planifie">📅 Planifié</option>
                                            <option value="en_cours">✅ En cours</option>
                                            <option value="termine">🏁 Terminé</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={LABEL_CLASS}>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            className="w-full px-4 py-3 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors resize-none font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Produits disponibles */}
                            {produitsDisponibles.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                    <h3 className="text-base font-semibold text-dark mb-4">Ajouter des produits</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                                        {produitsDisponibles.map((produit) => (
                                            <button
                                                key={produit.id_produit}
                                                type="button"
                                                onClick={() => addProduit(produit)}
                                                className="p-4 rounded-xl text-left border border-slate/20 bg-snow hover:border-ember/40 hover:bg-ember/5 cursor-pointer transition-all"
                                            >
                                                <p className="text-sm font-semibold text-dark truncate mb-1">{produit.nom}</p>
                                                <p className="text-xs text-slate">Stock : {produit.stock_actuel}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Colonne droite ── */}
                        <div className="mt-6 lg:mt-0 lg:sticky lg:top-6">
                            <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                <h3 className="text-base font-semibold text-dark mb-4">
                                    Produits sélectionnés
                                    <span className="ml-2 px-2 py-0.5 bg-ember/10 text-ember text-xs rounded-full font-bold">
                                        {selectedProduits.length}
                                    </span>
                                </h3>

                                {selectedProduits.length === 0 ? (
                                    <p className="text-slate text-sm text-center py-8">Aucun produit</p>
                                ) : (
                                    <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                                        {selectedProduits.map((p) => (
                                            <div key={p.id} className="bg-snow rounded-xl p-3 border border-slate/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-dark truncate flex-1 mr-2">{p.nom}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProduit(p.id)}
                                                        className="w-7 h-7 flex items-center justify-center text-ruby hover:bg-ruby/10 rounded-lg transition-colors text-lg leading-none shrink-0"
                                                    >×</button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateStock(p.id, p.stock - 1)}
                                                        className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl transition-colors font-bold text-lg shrink-0"
                                                    >−</button>
                                                    <input
                                                        type="number"
                                                        value={p.stock}
                                                        onChange={(e) => updateStock(p.id, parseInt(e.target.value) || 0)}
                                                        className="w-14 h-11 text-center bg-white border border-slate/30 rounded-xl text-dark text-sm focus:outline-none focus:border-ember transition-colors"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateStock(p.id, p.stock + 1)}
                                                        className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl transition-colors font-bold text-lg shrink-0"
                                                    >+</button>
                                                    <span className="ml-auto text-xs text-slate shrink-0">Max : {p.stock_max}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 bg-linear-to-r from-ember to-ember-dim hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-ember/20"
                                >
                                    {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
}
