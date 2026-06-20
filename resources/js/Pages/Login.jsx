import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const { flash } = usePage().props;
    const [showPin, setShowPin] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        pin: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onError: (errors) => {
                console.log('Erreurs de validation:', errors);
            },
        });
    };

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setData('pin', value);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-snow">
            {/* Éléments décoratifs flous */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-ember rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-dark rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none" />

            {/* Dégradé de fond */}
            <div className="absolute inset-0 bg-gradient-to-br from-snow via-snow/95 to-slate/20 pointer-events-none" />

            <div className="relative w-full max-w-sm z-10">
                {/* Logo et titre */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-3 drop-shadow-lg">💎</div>
                    <h1 className="text-4xl font-bold text-dark tracking-tight">
                        CaisseMobile
                    </h1>
                    <p className="text-slate text-sm mt-1">Point de vente artisanal</p>
                </div>

                {/* Connexion */}
                <h2 className="text-xl font-semibold text-dark text-center mb-7">
                    Connexion
                </h2>

                {/* Flash succès */}
                {flash?.success && (
                    <div className="mb-5 p-4 bg-mint/10 border border-mint/30 rounded-xl text-dark text-sm flex items-center gap-2">
                        <span className="text-mint text-lg">✓</span>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Erreur */}
                {(errors.username || errors.pin) && (
                    <div className="mb-5 p-4 bg-ruby/5 border border-ruby/30 rounded-xl text-dark text-sm flex items-center gap-2">
                        <span className="text-ruby text-lg">⚠</span>
                        <span>{errors.username || errors.pin}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Champ utilisateur */}
                    <div>
                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-slate/40 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                            autoFocus
                            autoComplete="username"
                            placeholder="ex: sophie"
                        />
                    </div>

                    {/* Champ PIN */}
                    <div>
                        <label className="block text-xs font-semibold text-dark uppercase tracking-widest mb-2">
                            Code PIN
                        </label>
                        <div className="relative">
                            <input
                                type={showPin ? 'text' : 'password'}
                                value={data.pin}
                                onChange={handlePinChange}
                                className="w-full h-12 px-4 pr-12 bg-white border border-slate/40 rounded-xl text-dark text-sm tracking-[0.4em] font-bold focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 transition-colors"
                                maxLength="6"
                                autoComplete="off"
                                placeholder="••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center text-slate hover:text-dark transition-colors"
                                aria-label="Afficher/masquer le PIN"
                            >
                                {showPin ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <p className="text-xs text-slate/60 mt-1.5">4 à 6 chiffres</p>
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full h-12 bg-linear-to-r from-ember to-ember-dim hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-ember/30"
                    >
                        {processing && (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {processing ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                {/* Version */}
                <p className="text-center mt-6 text-xs text-slate/60">
                    CaisseMobile · Version 1.0
                </p>
            </div>
        </div>
    );
}
