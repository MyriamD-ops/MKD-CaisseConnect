import { Link, useForm } from '@inertiajs/react';
import Header from '../../Components/Header';

const FIELD_CLASS = 'w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-dark uppercase tracking-widest mb-2';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        description: '',
        prix: '',
        stock_actuel: '',
        stock_minimum: '',
        categorie: '',
        matiere: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/products');
    };

    const categories = ['Bijou', 'Décoration', 'Accessoire', 'Figurine', 'Utilitaire', 'Autre'];
    const matieres = ['PLA', 'PETG', 'ABS', 'Résine', 'TPU/Flexible', 'Bois (PLA)', 'Métal (PLA)', 'Autre'];

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-3xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-slate hover:text-dark text-sm mb-6 transition-colors"
                >
                    ← Retour aux produits
                </Link>

                <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-dark mb-6">Nouveau produit</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nom */}
                        <div>
                            <label className={LABEL_CLASS}>Nom du produit *</label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                placeholder="Pendentif coeur 3D"
                                className={FIELD_CLASS}
                            />
                            {errors.nom && <p className="text-ruby text-xs mt-1.5">{errors.nom}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className={LABEL_CLASS}>Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="3"
                                placeholder="Dimensions, couleurs, finitions..."
                                className="w-full px-4 py-3 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors resize-none font-sans"
                            />
                        </div>

                        {/* Prix + Catégorie */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Prix (€) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.prix}
                                    onChange={(e) => setData('prix', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.prix && <p className="text-ruby text-xs mt-1.5">{errors.prix}</p>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Catégorie *</label>
                                <select
                                    value={data.categorie}
                                    onChange={(e) => setData('categorie', e.target.value)}
                                    className={FIELD_CLASS}
                                >
                                    <option value="">Sélectionner...</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {errors.categorie && <p className="text-ruby text-xs mt-1.5">{errors.categorie}</p>}
                            </div>
                        </div>

                        {/* Stock actuel + minimum */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL_CLASS}>Stock actuel *</label>
                                <input
                                    type="number"
                                    value={data.stock_actuel}
                                    onChange={(e) => setData('stock_actuel', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.stock_actuel && <p className="text-ruby text-xs mt-1.5">{errors.stock_actuel}</p>}
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Stock minimum *</label>
                                <input
                                    type="number"
                                    value={data.stock_minimum}
                                    onChange={(e) => setData('stock_minimum', e.target.value)}
                                    className={FIELD_CLASS}
                                />
                                {errors.stock_minimum && <p className="text-ruby text-xs mt-1.5">{errors.stock_minimum}</p>}
                            </div>
                        </div>

                        {/* Matériau */}
                        <div>
                            <label className={LABEL_CLASS}>Matériau d'impression</label>
                            <select
                                value={data.matiere}
                                onChange={(e) => setData('matiere', e.target.value)}
                                className={FIELD_CLASS}
                            >
                                <option value="">Sélectionner...</option>
                                {matieres.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                            </select>
                            <p className="text-xs text-slate/60 mt-1.5">Le type de filament utilisé</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-slate/10">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 h-11 bg-linear-to-r from-ember to-ember-dim hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {processing ? 'Création...' : 'Créer le produit'}
                            </button>
                            <Link
                                href="/products"
                                className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
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
