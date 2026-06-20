import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter le statut de connexion
 * Retourne true si en ligne, false si hors ligne
 */
export default function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        // Fonction appelée quand la connexion revient
        function handleOnline() {
            console.log('🟢 Connexion rétablie');
            setIsOnline(true);
        }

        // Fonction appelée quand la connexion est perdue
        function handleOffline() {
            console.log('🔴 Connexion perdue');
            setIsOnline(false);
        }

        // Écouter les événements de changement de connexion
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Nettoyage lors du démontage du composant
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
