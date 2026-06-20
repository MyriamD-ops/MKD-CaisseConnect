import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Header from '../../Components/Header';

export default function Create({ produits }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        lieu: '',
        date_debut: '',
        date_fin: '',
        description: '',
        produits: [],
    });

    const [selectedProduits, setSelectedProduits] = useState([]);

    // ── handleSubmit (doublon mort) supprimé — seul handleFormSubmit est utilisé ──

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

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (selectedProduits.length === 0) {
            alert('⚠️ Aucun produit sélectionné !\n\nVeuillez ajouter au moins un produit à l\'événement.');
            return;
        }

        const formData = {
            ...data,
            produits: selectedProduits.map(p => ({ id: p.id, stock: p.stock })),
        };

        console.log('📤 Envoi événement:', formData);
        post('/events', formData);
    };

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

                <h2 className="text-2xl font-bold text-dark mb-6">Nouvel événement</h2>

                <form onSubmit={handleFormSubmit}>
                    <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:items-start">

                        {/* ── Colonne gauche : informations + produits disponibles ── */}
                        <div className="space-y-6">

                            {/* Bloc informations */}
                            <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                <h3 className="text-base font-semibold text-dark mb-5">Informations</h3>

                                <div className="space-y-4">
                                    {/* Nom */}
                                    <div>
                                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                            Nom de l'événement *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            placeholder="Marché de Noël 2026"
                                            className="w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                        />
                                        {errors.nom && (
                                            <p className="text-ruby text-xs mt-1.5">{errors.nom}</p>
                                        )}
                                    </div>

                                    {/* Lieu */}
                                    <div>
                                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                            Lieu
                                        </label>
                                        <input
                                            type="text"
                                            value={data.lieu}
                                            onChange={(e) => setData('lieu', e.target.value)}
                                            placeholder="Place du marché"
                                            className="w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                        />
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                                Date début *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_debut}
                                                onChange={(e) => setData('date_debut', e.target.value)}
                                                className="w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                            />
                                            {errors.date_debut && (
                                                <p className="text-ruby text-xs mt-1.5">{errors.date_debut}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                                Date fin *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_fin}
                                                onChange={(e) => setData('date_fin', e.target.value)}
                                                className="w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                            />
                                            {errors.date_fin && (
                                                <p className="text-ruby text-xs mt-1.5">{errors.date_fin}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-3 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors resize-none font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bloc produits disponibles */}
                            <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                <h3 className="text-base font-semibold text-dark mb-4">
                                    Produits disponibles
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                                    {produits.map((produit) => {
                                        const dejaSel = !!selectedProduits.find(p => p.id === produit.id_produit);
                                        return (
                                            <button
                                                key={produit.id_produit}
                                                type="button"
                                                onClick={() => addProduit(produit)}
                                                disabled={dejaSel}
                                                className={`p-4 rounded-xl text-left border transition-all ${
                                                    dejaSel
                                                        ? 'bg-ember/5 border-ember/30 cursor-not-allowed'
                                                        : 'bg-snow border-slate/20 hover:border-ember/40 hover:bg-ember/5 cursor-pointer'
                                                }`}
                                            >
                                                <p className="text-sm font-semibold text-dark truncate mb-1">
                                                    {produit.nom}
                                                </p>
                                                <p className="text-xs text-slate">
                                                    Stock : {produit.stock_actuel}
                                                </p>
                                                {dejaSel && (
                                                    <p className="text-xs text-ember mt-1 font-medium">✓ Ajouté</p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Colonne droite : sélection + submit ── */}
                        <div className="mt-6 lg:mt-0 lg:sticky lg:top-6">
                            <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-5 lg:p-6">
                                <h3 className="text-base font-semibold text-dark mb-4">
                                    Produits sélectionnés
                                    <span className="ml-2 px-2 py-0.5 bg-ember/10 text-ember text-xs rounded-full font-bold">
                                        {selectedProduits.length}
                                    </span>
                                </h3>

                                {selectedProduits.length === 0 ? (
                                    <p className="text-slate text-sm text-center py-8">
                                        Aucun produit sélectionné
                                    </p>
                                ) : (
                                    <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                                        {selectedProduits.map((p) => (
                                            <div key={p.id} className="bg-snow rounded-xl p-3 border border-slate/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-dark truncate flex-1 mr-2">
                                                        {p.nom}
                                                    </span>
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
                                                    <span className="ml-auto text-xs text-slate shrink-0">
                                                        Max : {p.stock_max}
                                                    </span>
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
                                    {processing && (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    )}
                                    {processing ? 'Création...' : "Créer l'événement"}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
}
