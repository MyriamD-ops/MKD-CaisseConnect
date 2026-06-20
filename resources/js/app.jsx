// === REACT INERTIA APP ===
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { syncVentes } from './utils/sync';

// Synchronisation automatique au retour de la connexion
let syncTimeout;
window.addEventListener('online', () => {
    console.log('🟢 Connexion rétablie - Vérification des ventes à synchroniser...');
    
    // Attendre 2 secondes pour laisser la connexion se stabiliser
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            const count = await syncVentes();
            if (count > 0) {
                alert(`✅ ${count} vente(s) synchronisée(s) automatiquement !`);
                // Recharger si on est sur la page des ventes
                if (window.location.pathname === '/sales') {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Erreur synchronisation auto:', error);
        }
    }, 2000);
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
