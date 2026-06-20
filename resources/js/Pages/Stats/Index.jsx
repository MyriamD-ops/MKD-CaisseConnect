import { router } from '@inertiajs/react';
import { useState } from 'react';
import Header from '../../Components/Header';

const PALETTE = ['#DC5F00', '#2C3E50', '#24B753', '#F29E1A', '#6C757D', '#C53030'];

const PRINT_STYLES = `
@media print {
    header, .no-print { display: none !important; }
    body, .bg-snow { background: white !important; }
    main { padding: 0 !important; max-width: 100% !important; }
    .shadow-sm { box-shadow: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}`;

function injectPrintStyles() {
    if (!document.getElementById('caisse-print-style')) {
        const s = document.createElement('style');
        s.id = 'caisse-print-style';
        s.innerHTML = PRINT_STYLES;
        document.head.appendChild(s);
    }
}

function PieChart({ data, total }) {
    if (!data || data.length === 0 || total === 0)
        return <div className="flex items-center justify-center h-40 text-slate text-sm">Aucune donnée</div>;

    const size = 160, cx = 80, cy = 80, r = 60;
    let cumul = 0;
    const slices = data.map((d, i) => {
        const pct = d.value / total, s = cumul;
        cumul += pct;
        const a1 = s * 2 * Math.PI - Math.PI / 2, a2 = cumul * 2 * Math.PI - Math.PI / 2;
        return {
            path: `M ${cx} ${cy} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)} Z`,
            color: PALETTE[i % PALETTE.length], label: d.label, pct: Math.round(pct * 100),
        };
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" />)}
            </svg>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                {slices.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-slate">{s.label}</span>
                        <span className="text-xs font-semibold text-dark">{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KpiCard({ label, value, tendance, unite = '' }) {
    const hausse = tendance > 0, baisse = tendance < 0;
    return (
        <div className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate uppercase tracking-widest mb-2">{label}</p>
            <p className="text-3xl font-bold text-dark">{value}{unite && <span className="text-lg ml-1">{unite}</span>}</p>
            {tendance !== null && tendance !== undefined ? (
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${hausse ? 'bg-mint/10 text-mint' : baisse ? 'bg-ruby/10 text-ruby' : 'bg-slate/10 text-slate'}`}>
                    {hausse ? '↑' : baisse ? '↓' : '→'} {Math.abs(tendance)}% vs période préc.
                </div>
            ) : <p className="mt-2 text-xs text-slate">Première période</p>}
        </div>
    );
}

function BarRow({ nom, categorie, qte, ca, maxCa }) {
    const pct = maxCa > 0 ? (ca / maxCa) * 100 : 0;
    return (
        <div className="py-3 border-b border-slate/10 last:border-0">
            <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-semibold text-dark truncate">{nom}</p>
                    <p className="text-xs text-slate">{categorie} · {qte} vendu{qte > 1 ? 's' : ''}</p>
                </div>
                <span className="text-sm font-bold text-ember shrink-0">{ca.toFixed(2)}€</span>
            </div>
            <div className="h-1.5 bg-slate/10 rounded-full overflow-hidden">
                <div className="h-full bg-ember rounded-full" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function WeekChart({ data }) {
    if (!data || data.every(d => d.total === 0))
        return <p className="text-slate text-sm text-center py-8">Aucune donnée sur cette période</p>;
    const maxTotal = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="flex items-end gap-2 h-32 pt-4">
            {data.map((d, i) => {
                const pct = (d.total / maxTotal) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        {d.total > 0 && <span className="text-xs text-ember font-semibold">{d.total}€</span>}
                        <div className="w-full flex items-end justify-center" style={{ height: '72px' }}>
                            <div className={`w-full rounded-t-md ${d.total > 0 ? 'bg-ember' : 'bg-slate/10'}`} style={{ height: `${Math.max(pct, 4)}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${d.total > 0 ? 'text-dark' : 'text-slate/40'}`}>{d.jour}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index({ periode, evenementId, dateChoisie, evenements, kpis, parPaiement, parJour, topProduits, ventesParHeure, debut, fin }) {
    const [periodeActive, setPeriodeActive] = useState(periode);
    const [evenementSel, setEvenementSel]   = useState(evenementId || '');
    const [dateInput, setDateInput]         = useState(dateChoisie || new Date().toISOString().split('T')[0]);

    const naviguer = (p, extra = {}) => {
        setPeriodeActive(p);
        router.get('/stats', { periode: p, ...extra }, { preserveScroll: true });
    };

    const handleExport = () => { injectPrintStyles(); window.print(); };

    const totalPaiement = parPaiement.reduce((s, d) => s + d.nb, 0);
    const dataPaiement  = parPaiement.map(d => ({ label: d.moyen, value: d.nb }));
    const maxCa         = topProduits.length > 0 ? topProduits[0].ca_produit : 1;
    const evSel         = evenements.find(e => String(e.id_evenement) === String(evenementSel));
    const labelPeriode  = periodeActive === 'evenement' && evSel
        ? `${evSel.nom} · ${evSel.date_debut} → ${evSel.date_fin}`
        : `Du ${debut} au ${fin}`;

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="stats" />
            <main className="p-4 lg:p-6 max-w-5xl mx-auto">

                {/* Titre + export */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-dark">Statistiques</h2>
                        <p className="text-slate text-sm mt-1">{labelPeriode}</p>
                    </div>
                    <button onClick={handleExport}
                        className="no-print shrink-0 h-10 px-4 flex items-center gap-2 bg-white border border-slate/30 hover:border-ember/40 hover:text-ember text-slate rounded-xl text-sm font-medium transition-colors">
                        📸 Exporter
                    </button>
                </div>

                {/* Onglets */}
                <div className="flex gap-2 mb-4 flex-wrap no-print">
                    {[{ key: 'jour', label: '📅 Jour' }, { key: 'mois', label: '🗓️ Mois' }, { key: 'evenement', label: '🎪 Événement' }].map(({ key, label }) => (
                        <button key={key} onClick={() => naviguer(key, key === 'jour' ? { date: dateInput } : {})}
                            className={`h-10 px-5 rounded-xl text-sm font-semibold transition-colors ${periodeActive === key ? 'bg-ember text-white shadow-sm shadow-ember/20' : 'bg-white border border-slate/20 text-slate hover:text-dark hover:border-slate/40'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Sélecteur date (jour) */}
                {periodeActive === 'jour' && (
                    <div className="mb-6 flex items-center gap-3 flex-wrap no-print">
                        <input type="date" value={dateInput} max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => { setDateInput(e.target.value); naviguer('jour', { date: e.target.value }); }}
                            className="h-11 px-4 bg-white border border-slate/30 rounded-xl text-dark text-sm focus:outline-none focus:border-ember transition-colors" />
                        <span className="text-sm text-slate">
                            {new Date(dateInput + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                )}

                {/* Sélecteur événement */}
                {periodeActive === 'evenement' && (
                    <div className="mb-6 no-print">
                        <select value={evenementSel}
                            onChange={(e) => { setEvenementSel(e.target.value); naviguer('evenement', { evenement_id: e.target.value }); }}
                            className="w-full h-11 px-4 bg-white border border-slate/30 rounded-xl text-dark text-sm focus:outline-none focus:border-ember transition-colors">
                            <option value="">— Sélectionner un événement —</option>
                            {evenements.map(ev => (
                                <option key={ev.id_evenement} value={ev.id_evenement}>
                                    {ev.nom} · {ev.date_debut} → {ev.date_fin}
                                </option>
                            ))}
                        </select>
                        {evSel && <p className="text-xs text-slate mt-2 ml-1">Toutes les ventes entre le {evSel.date_debut} et le {evSel.date_fin}</p>}
                    </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <KpiCard label="Chiffre d'affaires" value={kpis.ca.toFixed(2)}          tendance={kpis.tendanceCa}      unite="€" />
                    <KpiCard label="Nombre de ventes"   value={kpis.nbVentes}                tendance={kpis.tendanceVentes} />
                    <KpiCard label="Panier moyen"        value={kpis.panierMoyen.toFixed(2)} tendance={kpis.tendancePanier}  unite="€" />
                </div>

                {/* Graphes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-dark mb-4">💳 Moyens de paiement</h3>
                        <PieChart data={dataPaiement} total={totalPaiement} />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-dark mb-2">📆 CA par jour de la semaine</h3>
                        <WeekChart data={parJour} />
                    </div>
                </div>

                {/* Top 5 */}
                <div className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-dark mb-4">🏆 Top 5 produits</h3>
                    {topProduits.length === 0
                        ? <p className="text-slate text-sm text-center py-8">Aucune vente sur cette période</p>
                        : topProduits.map((p, i) => <BarRow key={i} nom={p.nom} categorie={p.categorie} qte={p.qte_vendue} ca={p.ca_produit} maxCa={maxCa} />)
                    }
                </div>

                {/* Ventes par heure (mode jour) */}
                {periodeActive === 'jour' && ventesParHeure.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate/20 p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-dark mb-4">📈 Ventes par heure</h3>
                        <div className="flex items-end gap-1 h-28">
                            {ventesParHeure.map((v, i) => {
                                const maxT = Math.max(...ventesParHeure.map(x => x.total), 1);
                                const pct  = (v.total / maxT) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                                            <div className="w-full bg-ember/80 rounded-t-md" style={{ height: `${Math.max(pct, 4)}%` }} title={`${v.heure} : ${v.total.toFixed(2)}€`} />
                                        </div>
                                        <span className="text-xs text-slate">{v.heure}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-slate/40 mt-6">Données en temps réel · CaisseMobile</p>
            </main>
        </div>
    );
}
