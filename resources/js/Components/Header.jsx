import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useOnlineStatus from '../Hooks/useOnlineStatus';

export default function Header({ currentPage = 'dashboard' }) {
    const isOnline = useOnlineStatus();
    const [menuOpen, setMenuOpen] = useState(false);
    const { business } = usePage().props;
    const appName = business?.name || 'MKD CaisseConnect';

    const navItems = [
        { name: 'Dashboard',    href: '/',        key: 'dashboard' },
        { name: 'Produits',     href: '/products', key: 'products'  },
        { name: 'Ventes',       href: '/sales',    key: 'sales'     },
        { name: 'Événements',   href: '/events',   key: 'events'    },
        { name: 'Statistiques', href: '/stats',    key: 'stats'     },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
                <Link href="/" className="text-blue-600 font-extrabold text-lg tracking-tight shrink-0">
                    {appName}
                </Link>
                <nav className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link key={item.key} href={item.href}
                            className={`text-sm font-semibold transition-colors ${currentPage === item.key ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {isOnline ? 'En ligne' : 'Hors ligne'}
                    </div>
                    <Link href="/logout" method="post" as="button"
                        className="hidden lg:flex items-center justify-center h-9 px-4 bg-white/50 hover:bg-white/80 text-slate-600 hover:text-slate-800 border border-white/60 rounded-lg text-sm font-medium transition-all">
                        Déconnexion
                    </Link>
                    <button onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/50 text-slate-600 hover:text-slate-800 transition-colors"
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
                <div className="lg:hidden border-t border-white/30 bg-white/80 backdrop-blur-xl">
                    <nav className="px-4">
                        {navItems.map((item) => (
                            <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)}
                                className={`flex items-center h-12 text-sm font-semibold border-b border-slate-100/50 last:border-b-0 transition-colors ${currentPage === item.key ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex items-center justify-between py-3 border-t border-slate-100/50">
                            <div className={`flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {isOnline ? 'En ligne' : 'Hors ligne'}
                            </div>
                            <Link href="/logout" method="post" as="button"
                                className="flex items-center justify-center h-11 px-5 bg-white/50 hover:bg-white/80 text-slate-600 hover:text-slate-800 rounded-xl text-sm font-medium transition-all ml-auto">
                                Déconnexion
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
