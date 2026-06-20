export default function Public({ evenement }) {
    return (
        <div className="min-h-screen bg-snow flex flex-col">
            {/* Header public — pas de nav admin */}
            <header className="bg-dark text-white px-4 py-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight mb-1">{evenement.nom}</h1>
                <p className="text-sm text-white/70">
                    📍 {evenement.lieu} · 📅 {evenement.date_debut} – {evenement.date_fin}
                </p>
            </header>

            {/* Catalogue */}
            <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
                {/* Description */}
                {evenement.description && (
                    <div className="bg-white rounded-2xl border border-slate/20 p-5 mb-6 shadow-sm">
                        <p className="text-sm text-slate leading-relaxed">{evenement.description}</p>
                    </div>
                )}

                <h2 className="text-lg font-semibold text-dark mb-4">
                    Nos produits disponibles
                    <span className="ml-2 text-slate font-normal">({evenement.produits.length})</span>
                </h2>

                {evenement.produits.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate/20 p-12 text-center">
                        <p className="text-5xl mb-4 grayscale">📦</p>
                        <p className="text-slate">Aucun produit disponible pour le moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evenement.produits.map((produit) => (
                            <div
                                key={produit.id}
                                className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                            >
                                {/* Badge disponibilité */}
                                <div className="mb-3">
                                    {produit.disponible ? (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-mint/10 text-mint border border-mint/20">
                                            ✓ Disponible
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-ruby/10 text-ruby border border-ruby/20">
                                            ✗ Rupture
                                        </span>
                                    )}
                                </div>

                                {/* Nom */}
                                <h3 className="text-base font-semibold text-dark mb-2">{produit.nom}</h3>

                                {/* Description */}
                                {produit.description && (
                                    <p className="text-sm text-slate mb-3 leading-relaxed">{produit.description}</p>
                                )}

                                {/* Méta */}
                                <div className="flex flex-col gap-1 mb-4 text-sm text-slate">
                                    {produit.categorie && <span>🏷️ {produit.categorie}</span>}
                                    {produit.matiere && <span>🔧 {produit.matiere}</span>}
                                    {produit.disponible && <span>📦 {produit.stock_evenement} en stock</span>}
                                </div>

                                {/* Prix */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate/10">
                                    <span className="text-2xl font-bold text-ember">{produit.prix}€</span>
                                    {!produit.disponible && (
                                        <span className="text-xs text-ruby font-medium">Plus disponible</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white/60 text-center py-5 text-xs mt-auto">
                Powered by CaisseMobile
            </footer>
        </div>
    );
}
