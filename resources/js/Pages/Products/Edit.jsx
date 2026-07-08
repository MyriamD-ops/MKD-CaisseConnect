import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Header from '../../Components/Header';

const FIELD_CLASS = 'w-full h-11 px-4 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-slate-800 uppercase tracking-widest mb-2';

export default function Edit({ product }) {
    const [formData, setFormData] = useState({
        nom: product?.nom || '',
        description: product?.description || '',
        prix: product?.prix_base || '',
        stock_actuel: product?.stock_actuel || '',
        stock_minimum: product?.stock_minimum || '',
        categorie: product?.categorie || '',
        matiere: product?.matiere || '',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/products/${product.id_produit}`, { _method: 'PUT', ...formData }, {
            onSuccess: () => setProcessing(false),
            onError: (errors) => { setErrors(errors); setProcessing(false); },
        });
    };

    const categories = ['Bijou', 'Décoration', 'Accessoire', 'Figurine', 'Utilitaire', 'Autre'];
    const matieres = ['PLA', 'PETG', 'ABS', 'Résine', 'TPU/Flexible', 'Bois (PLA)', 'Métal (PLA)', 'Autre'];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-3xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors"
                >
                    ← Retour aux produits
                </Link>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-sm p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Modifier le produit</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nom */}
                        <div>
                            <label className={LABEL_CLASS}>Nom du produit *</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => handleChange('nom', e.target.value)}
                                className={FIELD_CLASS}
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1.5">{errors.nom}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className={LABEL_CLASS}>Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-colors resize-none font-sans"
                            />
                        </div>

                        {/* Prix + Catégorie */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Prix (€) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.prix}
                                    onChange={(e) => handleChange('prix', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.prix && <p className="text-red-500 text-xs mt-1.5">{errors.prix}</p>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Catégorie *</label>
                                <select
                                    value={formData.categorie}
                                    onChange={(e) => handleChange('categorie', e.target.value)}
                                    className={FIELD_CLASS}
                                >
                                    <option value="">Sélectionner...</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {errors.categorie && <p className="text-red-500 text-xs mt-1.5">{errors.categorie}</p>}
                            </div>
                        </div>

                        {/* Stock actuel + minimum */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Stock actuel *</label>
                                <input
                                    type="number"
                                    value={formData.stock_actuel}
                                    onChange={(e) => handleChange('stock_actuel', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.stock_actuel && <p className="text-red-500 text-xs mt-1.5">{errors.stock_actuel}</p>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Stock minimum *</label>
                                <input
                                    type="number"
                                    value={formData.stock_minimum}
                                    onChange={(e) => handleChange('stock_minimum', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.stock_minimum && <p className="text-red-500 text-xs mt-1.5">{errors.stock_minimum}</p>}
                            </div>
                        </div>

                        {/* Matériau */}
                        <div>
                            <label className={LABEL_CLASS}>Matériau d'impression</label>
                            <select
                                value={formData.matiere || ''}
                                onChange={(e) => handleChange('matiere', e.target.value)}
                                className={FIELD_CLASS}
                            >
                                <option value="">Sélectionner...</option>
                                {matieres.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 h-11 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {processing && <span className="w-4 h-4 border-2 border-slate-100 border-t-white rounded-full animate-spin" />}
                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link
                                href="/products"
                                className="flex-1 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl text-sm font-medium transition-colors"
                            >
                                Annuler
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
