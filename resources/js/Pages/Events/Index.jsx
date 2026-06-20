import { Link, router } from '@inertiajs/react';
import Header from '../../Components/Header';

export default function Index({ evenements }) {
    const handleDelete = (id, nom) => {
        if (confirm(`Supprimer l'événement "${nom}" ?`)) {
            router.post(`/events/${id}/delete`, { _method: 'DELETE' });
        }
    };

    const getStatutBadge = (statut) => {
        const styles = {
            planifie: 'bg-slate/10 text-slate border-slate/20',
            en_cours: 'bg-mint/10 text-mint border-mint/20',
            termine:  'bg-slate/10 text-slate/60 border-slate/10',
        };
        const labels = {
            planifie: '📅 Planifié',
            en_cours: '✅ En cours',
            termine:  '🏁 Terminé',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[statut] || styles.planifie}`}>
                {labels[statut] || labels.planifie}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="events" />

            <main className="p-4 lg:p-6 max-w-7xl mx-auto">

                {/* En-tête */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-dark">Événements</h2>
                        <Link
                            href="/events/create"
                            className="shrink-0 h-9 px-3 flex items-center justify-center bg-ember hover:bg-ember-dim text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
                        >
                            + Nouveau
                        </Link>
                    </div>
                    <p className="text-slate text-sm">
                        {evenements.length} événement{evenements.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* État vide */}
                {evenements.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate/20 p-12 text-center">
                        <p className="text-5xl mb-4 grayscale">🎪</p>
                        <h3 className="text-lg font-semibold text-dark mb-2">Aucun événement</h3>
                        <p className="text-slate text-sm mb-6">Créez votre premier événement</p>
                        <Link
                            href="/events/create"
                            className="inline-flex items-center justify-center h-11 px-6 bg-ember hover:bg-ember-dim text-white font-bold rounded-xl text-sm transition-colors"
                        >
                            Créer un événement
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {evenements.map((event) => (
                            <div
                                key={event.id_evenement}
                                className="bg-white rounded-2xl border border-slate/20 p-5 hover:border-slate/40 hover:shadow-sm transition-all"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Nom + statut */}
                                        <div className="flex items-start gap-3 mb-2 flex-wrap">
                                            <Link href={`/events/${event.id_evenement}/admin`}>
                                                <h3 className="text-base font-bold text-dark hover:text-ember transition-colors">
                                                    {event.nom}
                                                </h3>
                                            </Link>
                                            {getStatutBadge(event.statut)}
                                        </div>

                                        {/* Méta */}
                                        <div className="flex flex-wrap gap-4 text-sm text-slate mb-3">
                                            <span>📍 {event.lieu || 'Non précisé'}</span>
                                            <span>📅 Du {new Date(event.date_debut).toLocaleDateString('fr-FR')} au {new Date(event.date_fin).toLocaleDateString('fr-FR')}</span>
                                            <span>📦 {event.produits_count} produit{event.produits_count > 1 ? 's' : ''}</span>
                                        </div>

                                        {/* Code unique */}
                                        <div className="inline-block px-3 py-1.5 bg-slate/5 border border-slate/10 rounded-lg">
                                            <span className="text-xs text-slate font-mono">Code : {event.code_unique}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link
                                            href={`/events/${event.id_evenement}/edit`}
                                            className="flex items-center justify-center min-h-11 px-4 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors sm:w-auto w-full"
                                        >
                                            ✏️ Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event.id_evenement, event.nom)}
                                            className="flex items-center justify-center min-h-11 px-4 bg-ruby/10 hover:bg-ruby/20 text-ruby rounded-xl text-sm font-medium transition-colors border border-ruby/20 sm:w-auto w-full"
                                        >
                                            🗑️ Supprimer
                                        </button>
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
