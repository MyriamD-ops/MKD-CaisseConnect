import { useState } from 'react';
import Header from '../Components/Header';

// ── Composants utilitaires internes ───────────────────────────────────────────

function Section({ title, children }) {
    return (
        <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-bold text-slate uppercase tracking-widest whitespace-nowrap">
                    {title}
                </h2>
                <div className="flex-1 h-px bg-slate/20" />
            </div>
            {children}
        </section>
    );
}

function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate/20 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function Label({ children }) {
    return (
        <p className="text-xs font-semibold text-slate uppercase tracking-widest mt-3 mb-1.5">
            {children}
        </p>
    );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function UIPreview() {
    const [showPin, setShowPin] = useState(false);
    const [inputVal, setInputVal] = useState('');

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="dashboard" />

            <main className="max-w-5xl mx-auto px-4 py-8 lg:px-10 lg:py-12">

                {/* Titre de page */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ember/10 text-ember text-xs font-bold rounded-full uppercase tracking-widest mb-4">
                        Design System
                    </div>
                    <h1 className="text-4xl font-bold text-dark tracking-tight">
                        Palette Urban
                    </h1>
                    <p className="text-slate mt-2 text-sm">
                        Prévisualisation des composants avant intégration — CaisseMobile
                    </p>
                </div>

                {/* ── 1. COULEURS ───────────────────────────────────────────── */}
                <Section title="Palette de couleurs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                            { hex: '#EEEEEE', name: 'snow',      label: 'Snow',      dark: true  },
                            { hex: '#666C7B', name: 'slate',     label: 'Slate',     dark: false },
                            { hex: '#3A3F43', name: 'dark',      label: 'Dark',      dark: false },
                            { hex: '#DC5F00', name: 'ember',     label: 'Ember',     dark: false },
                            { hex: '#B84E00', name: 'ember-dim', label: 'Ember dim', dark: false },
                            { hex: '#10B981', name: 'mint',      label: 'Mint',      dark: false },
                            { hex: '#EF4444', name: 'ruby',      label: 'Ruby',      dark: false },
                        ].map((c) => (
                            <div key={c.name}>
                                <div
                                    className="h-16 rounded-xl border border-slate/20 mb-2"
                                    style={{ backgroundColor: c.hex }}
                                />
                                <p className="text-xs font-semibold text-dark leading-tight">{c.label}</p>
                                <p className="text-xs text-slate font-mono">{c.hex}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── 2. TYPOGRAPHIE ────────────────────────────────────────── */}
                <Section title="Typographie">
                    <Card className="p-6 lg:p-8 space-y-5">
                        <div>
                            <p className="text-4xl font-bold text-dark leading-tight">H1 · Bold 36px</p>
                            <p className="text-xs text-slate font-mono mt-1">text-4xl font-bold text-dark</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-dark leading-tight">H2 · Bold 30px</p>
                            <p className="text-xs text-slate font-mono mt-1">text-3xl font-bold</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-dark">H3 · Semibold 24px</p>
                            <p className="text-xs text-slate font-mono mt-1">text-2xl font-semibold</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold text-dark">H4 · Semibold 20px</p>
                            <p className="text-xs text-slate font-mono mt-1">text-xl font-semibold</p>
                        </div>
                        <div>
                            <p className="text-base text-dark leading-relaxed">
                                Corps de texte — Regular 16px. Texte de contenu principal utilisé dans les cards, descriptions et paragraphes.
                            </p>
                            <p className="text-xs text-slate font-mono mt-1">text-base text-dark</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate leading-relaxed">
                                Texte secondaire — 14px. Métadonnées, dates, informations complémentaires.
                            </p>
                            <p className="text-xs text-slate font-mono mt-1">text-sm text-slate</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate uppercase tracking-widest">
                                Label / Caption — 12px uppercase
                            </p>
                            <p className="text-xs text-slate font-mono mt-1">text-xs font-semibold uppercase tracking-widest</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-ember">Texte accent — Ember</p>
                            <p className="text-xs text-slate font-mono mt-1">text-ember font-bold</p>
                        </div>
                    </Card>
                </Section>

                {/* ── 3. BOUTONS ────────────────────────────────────────────── */}
                <Section title="Boutons">
                    <Card className="p-6">
                        <div className="flex flex-wrap gap-3">

                            {/* Primaire — dégradé ember */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-6 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-xl text-sm hover:brightness-90 transition-all shadow-sm shadow-ember/25">
                                    Se connecter
                                </button>
                                <span className="text-xs text-slate">Primaire</span>
                            </div>

                            {/* Secondaire */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-6 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark font-semibold rounded-xl text-sm border border-slate/20 transition-colors">
                                    Modifier
                                </button>
                                <span className="text-xs text-slate">Secondaire</span>
                            </div>

                            {/* Danger */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-6 bg-ruby/10 hover:bg-ruby/20 text-ruby font-semibold rounded-xl text-sm border border-ruby/20 transition-colors">
                                    Supprimer
                                </button>
                                <span className="text-xs text-slate">Danger</span>
                            </div>

                            {/* Succès */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-6 bg-mint/10 hover:bg-mint/20 text-mint font-semibold rounded-xl text-sm border border-mint/20 transition-colors">
                                    Scanner ✓
                                </button>
                                <span className="text-xs text-slate">Succès</span>
                            </div>

                            {/* Ghost / outline */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-6 bg-transparent hover:bg-dark/5 text-dark font-semibold rounded-xl text-sm border-2 border-dark/30 hover:border-dark/50 transition-colors">
                                    Annuler
                                </button>
                                <span className="text-xs text-slate">Ghost</span>
                            </div>

                            {/* Désactivé */}
                            <div className="flex flex-col items-center gap-2">
                                <button disabled className="h-11 px-6 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-xl text-sm opacity-40 cursor-not-allowed">
                                    Désactivé
                                </button>
                                <span className="text-xs text-slate">Disabled</span>
                            </div>

                            {/* Chargement */}
                            <div className="flex flex-col items-center gap-2">
                                <button disabled className="h-11 px-6 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-xl text-sm flex items-center gap-2 opacity-80 cursor-not-allowed">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Chargement…
                                </button>
                                <span className="text-xs text-slate">Loading</span>
                            </div>

                            {/* Icon + texte */}
                            <div className="flex flex-col items-center gap-2">
                                <button className="h-11 px-5 bg-mint/10 hover:bg-mint/20 text-mint font-semibold rounded-xl text-sm border border-mint/20 transition-colors flex items-center gap-2">
                                    📷 Scanner
                                </button>
                                <span className="text-xs text-slate">Icône</span>
                            </div>

                        </div>

                        {/* Full width */}
                        <div className="mt-5 space-y-3">
                            <Label>Boutons pleine largeur</Label>
                            <button className="w-full h-12 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-xl text-sm hover:brightness-90 transition-all shadow-sm shadow-ember/20">
                                Valider la vente — 42.50€
                            </button>
                            <button className="w-full h-12 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark font-semibold rounded-xl text-sm border border-slate/20 transition-colors">
                                + Nouveau produit
                            </button>
                        </div>
                    </Card>
                </Section>

                {/* ── 4. CHAMPS DE SAISIE ───────────────────────────────────── */}
                <Section title="Champs de saisie">
                    <div className="grid sm:grid-cols-2 gap-4">

                        {/* Normal */}
                        <Card className="p-5">
                            <Label>État normal</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                placeholder="ex: sophie"
                                className="w-full h-12 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/50 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                            />
                        </Card>

                        {/* Focus (ring visible par défaut) */}
                        <Card className="p-5">
                            <Label>État focus (ember)</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Rechercher
                            </label>
                            <input
                                type="text"
                                defaultValue="collier"
                                className="w-full h-12 px-4 bg-white border-2 border-ember rounded-xl text-dark text-sm ring-2 ring-ember/15 outline-none transition-colors"
                            />
                        </Card>

                        {/* Erreur */}
                        <Card className="p-5">
                            <Label>État erreur</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                defaultValue="sophie"
                                className="w-full h-12 px-4 bg-white border-2 border-ruby rounded-xl text-dark text-sm ring-2 ring-ruby/15 outline-none"
                            />
                            <p className="text-ruby text-xs mt-2 flex items-center gap-1">
                                <span>⚠</span> Identifiant ou PIN incorrect
                            </p>
                        </Card>

                        {/* PIN */}
                        <Card className="p-5">
                            <Label>Champ PIN</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Code PIN
                            </label>
                            <div className="relative">
                                <input
                                    type={showPin ? 'text' : 'password'}
                                    defaultValue="1234"
                                    className="w-full h-12 px-4 pr-12 bg-white border border-slate/40 rounded-xl text-dark text-sm tracking-[0.4em] font-bold focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                    maxLength="6"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center text-slate hover:text-dark transition-colors"
                                >
                                    {showPin ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <p className="text-xs text-slate/60 mt-1.5">4 à 6 chiffres</p>
                        </Card>

                        {/* Textarea */}
                        <Card className="p-5 sm:col-span-2">
                            <Label>Textarea</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Description
                            </label>
                            <textarea
                                rows="3"
                                defaultValue="Marché artisanal de Noël, place de la mairie. Bijoux, céramique et créations locales."
                                className="w-full px-4 py-3 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors resize-none font-sans"
                            />
                        </Card>

                        {/* Select */}
                        <Card className="p-5 sm:col-span-2">
                            <Label>Select / Paiement</Label>
                            <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                Moyen de paiement
                            </label>
                            <select className="w-full h-11 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors">
                                <option>Espèces</option>
                                <option>Carte bancaire</option>
                                <option>Chèque</option>
                                <option>Virement</option>
                            </select>
                        </Card>

                    </div>
                </Section>

                {/* ── 5. CARDS ──────────────────────────────────────────────── */}
                <Section title="Cards & Layouts">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Card produit — stock OK */}
                        <Card className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-dark hover:text-ember transition-colors cursor-pointer">
                                    Collier Argent Étoile
                                </h3>
                                <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-mint/10 text-mint border border-mint/20">
                                    ✓ OK
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <span className="text-ember font-bold">28.00€</span>
                                <span className="text-slate">Stock : 14</span>
                                <span className="text-slate">Colliers</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors">
                                    ✏️ Modifier
                                </button>
                                <button className="flex-1 h-11 flex items-center justify-center bg-ruby/10 hover:bg-ruby/20 text-ruby rounded-xl text-sm font-medium transition-colors border border-ruby/20">
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </Card>

                        {/* Card produit — stock bas */}
                        <Card className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-dark">Bague Dorée Fleur</h3>
                                <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-ruby/10 text-ruby border border-ruby/20">
                                    ⚠ Bas
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <span className="text-ember font-bold">45.00€</span>
                                <span className="text-slate">Stock : 2</span>
                                <span className="text-slate">Bagues</span>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors">
                                    ✏️ Modifier
                                </button>
                                <button className="flex-1 h-11 flex items-center justify-center bg-ruby/10 hover:bg-ruby/20 text-ruby rounded-xl text-sm font-medium transition-colors border border-ruby/20">
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </Card>

                        {/* Card événement */}
                        <Card className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-dark">Marché de Noël 2026</h3>
                                <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-mint/10 text-mint border border-mint/20">
                                    En cours
                                </span>
                            </div>
                            <div className="text-sm text-slate space-y-1">
                                <p>📍 Place de la mairie</p>
                                <p>📅 14 déc. → 22 déc.</p>
                                <p>📦 8 produits</p>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 h-11 flex items-center justify-center bg-ember/10 hover:bg-ember/20 text-ember rounded-xl text-sm font-medium transition-colors border border-ember/20">
                                    Voir détails
                                </button>
                            </div>
                        </Card>

                    </div>
                </Section>

                {/* ── 6. BADGES / TAGS ──────────────────────────────────────── */}
                <Section title="Badges & Tags">
                    <Card className="p-6">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-mint/10 text-mint border border-mint/20">
                                ✓ Stock OK
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-ruby/10 text-ruby border border-ruby/20">
                                ⚠ Stock bas
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-mint/10 text-mint border border-mint/20">
                                🟢 En ligne
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-ruby/10 text-ruby border border-ruby/20">
                                🔴 Hors ligne
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-ember/10 text-ember border border-ember/20">
                                En cours
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate/10 text-slate border border-slate/20">
                                Planifié
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-dark/10 text-dark border border-dark/20">
                                Terminé
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate/10 text-slate border border-slate/20">
                                Espèces
                            </span>
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate/10 text-slate border border-slate/20">
                                Carte bancaire
                            </span>
                        </div>
                    </Card>
                </Section>

                {/* ── 7. NOTIFICATIONS ──────────────────────────────────────── */}
                <Section title="Notifications & Alertes">
                    <div className="space-y-3">

                        {/* Succès */}
                        <div className="flex items-start gap-3 p-4 bg-[#EEFAF5] border border-mint/40 rounded-xl text-sm">
                            <span className="text-mint text-lg leading-none mt-0.5">✓</span>
                            <div className="flex-1">
                                <p className="font-semibold text-dark">Vente enregistrée</p>
                                <p className="text-slate mt-0.5">Vente #247 · 42.50€ · Carte bancaire</p>
                            </div>
                            <button className="text-slate hover:text-dark text-lg leading-none">×</button>
                        </div>

                        {/* Succès hors ligne */}
                        <div className="flex items-start gap-3 p-4 bg-mint/10 border border-mint/30 rounded-xl text-sm">
                            <span className="text-mint text-lg leading-none mt-0.5">💾</span>
                            <div className="flex-1">
                                <p className="font-semibold text-dark">Vente sauvegardée hors ligne</p>
                                <p className="text-slate mt-0.5">Synchronisation automatique au retour de la connexion.</p>
                            </div>
                            <button className="text-slate hover:text-dark text-lg leading-none">×</button>
                        </div>

                        {/* Erreur */}
                        <div className="flex items-start gap-3 p-4 bg-[#FFF0E8] border border-ember/40 rounded-xl text-sm">
                            <span className="text-ember text-lg leading-none mt-0.5">⚠</span>
                            <div className="flex-1">
                                <p className="font-semibold text-dark">Stock insuffisant</p>
                                <p className="text-slate mt-0.5">Impossible d'ajouter plus que le stock disponible.</p>
                            </div>
                            <button className="text-slate hover:text-dark text-lg leading-none">×</button>
                        </div>

                        {/* Danger */}
                        <div className="flex items-start gap-3 p-4 bg-ruby/5 border border-ruby/30 rounded-xl text-sm">
                            <span className="text-ruby text-lg leading-none mt-0.5">✕</span>
                            <div className="flex-1">
                                <p className="font-semibold text-dark">Erreur de connexion</p>
                                <p className="text-slate mt-0.5">Identifiant ou PIN incorrect. Réessayez.</p>
                            </div>
                            <button className="text-slate hover:text-dark text-lg leading-none">×</button>
                        </div>

                        {/* Info / offline */}
                        <div className="flex items-start gap-3 p-4 bg-slate/5 border border-slate/20 rounded-xl text-sm">
                            <span className="text-slate text-lg leading-none mt-0.5">ℹ</span>
                            <div className="flex-1">
                                <p className="font-semibold text-dark">Mode hors ligne actif</p>
                                <p className="text-slate mt-0.5">Les ventes seront synchronisées automatiquement au retour de la connexion.</p>
                            </div>
                        </div>

                    </div>
                </Section>

                {/* ── 8. PANIER — ligne produit ─────────────────────────────── */}
                <Section title="Panier — Item">
                    <Card className="p-5 max-w-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-sm font-semibold text-dark truncate">Collier Argent Étoile</p>
                                <p className="text-xs text-slate mt-0.5">28.00€ × 3</p>
                            </div>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-ruby hover:bg-ruby/10 transition-colors text-lg leading-none shrink-0">
                                ×
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl transition-colors font-bold text-lg shrink-0">
                                −
                            </button>
                            <input
                                type="number"
                                defaultValue="3"
                                className="w-14 h-11 text-center bg-snow border border-slate/30 rounded-xl text-dark text-sm focus:outline-none focus:border-ember transition-colors"
                            />
                            <button className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl transition-colors font-bold text-lg shrink-0">
                                +
                            </button>
                            <span className="ml-auto text-base font-bold text-ember shrink-0">84.00€</span>
                        </div>
                    </Card>
                </Section>

                {/* ── 9. LOGIN CARD (aperçu isolé) ──────────────────────────── */}
                <Section title="Login card (aperçu)">
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                            <Card className="p-8">
                                <h2 className="text-lg font-semibold text-dark text-center mb-7">
                                    Connexion
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: sophie"
                                            className="w-full h-12 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                                            Code PIN
                                        </label>
                                        <input
                                            type="password"
                                            defaultValue="1234"
                                            className="w-full h-12 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm tracking-[0.4em] font-bold focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                        />
                                    </div>
                                    <button className="w-full h-12 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-xl flex items-center justify-center text-sm hover:brightness-90 transition-all shadow-sm shadow-ember/20">
                                        Se connecter
                                    </button>
                                </div>
                            </Card>
                            <p className="text-center mt-4 text-xs text-slate/60">CaisseMobile · Version 1.0</p>
                        </div>
                    </div>
                </Section>

            </main>
        </div>
    );
}
