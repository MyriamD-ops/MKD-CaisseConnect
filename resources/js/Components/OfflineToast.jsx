import { useEffect, useRef, useState } from 'react';

const TOAST_DURATION = 5000;

export default function OfflineToast() {
    const [visible, setVisible] = useState(false);
    const dismissTimeout = useRef(null);

    useEffect(() => {
        function showToast() {
            clearTimeout(dismissTimeout.current);
            setVisible(true);
            dismissTimeout.current = setTimeout(() => setVisible(false), TOAST_DURATION);
        }

        window.addEventListener('offline-navigation', showToast);

        return () => {
            window.removeEventListener('offline-navigation', showToast);
            clearTimeout(dismissTimeout.current);
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed top-5 left-1/2 z-60 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-full bg-red-50 px-4 py-3 text-sm font-medium text-red-500 shadow-lg shadow-slate-900/10"
            role="alert"
        >
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span className="flex-1">Connexion indisponible — seule la vente en cours reste accessible hors ligne.</span>
            <button
                type="button"
                onClick={() => setVisible(false)}
                className="shrink-0 rounded-full px-2 py-1 text-lg leading-none text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                aria-label="Fermer le message"
            >
                ×
            </button>
        </div>
    );
}