import { Link } from '@inertiajs/react';
import { useState } from 'react';
import useOnlineStatus from '../Hooks/useOnlineStatus';

export default function Header({ currentPage = 'dashboard' }) {
    const isOnline = useOnlineStatus();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard',    href: '/',        key: 'dashboard' },
        { name: 'Produits',     href: '/products', key: 'products'  },
        { name: 'Ventes',       href: '/sales',    key: 'sales'     },
        { name: 'Événements',   href: '/events',   key: 'events'    },
        { name: 'Statistiques', href: '/stats',    key: 'stats'     },
    ];

    return (
        <header className="bg-snow border-b-2 border-slate/30 shadow-sm">
            <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
                <Link href="/" className="text-ember font-bold text-lg tracking-tight shrink-0">
                    CaisseMobile
                </Link>
                <nav className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link key={item.key} href={item.href}
                            className={`text-sm font-medium transition-colors ${currentPage === item.key ? 'text-ember' : 'text-slate hover:text-dark'}`}>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-mint/10 text-mint' : 'bg-ruby/10 text-ruby'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-mint' : 'bg-ruby'}`} />
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                    </div>
                    <Link href="/logout" method="post" as="button"
                        className="hidden lg:flex items-center justify-center h-9 px-4 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-lg text-sm font-medium transition-colors">
                        Déconnexion
                    </Link>
                    <button onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-slate/10 text-slate hover:text-dark transition-colors"
                        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen}>
                        {menuOpen ? (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="lg:hidden border-t border-slate/20 bg-white">
                    <nav className="px-4">
                        {navItems.map((item) => (
                            <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)}
                                className={`flex items-center h-12 text-sm font-medium border-b border-slate/10 last:border-b-0 transition-colors ${currentPage === item.key ? 'text-ember' : 'text-slate hover:text-dark'}`}>
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center justify-between py-3 border-t border-slate/10">
                            <div className={`flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-mint/10 text-mint' : 'bg-ruby/10 text-ruby'}`}>
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-mint' : 'bg-ruby'}`} />
                                {isOnline ? 'En ligne' : 'Hors ligne'}
                            </div>
                            <Link href="/logout" method="post" as="button"
                                className="flex items-center justify-center h-11 px-5 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark rounded-xl text-sm font-medium transition-colors ml-auto">
                                Déconnexion
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
