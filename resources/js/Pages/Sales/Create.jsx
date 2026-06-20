import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import QRScanner from '../../Components/QRScanner';
import useOnlineStatus from '../../Hooks/useOnlineStatus';
import { saveVenteLocal, getProduitsLocal, syncProduits } from '../../utils/sync';

export default function Create({ products: serverProducts }) {
    const isOnline = useOnlineStatus();
    const [products, setProducts] = useState(serverProducts);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [moyenPaiement, setMoyenPaiement] = useState(['Espèces']);
    const [processing, setProcessing] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [showCart, setShowCart] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const [remiseGlobale, setRemiseGlobale] = useState('');
    const [remiseGlobaleType, setRemiseGlobaleType] = useState('euro');
    const [ventilation, setVentilation] = useState({});

    const notify = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => { loadProducts(); }, []);
    useEffect(() => { if (isOnline) syncProducts(); }, [isOnline]);

    const loadProducts = async () => {
        try {
            const localProducts = await getProduitsLocal();
            if (localProducts.length > 0) setProducts(localProducts);
        } catch (error) {
            console.error('Erreur chargement produits:', error);
        }
    };

    const syncProducts = async () => {
        if (!isOnline) return;
        try {
            const synced = await syncProduits();
            setProducts(synced);
        } catch (error) {
            console.error('Erreur sync:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categorie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        const existing = cart.find(item => item.id_produit === product.id_produit);
        if (existing) {
            if (existing.quantite < product.stock_actuel) {
                setCart(cart.map(item =>
                    item.id_produit === product.id_produit
                        ? { ...item, quantite: item.quantite + 1 }
                        : item
                ));
            } else {
                notify('error', 'Stock insuffisant');
            }
        } else {
            setCart([...cart, {
                id_produit: product.id_produit,
                nom: product.nom,
                prix_unitaire: product.prix_base,
                quantite: 1,
                stock_max: product.stock_actuel,
                remise: '',
                remise_type: 'euro',
            }]);
        }
    };

    const removeFromCart = (id_produit) => {
        setCart(cart.filter(item => item.id_produit !== id_produit));
    };

    const updateQuantity = (id_produit, quantite) => {
        if (quantite < 1) { removeFromCart(id_produit); return; }
        const item = cart.find(i => i.id_produit === id_produit);
        if (quantite > item.stock_max) { notify('error', 'Stock insuffisant'); return; }
        setCart(cart.map(item =>
            item.id_produit === id_produit ? { ...item, quantite } : item
        ));
    };

    const updateRemiseLigne = (id_produit, field, value) => {
        setCart(cart.map(item =>
            item.id_produit === id_produit ? { ...item, [field]: value } : item
        ));
    };

    const getPrixLigne = (item) => {
        const brut = item.prix_unitaire * item.quantite;
        const remise = parseFloat(item.remise) || 0;
        if (remise <= 0) return brut;
        return item.remise_type === 'percent'
            ? Math.max(0, brut - brut * (remise / 100))
            : Math.max(0, brut - remise);
    };

    const sousTotal = cart.reduce((sum, item) => sum + getPrixLigne(item), 0);
    const remiseGlobaleVal = parseFloat(remiseGlobale) || 0;
    const total = remiseGlobaleVal > 0
        ? Math.max(0, remiseGlobaleType === 'percent'
            ? sousTotal - sousTotal * (remiseGlobaleVal / 100)
            : sousTotal - remiseGlobaleVal)
        : sousTotal;

    const toggleMoyenPaiement = (moyen) => {
        setMoyenPaiement(prev => {
            if (prev.includes(moyen)) {
                if (prev.length === 1) return prev;
                const next = prev.filter(m => m !== moyen);
                setVentilation(v => { const copy = { ...v }; delete copy[moyen]; return copy; });
                return next;
            }
            return [...prev, moyen];
        });
    };

    const updateVentilation = (moyen, montant) => {
        const updated = { ...ventilation, [moyen]: montant };

        // Auto-remplir l'autre moyen quand il n'y en a que 2
        if (moyenPaiement.length === 2) {
            const autre = moyenPaiement.find(m => m !== moyen);
            const reste = Math.max(0, +(total - (parseFloat(montant) || 0)).toFixed(2));
            updated[autre] = reste.toString();
        }

        setVentilation(updated);
    };

    const totalVentile = Object.values(ventilation).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    const ventilationValide = moyenPaiement.length <= 1 || Math.abs(totalVentile - total) < 0.01;

    const handleQRScan = (qrCode) => {
        const product = products.find(p => p.code_barres === qrCode);
        if (product) {
            addToCart(product);
            setShowScanner(false);
        } else {
            notify('error', `Produit non trouvé — Code scanné : ${qrCode}`);
        }
        setShowScanner(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) { notify('error', 'Le panier est vide !'); return; }
        if (!ventilationValide) { notify('error', `La ventilation (${totalVentile.toFixed(2)}€) ne correspond pas au total (${total.toFixed(2)}€)`); return; }
        setProcessing(true);

        const venteData = {
            articles: cart.map(item => ({
                id_produit: item.id_produit,
                nom_produit: item.nom,
                quantite: item.quantite,
                prix_unitaire: item.prix_unitaire,
                remise: parseFloat(item.remise) || 0,
                remise_type: item.remise_type || 'euro',
                sous_total: getPrixLigne(item),
            })),
            mode_paiement: moyenPaiement,
            montant_total: total,
            remise_globale: remiseGlobaleVal,
            remise_globale_type: remiseGlobaleType,
            date_vente: new Date().toISOString(),
        };

        if (!isOnline) {
            try {
                await saveVenteLocal(venteData);
                setCart([]);
                setShowCart(false);
                setProcessing(false);
                notify('success', 'Vente sauvegardée hors ligne — synchronisation automatique au retour de la connexion.');
            } catch (error) {
                notify('error', 'Erreur lors de la sauvegarde locale');
                setProcessing(false);
            }
            return;
        }

        const formData = {
            items: cart.map(item => ({
                id_produit: item.id_produit,
                quantite: item.quantite,
                prix_unitaire: item.prix_unitaire,
                remise: parseFloat(item.remise) || 0,
                remise_type: item.remise_type || 'euro',
            })),
            moyen_paiement: moyenPaiement,
            ventilation: moyenPaiement.length > 1 ? ventilation : null,
            remise_globale: remiseGlobaleVal,
            remise_globale_type: remiseGlobaleType,
        };

        router.post('/sales', formData, {
            onSuccess: () => {
                setCart([]);
                setShowCart(false);
                setRemiseGlobale('');
                setVentilation({});
                setProcessing(false);
            },
            onError: (errors) => {
                console.error('Erreurs:', errors);
                notify('error', "Erreur lors de l'enregistrement");
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    // ── Toggle €/% réutilisable ────────────────────────────────────────────────
    const TypeToggle = ({ value, onChange }) => (
        <div className="flex rounded-lg border border-slate/30 overflow-hidden shrink-0">
            <button
                type="button"
                onClick={() => onChange('euro')}
                className={`w-10 h-10 text-sm font-bold transition-colors ${
                    value === 'euro' ? 'bg-ember text-white' : 'bg-white text-slate'
                }`}
            >€</button>
            <button
                type="button"
                onClick={() => onChange('percent')}
                className={`w-10 h-10 text-sm font-bold transition-colors border-l border-slate/30 ${
                    value === 'percent' ? 'bg-ember text-white' : 'bg-white text-slate'
                }`}
            >%</button>
        </div>
    );

    // ── JSX du contenu panier ──────────────────────────────────────────────────
    const renderCartContent = (onClose) => (
        <div className="flex flex-col flex-1 min-h-0">
            {/* En-tête panier */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate/20 shrink-0">
                <h2 className="font-semibold text-dark">
                    Panier
                    <span className="ml-2 px-2 py-0.5 bg-ember/10 text-ember text-xs rounded-full font-bold">
                        {cart.length}
                    </span>
                </h2>
                <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                        showClearConfirm ? (
                            <div className="flex items-center gap-2">
                                <span className="text-slate text-xs">Vider ?</span>
                                <button onClick={() => { setCart([]); setShowClearConfirm(false); }} className="text-ruby text-xs font-semibold">Oui</button>
                                <button onClick={() => setShowClearConfirm(false)} className="text-slate text-xs">Non</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowClearConfirm(true)} className="flex items-center gap-1 px-2.5 h-7 bg-ruby/10 text-ruby text-xs font-medium rounded-lg border border-ruby/20">
                                🗑️ Vider
                            </button>
                        )
                    )}
                    {onClose && (
                        <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate/10 text-slate text-lg leading-none">×</button>
                    )}
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-4xl mb-3 grayscale">🛒</span>
                        <p className="text-slate text-sm">Panier vide</p>
                        <p className="text-slate/50 text-xs mt-1">Appuyez sur un produit pour l'ajouter</p>
                    </div>
                ) : (
                    cart.map((item) => {
                        const remiseVal = parseFloat(item.remise) || 0;
                        const economie = remiseVal > 0
                            ? item.remise_type === 'percent'
                                ? (item.prix_unitaire * item.quantite) * (remiseVal / 100)
                                : remiseVal
                            : 0;

                        return (
                            <div key={item.id_produit} className="bg-snow rounded-xl p-3 border border-slate/20">
                                {/* Nom + supprimer */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <p className="text-sm font-medium text-dark truncate">{item.nom}</p>
                                        <p className="text-xs text-slate mt-0.5">{item.prix_unitaire}€ × {item.quantite}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id_produit)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ruby hover:bg-ruby/10 text-lg leading-none shrink-0">×</button>
                                </div>

                                {/* Quantité + prix ligne */}
                                <div className="flex items-center gap-2 mb-3">
                                    <button onClick={() => updateQuantity(item.id_produit, item.quantite - 1)} className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl font-bold text-lg shrink-0">−</button>
                                    <input
                                        type="number"
                                        value={item.quantite}
                                        onChange={(e) => updateQuantity(item.id_produit, parseInt(e.target.value) || 0)}
                                        className="w-14 h-11 text-center bg-white border border-slate/30 rounded-xl text-dark text-sm focus:outline-none focus:border-ember"
                                    />
                                    <button onClick={() => updateQuantity(item.id_produit, item.quantite + 1)} className="w-11 h-11 flex items-center justify-center bg-slate/10 hover:bg-ember/10 hover:text-ember text-dark rounded-xl font-bold text-lg shrink-0">+</button>
                                    <span className="ml-auto text-sm font-bold text-ember shrink-0">{getPrixLigne(item).toFixed(2)}€</span>
                                </div>

                                {/* Remise article — design mobile optimisé */}
                                <div className="pt-2 border-t border-slate/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate font-medium">Remise article</span>
                                        {economie > 0 && (
                                            <span className="text-xs font-semibold text-ruby">−{economie.toFixed(2)}€</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 items-center overflow-hidden">
                                        <TypeToggle
                                            value={item.remise_type}
                                            onChange={(val) => updateRemiseLigne(item.id_produit, 'remise_type', val)}
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={item.remise}
                                            onChange={(e) => updateRemiseLigne(item.id_produit, 'remise', e.target.value)}
                                            className="flex-1 h-10 px-3 bg-white border border-slate/30 rounded-lg text-dark text-sm text-center focus:outline-none focus:border-ember"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

            {/* Pied panier */}
            {cart.length > 0 && (
                <div className="p-4 border-t border-slate/20 space-y-3 overflow-y-auto max-h-[55vh]">
                    {/* Sous-total */}
                    <div className="flex justify-between items-center">
                        <span className="text-slate text-sm">Sous-total</span>
                        <span className="text-sm text-dark">{sousTotal.toFixed(2)}€</span>
                    </div>

                    {/* Remise globale — design mobile optimisé */}
                    <div className="p-3 bg-snow rounded-xl border border-slate/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate">Remise globale</span>
                            {remiseGlobaleVal > 0 && (
                                <span className="text-xs font-semibold text-ruby">
                                    −{(remiseGlobaleType === 'percent'
                                        ? sousTotal * (remiseGlobaleVal / 100)
                                        : remiseGlobaleVal
                                    ).toFixed(2)}€
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 items-center overflow-hidden">
                            <TypeToggle value={remiseGlobaleType} onChange={setRemiseGlobaleType} />
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={remiseGlobale}
                                onChange={(e) => setRemiseGlobale(e.target.value)}
                                className="flex-1 h-10 px-3 bg-white border border-slate/30 rounded-lg text-dark text-sm text-center focus:outline-none focus:border-ember"
                            />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-slate/20 pt-2">
                        <span className="text-slate text-sm font-medium">Total</span>
                        <span className="text-2xl font-bold text-dark">{total.toFixed(2)}€</span>
                    </div>

                    {/* Moyen(s) de paiement — combinables */}
                    <div className="p-3 bg-snow rounded-xl border border-slate/20">
                        <span className="text-xs font-medium text-slate block mb-2">Moyen(s) de paiement</span>
                        <div className="grid grid-cols-2 gap-2">
                            {['Espèces', 'Carte bancaire', 'Chèque', 'Virement'].map((moyen) => (
                                <button
                                    key={moyen}
                                    type="button"
                                    onClick={() => toggleMoyenPaiement(moyen)}
                                    className={`h-11 px-3 rounded-xl text-sm font-medium transition-all border ${
                                        moyenPaiement.includes(moyen)
                                            ? 'bg-ember text-white border-ember shadow-sm shadow-ember/20'
                                            : 'bg-white text-slate border-slate/30 hover:border-ember/40'
                                    }`}
                                >
                                    {moyen === 'Espèces' && '💵 '}
                                    {moyen === 'Carte bancaire' && '💳 '}
                                    {moyen === 'Chèque' && '📝 '}
                                    {moyen === 'Virement' && '🏦 '}
                                    {moyen}
                                </button>
                            ))}
                        </div>
                        {moyenPaiement.length > 1 && (
                            <div className="mt-3 space-y-2 pt-3 border-t border-slate/10">
                                <span className="text-xs font-medium text-slate">Répartition du montant</span>
                                {moyenPaiement.map((m) => (
                                    <div key={m} className="flex items-center gap-2">
                                        <span className="text-xs text-dark flex-1 truncate">{m}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={ventilation[m] || ''}
                                            onChange={(e) => updateVentilation(m, e.target.value)}
                                            className="w-28 h-9 px-3 bg-white border border-slate/30 rounded-lg text-sm text-right focus:outline-none focus:border-ember"
                                        />
                                        <span className="text-xs text-slate">€</span>
                                    </div>
                                ))}
                                <p className={`text-xs font-medium text-center pt-1 ${ventilationValide ? 'text-mint' : 'text-ruby'}`}>
                                    {ventilationValide
                                        ? '✓ Répartition correcte'
                                        : `Reste à répartir : ${(total - totalVentile).toFixed(2)}€`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Valider */}
                    <button onClick={handleSubmit} disabled={processing || !ventilationValide} className="w-full h-12 bg-linear-to-r from-ember to-ember-dim hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-ember/20">
                        {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {processing ? 'Traitement...' : (isOnline ? 'Valider la vente' : '💾 Sauvegarder hors ligne')}
                    </button>
                </div>
            )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="sales" />

            {notification && (
                <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-xl text-sm font-medium flex items-start gap-3 shadow-xl ${
                    notification.type === 'success' ? 'bg-mint/10 border border-mint/40 text-dark' : 'bg-ruby/5 border border-ruby/30 text-dark'
                }`}>
                    <span className={`text-lg leading-none mt-0.5 ${notification.type === 'success' ? 'text-mint' : 'text-ruby'}`}>
                        {notification.type === 'success' ? '✓' : '⚠'}
                    </span>
                    <span className="flex-1 leading-relaxed">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="text-slate hover:text-dark font-bold text-lg leading-none shrink-0">×</button>
                </div>
            )}

            <main className="p-4 lg:p-6 max-w-7xl mx-auto pb-28 lg:pb-6">
                <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:h-[calc(100vh-8rem)]">

                    {/* Produits */}
                    <div className="bg-white rounded-2xl border border-slate/20 shadow-sm flex flex-col overflow-hidden mb-4 lg:mb-0">
                        <div className="p-4 border-b border-slate/20 shrink-0">
                            <h2 className="text-base font-semibold text-dark mb-3">Produits</h2>
                            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-11 px-4 bg-snow border border-slate/30 rounded-xl text-dark text-sm placeholder:text-slate/40 focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/15 mb-2" />
                            <button onClick={() => setShowScanner(true)} className="w-full h-11 bg-mint/10 text-mint border border-mint/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                                📷 Scanner un produit
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {filteredProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-4xl mb-3 grayscale">📦</p>
                                    <p className="text-slate text-sm">Aucun produit trouvé</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {filteredProducts.map((product) => (
                                        <button key={product.id_produit} onClick={() => addToCart(product)} disabled={product.stock_actuel === 0}
                                            className={`p-4 rounded-xl text-left border transition-all ${product.stock_actuel === 0 ? 'bg-snow border-slate/20 opacity-40 cursor-not-allowed' : 'bg-snow border-slate/20 hover:border-ember/40 hover:bg-ember/5 active:scale-95 cursor-pointer'}`}>
                                            <p className="text-sm font-semibold text-dark mb-1 truncate">{product.nom}</p>
                                            <p className="text-base font-bold text-ember">{product.prix_base}€</p>
                                            <p className={`text-xs mt-1 ${product.stock_actuel === 0 ? 'text-ruby' : 'text-slate'}`}>Stock : {product.stock_actuel}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panier desktop */}
                    <div className="hidden lg:flex flex-col bg-white rounded-2xl border border-slate/20 shadow-sm overflow-hidden">
                        {renderCartContent(null)}
                    </div>
                </div>
            </main>

            {/* Barre mobile */}
            {cart.length > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate/20 z-30">
                    <button onClick={() => setShowCart(true)} className="w-full h-14 bg-linear-to-r from-ember to-ember-dim text-white font-bold rounded-2xl flex items-center justify-between px-5 shadow-sm shadow-ember/20">
                        <span className="flex items-center gap-2.5">
                            <span className="bg-white/25 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{cart.length}</span>
                            <span>Voir le panier</span>
                        </span>
                        <span className="text-lg font-bold">{total.toFixed(2)}€</span>
                    </button>
                </div>
            )}

            {/* Bottom sheet */}
            {showCart && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col border-t border-slate/20 overflow-hidden">
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 bg-slate/20 rounded-full" />
                        </div>
                        {renderCartContent(() => setShowCart(false))}
                    </div>
                </div>
            )}

            {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
        </div>
    );
}
